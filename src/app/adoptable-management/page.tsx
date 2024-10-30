"use client";
import React, { useEffect, useState } from "react";
import {
  
  Alert,
  Snackbar,
  TextField,
  Tab,
  Tabs,
  Box,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  fetchAdoptionRequests,
  fetchAdoptionRequestsByPetId, 
  updateAdoptionRequestStatus,
} from "../../lib/features/adopt/adoptSlice";
import { fetchPetById, updateAdoptedStatus } from "@/lib/features/pet/petSlice";
import { fetchUserData } from "@/lib/features/user/userSlice"; // Assume this action exists
import { jwtDecode } from "jwt-decode";
import { Modal, Typography as AntTypography, Button as AntButton, Spin } from "antd";
const { Text, Title } = AntTypography;
import { Table as AntTable } from "antd"; // Thêm import này

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

function getCurrentShelterStaffId() {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);
      return decodedToken.id;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
  return null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AdoptableManagement: React.FC<{ petId?: string }> = ({ petId }) => {
  const dispatch = useAppDispatch();
  const requestsStatus = useAppSelector((state) => state.adoption.status);
  const error = useAppSelector((state) => state.adoption.error);

  const [adoptionRequestsWithPetInfo, setAdoptionRequestsWithPetInfo] =
    useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");
  const [petAdoptionSummary, setPetAdoptionSummary] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [reviewerNames, setReviewerNames] = useState<{ [key: string]: string }>(
    {}
  );

  // Thêm state mới
  const [notificationDialog, setNotificationDialog] = useState({
    open: false,
    message: "",
    title: "",
  });

  useEffect(() => {
    if (petId) {
      dispatch(fetchAdoptionRequestsByPetId(petId));
    } else {
      dispatch(fetchAdoptionRequests());
    }
  }, [dispatch, petId]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await dispatch(fetchAdoptionRequests()).unwrap();

        const requestsWithPetInfo = await Promise.all(
          requests.map(async (request: any) => {
            try {
              const pet = await dispatch(fetchPetById(request.petId)).unwrap();
              const user = await dispatch(
                fetchUserData(request.userId)
              ).unwrap();

              // Update userNames state
              setUserNames((prev) => ({
                ...prev,
                [request.userId]: user.name,
              }));

              return {
                ...request,
                petName: pet.name,
                petImage: pet.image,
              };
            } catch (error) {
              console.error(
                `Failed to fetch pet or user info for request ${request._id}:`,
                error
              );
            }
          })
        );

        const filteredRequests = requestsWithPetInfo.filter(Boolean);
        setAdoptionRequestsWithPetInfo(filteredRequests);

        // Create summary of adoption requests per pet
        const summary = filteredRequests.reduce((acc: any, request: any) => {
          if (!acc[request.petId]) {
            acc[request.petId] = {
              petId: request.petId,
              petName: request.petName,
              petImage: request.petImage,
              requestCount: 0,
            };
          }
          acc[request.petId].requestCount++;
          return acc;
        }, {});

        setPetAdoptionSummary(Object.values(summary));
      } catch (error) {
        setSnackbarMessage(
          "Failed to fetch adoption requests or pet information."
        );
        setSnackbarOpen(true);
      }
    };

    fetchRequests();
  }, [dispatch]);

  useEffect(() => {
    const fetchReviewerNames = async () => {
      const reviewerIds = adoptionRequestsWithPetInfo
        .map((request) => request.reviewBy)
        .filter(Boolean);

      const uniqueReviewerIds = Array.from(new Set(reviewerIds));

      for (const reviewerId of uniqueReviewerIds) {
        try {
          const reviewer = await dispatch(fetchUserData(reviewerId)).unwrap();
          setReviewerNames((prev) => ({
            ...prev,
            [reviewerId]: reviewer.name,
          }));
        } catch (error) {
          console.error(
            `Failed to fetch reviewer info for ID ${reviewerId}:`,
            error
          );
        }
      }
    };

    if (adoptionRequestsWithPetInfo.length > 0) {
      fetchReviewerNames();
    }
  }, [adoptionRequestsWithPetInfo, dispatch]);

  const showModal = (requestId: string, status: string) => {
    setCurrentRequestId(requestId);
    setNewStatus(status);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (newStatus === "REJECTED" || newStatus === "APPROVED") {
        const shelterStaffId = getCurrentShelterStaffId();

        if (!shelterStaffId) {
          throw new Error("Shelter staff ID not found");
        }

        const currentRequest = adoptionRequestsWithPetInfo.find(
          (request) => request._id === currentRequestId
        );

        if (!currentRequest) {
          throw new Error("Request not found");
        }

        // Cập nhật trạng thái yêu cầu hiện tại
        await dispatch(
          updateAdoptionRequestStatus({
            requestId: currentRequestId!,
            status: newStatus,
            comment,
            reviewBy: shelterStaffId,
          })
        ).unwrap();

        // Chỉ khi APPROVED mới xử lý thêm
        if (newStatus === "APPROVED") {
          // 1. Tìm và tự động reject các yêu cầu pending khác của cùng pet
          const otherRequests = adoptionRequestsWithPetInfo.filter(
            (request) =>
              request.petId === currentRequest.petId &&
              request._id !== currentRequestId &&
              request.status === "PENDING"
          );

          for (const request of otherRequests) {
            await dispatch(
              updateAdoptionRequestStatus({
                requestId: request._id,
                status: "REJECTED",
                comment: "Auto rejected as another request was approved",
                reviewBy: shelterStaffId,
              })
            ).unwrap();
          }

          // 2. Chỉ khi APPROVED mới cập nhật isAdopted thành true
          await dispatch(
            updateAdoptedStatus({
              petId: currentRequest.petId,
              isAdopted: true,
            })
          ).unwrap();

          // Log để kiểm tra
          console.log(
            `Updated isAdopted status for pet ${currentRequest.petId} to true`
          );
        }

        // Cập nhật UI
        setAdoptionRequestsWithPetInfo((prevRequests) =>
          prevRequests.map((request) => {
            if (request._id === currentRequestId) {
              return {
                ...request,
                status: newStatus,
                comment,
                reviewBy: shelterStaffId,
              };
            }
            // Nếu APPROVED, cập nhật trạng thái các yêu cầu khác của cùng pet
            if (
              newStatus === "APPROVED" &&
              request.petId === currentRequest.petId &&
              request.status === "PENDING"
            ) {
              return {
                ...request,
                status: "REJECTED",
                comment: "Auto rejected as another request was approved",
                reviewBy: shelterStaffId,
              };
            }
            return request;
          })
        );

        // Hiển thị thông báo phù hợp
        setNotificationDialog({
          open: true,
          title:
            newStatus === "APPROVED"
              ? "Approval Successful"
              : "Rejection Successful",
          message:
            newStatus === "APPROVED"
              ? `The adoption request has been approved successfully. All other pending requests for this pet have been automatically rejected.`
              : `The adoption request has been rejected successfully.`,
        });

        setFilter(newStatus);
        setActiveTab(1);
      }
    } catch (error) {
      setNotificationDialog({
        open: true,
        title: "Error",
        message: "Failed to update status.",
      });
    }

    setIsModalVisible(false);
    setComment("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setComment("");
  };

  const columns = [
    {
      title: "Pet Name",
      dataIndex: "petName",
      key: "petName",
    },
    {
      title: "Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (image: string) => (
        <img src={image} alt="Pet" style={{ width: 60, height: 60 }} />
      ),
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          PENDING: "bg-yellow-200 text-yellow-900",
          APPROVED: "bg-green-200 text-green-900",
          REJECTED: "bg-red-200 text-red-900",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full font-medium ${
              statusColors[status] || ""
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Request Adopt By",
      dataIndex: "userId",
      key: "adoptBy",
      render: (userId: string) => userNames[userId] || userId || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) => (
        <>
          {record.status === "PENDING" ? (
            <>
              <AntButton
                type="primary"
                style={{
                  marginRight: 8,
                  backgroundColor: "#52c41a",
                }}
                onClick={() => showModal(record._id, "APPROVED")}
              >
                Approve
              </AntButton>
              <AntButton
                danger
                type="primary"
                onClick={() => showModal(record._id, "REJECTED")}
              >
                Reject
              </AntButton>
            </>
          ) : (
            <AntButton type="primary" onClick={() => showViewModal(record)}>
              View
            </AntButton>
          )}
        </>
      ),
    },
  ];

  const petSummaryColumns = [
    {
      title: "Pet Name",
      dataIndex: "petName",
      key: "petName",
    },
    {
      title: "Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (image: string) => (
        <img src={image} alt="Pet" style={{ width: 60, height: 60 }} />
      ),
    },
    {
      title: "Number of Requests",
      dataIndex: "requestCount",
      key: "requestCount",
    },
  ];

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const showViewModal = (record: any) => {
    setSelectedRequest(record);
    setViewModalVisible(true);
  };

  const getFilteredRequestsByAdopter = (
    requests: any[],
    status: string | null
  ) => {
    let filteredByStatus = requests;

    if (status) {
      filteredByStatus = requests.filter(
        (request) => request.status === status
      );
    }

    if (!searchTerm) {
      return filteredByStatus;
    }

    return filteredByStatus.filter((request) => {
      const adopterName = userNames[request.userId] || "";
      return adopterName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ marginTop: 50 }}>
      {/* Add search bar */}
      <div className="mb-4 px-3">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by adopter name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#e5e7eb",
              },
              "&:hover fieldset": {
                borderColor: "#d1d5db",
              },
            },
          }}
        />
      </div>

      {requestsStatus === "loading" ? (
        <LoadingSpinner />
      ) : requestsStatus === "failed" ? (
        <Alert severity="error">Error: {error}</Alert>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
            >
              <Tab className="text-black" label="Pet Adoption Summary" />
              <Tab className="text-yellow-500" label="Pending Requests" />
              <Tab className="text-green-500" label="Approved Requests" />
              <Tab className="text-red-500" label="Rejected Requests" />
            </Tabs>
          </Box>
          <TabPanel value={activeTab} index={0}>
            <AntTable
              columns={petSummaryColumns}
              dataSource={petAdoptionSummary}
              rowKey="petId"
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <AntTable
              columns={columns}
              dataSource={getFilteredRequestsByAdopter(
                adoptionRequestsWithPetInfo,
                "PENDING"
              )}
              rowKey="_id"
            />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <AntTable
              columns={columns}
              dataSource={getFilteredRequestsByAdopter(
                adoptionRequestsWithPetInfo,
                "APPROVED"
              )}
              rowKey="_id"
            />
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <AntTable
              columns={columns}
              dataSource={getFilteredRequestsByAdopter(
                adoptionRequestsWithPetInfo,
                "REJECTED"
              )}
              rowKey="_id"
            />
          </TabPanel>
        </Box>
      )}
      <Modal
        open={isModalVisible}
        title="Enter a comment"
        onCancel={handleCancel}
        footer={[
          <AntButton key="cancel" onClick={handleCancel}>
            Cancel
          </AntButton>,
          <AntButton
            key="submit"
            type="primary"
            style={
              newStatus === "APPROVED"
                ? { backgroundColor: "#52c41a" }
                : { backgroundColor: "#ff4d4f" }
            }
            onClick={handleOk}
          >
            {newStatus === "APPROVED" ? "Approve" : "Reject"}
          </AntButton>,
        ]}
      >
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Comment"
          type="text"
          fullWidth
          variant="standard"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>
      <Modal
        open={viewModalVisible}
        title={<Title level={4}>Request Details</Title>}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <AntButton
            key="close"
            type="primary"
            onClick={() => setViewModalVisible(false)}
          >
            Close
          </AntButton>,
        ]}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <Text strong>Pet Name: </Text>
              <Text>{selectedRequest.petName}</Text>
            </div>

            <div>
              <Text strong>Status: </Text>
              <Text>
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    selectedRequest.status === "PENDING"
                      ? "bg-yellow-200 text-yellow-900"
                      : selectedRequest.status === "APPROVED"
                      ? "bg-green-200 text-green-900"
                      : "bg-red-200 text-red-900"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </Text>
            </div>

            <div>
              <Text strong>Request Date: </Text>
              <Text>
                {new Date(selectedRequest.requestDate).toLocaleDateString()}
              </Text>
            </div>

            <div>
              <Text strong>Comment: </Text>
              <Text>{selectedRequest.comment}</Text>
            </div>

            {selectedRequest.adoptionDate && (
              <div>
                <Text strong>Adoption Date: </Text>
                <Text>
                  {new Date(selectedRequest.adoptionDate).toLocaleDateString()}
                </Text>
              </div>
            )}

            <div>
              <Text strong>Reviewed By: </Text>
              <Text>
                {selectedRequest.reviewBy
                  ? reviewerNames[selectedRequest.reviewBy] || "Loading..."
                  : "Not reviewed yet"}
              </Text>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={notificationDialog.open}
        title={notificationDialog.title}
        onCancel={() =>
          setNotificationDialog((prev) => ({ ...prev, open: false }))
        }
        footer={[
          <AntButton
            key="close"
            type="primary"
            onClick={() =>
              setNotificationDialog((prev) => ({ ...prev, open: false }))
            }
          >
            Close
          </AntButton>,
        ]}
      >
        <p>{notificationDialog.message}</p>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdoptableManagement;

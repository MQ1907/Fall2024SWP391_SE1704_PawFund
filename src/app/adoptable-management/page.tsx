"use client";
import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, message, Button, Modal, Input, Dropdown, Menu, Tabs } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  fetchAdoptionRequests,
  fetchAdoptionRequestsByPetId,
  updateAdoptionRequestStatus,
} from "../../lib/features/adopt/adoptSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const { TabPane } = Tabs;

const AdoptableManagement: React.FC<{ petId?: string }> = ({ petId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const requestsStatus = useAppSelector((state) => state.adoption.status);
  const error = useAppSelector((state) => state.adoption.error);

  const [adoptionRequestsWithPetInfo, setAdoptionRequestsWithPetInfo] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");
  const [filterButtonText, setFilterButtonText] = useState("Manage Requests");
  const [petAdoptionSummary, setPetAdoptionSummary] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("1");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;

        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            setRole(response.data.role);

            if (response.data.role !== "SHELTER_STAFF") {
              router.push("/errorpage");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            router.push("/error");
          }
        };

        fetchUser();
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/error");
      }
    } else {
      router.push("/error");
    }
  }, [router]);

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
              return {
                ...request,
                petName: pet.name,
                petImage: pet.image,
              };
            } catch (error) {
              console.error(`Failed to fetch pet info for request ${request._id}:`, error);
            }
          })
        );

        const filteredRequests = requestsWithPetInfo.filter(Boolean);
        setAdoptionRequestsWithPetInfo(filteredRequests);

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
        message.error("Failed to fetch adoption requests or pet information.");
      }
    };

    fetchRequests();
  }, [dispatch]);

  const showModal = (requestId: string, status: string) => {
    setCurrentRequestId(requestId);
    setNewStatus(status);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (newStatus === "REJECTED" || newStatus === "APPROVED") {
        await dispatch(
          updateAdoptionRequestStatus({
            requestId: currentRequestId!,
            status: newStatus,
            comment,
          })
        ).unwrap();
        setAdoptionRequestsWithPetInfo((prevRequests) =>
          prevRequests.map((request) =>
            request._id === currentRequestId ? { ...request, status: newStatus, comment } : request
          )
        );
        message.success(`Adoption request ${newStatus.toLowerCase()}.`);

        setFilter(newStatus);
        setFilterButtonText(getFilterButtonText(newStatus));
        setActiveTab("2");
      }
    } catch (error) {
      message.error("Failed to update status.");
    }

    setIsModalVisible(false);
    setComment("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setComment("");
  };

  const handleMenuClick = (e: any) => {
    setFilter(e.key);
    setFilterButtonText(getFilterButtonText(e.key));
  };

  const getFilterButtonText = (key: string) => {
    switch (key) {
      case "ALL":
        return "ALL ADOPTION REQUESTS";
      case "APPROVED":
        return "APPROVED ADOPTIONS";
      case "REJECTED":
        return "REJECTED ADOPTIONS";
      default:
        return "MANAGE REQUESTS";
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="ALL">ALL ADOPTION REQUESTS</Menu.Item>
      <Menu.Item key="APPROVED"> APPROVED ADOPTIONS</Menu.Item>
      <Menu.Item key="REJECTED">REJECTED ADOPTIONS</Menu.Item>
    </Menu>
  );

  const filteredRequests = adoptionRequestsWithPetInfo.filter((request) => {
    if (filter === "APPROVED") return request.status === "APPROVED";
    if (filter === "REJECTED") return request.status === "REJECTED";
    return request.status !== "APPROVED" && request.status !== "REJECTED";
  });

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
      render: (image: string) => <img src={image} alt="Pet" style={{ width: "100px", height: "100px" }} />,
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Adoption Date",
      dataIndex: "adoptionDate",
      key: "adoptionDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: { _id: string; status: string }) => (
        <span>
          {record.status === "PENDING" ? (
            <>
              <button
                onClick={() => showModal(record._id, "APPROVED")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => showModal(record._id, "REJECTED")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => showViewModal(record)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              View
            </button>
          )}
        </span>
      ),
    },
  ];

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const showViewModal = (record: any) => {
    setSelectedRequest(record);
    setViewModalVisible(true);
  };

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
      render: (image: string) => <img src={image} alt="Pet" style={{ width: "100px", height: "100px" }} />,
    },
    {
      title: "Number of Requests",
      dataIndex: "requestCount",
      key: "requestCount",
    },
  ];

  return (
    <div className="mt-[148px]">
      {requestsStatus === "loading" && <Spin tip="Loading..." />}
      {requestsStatus === "failed" && <Alert message="Error" description={error} type="error" showIcon />}
      {requestsStatus === "succeeded" && (
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Pet Adoption Summary" key="1">
            <Table dataSource={petAdoptionSummary} columns={petSummaryColumns} rowKey="petId" />
          </TabPane>
          <TabPane tab="Adoption Requests" key="2">
            {!petId && (
              <Dropdown overlay={menu} trigger={['hover']}>
                <Button>
                  {filterButtonText} <span>▼</span>
                </Button>
              </Dropdown>
            )}
            <Table dataSource={filteredRequests} columns={columns} rowKey="_id" />
          </TabPane>
        </Tabs>
      )}
      <Modal
        title="Enter a comment"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={newStatus === "APPROVED" ? "Approve" : "Reject"}
      >
        <Input.TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter comment for this action"
        />
      </Modal>
      <Modal className="text-[18px]"
        title="Request Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedRequest && (
          <div className="text-[16px] space-y-4">
            <p><strong className="font-semibold">Pet Name:</strong> {selectedRequest.petName}</p>
            <p><strong className="font-semibold">Status:</strong> {selectedRequest.status}</p>
            <p><strong className="font-semibold">Request Date:</strong> {new Date(selectedRequest.requestDate).toLocaleDateString()}</p>
            <p><strong className="font-semibold">Comment:</strong> {selectedRequest.comment}</p>
            {selectedRequest.adoptionDate && (
              <p><strong className="font-semibold">Adoption Date:</strong> {new Date(selectedRequest.adoptionDate).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdoptableManagement;
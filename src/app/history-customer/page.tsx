"use client";
import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Image,
  Button,
  Tooltip,
  Tag,
  Modal,
  Select,
  Input,
  message,
  Popconfirm,
} from "antd";
import {
  LogoutOutlined,
  HistoryOutlined,
  HomeOutlined,
  StarOutlined,
  HeartOutlined,
  FormOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { logout } from "@/lib/features/auth/authSlice";
import {
  deleteAdoptionRequest,
  fetchAdoptionRequestsByUserId,
} from "@/lib/features/adopt/adoptSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";
import { jwtDecode } from "jwt-decode";
import {
  createHealthCheck,
  fetchHealthCheckByPetID,
} from "@/lib/features/pet/HealthCheckSlice";
import {
  createFeedback,
  deleteFeedback,
  fetchFeedbackByUserId,
  updateFeedback,
} from "@/lib/features/feedback/feedbackSlice";
import { CheckingTypeCustomer, HealthStatus } from "@/enum";

import axios from "axios";
import { fetchUserList } from "@/lib/features/user/userSlice";
import { SearchOutlined } from "@ant-design/icons";
const { Search } = Input;

interface AdoptionRequest {
  _id: string;
  petId: string;
  status: string;
  comment: string;
  key: string;
  [key: string]: string | number | boolean;
}

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>(
    []
  );
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [selectedKey, setSelectedKey] = useState("2");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [petId, setPetId] = useState("");
  const [healthStatus, setHealthStatus] = useState<HealthStatus | undefined>(
    undefined
  );
  const [healthStatusDescription, setHealthStatusDescription] = useState("");
  const [note, setNote] = useState("");
  const [checkingBy, setCheckingBy] = useState("");
  const [checkingType, setCheckingType] = useState<CheckingTypeCustomer>(
    CheckingTypeCustomer.ADOPTED
  );

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number | undefined>(
    undefined
  );

  const [updateFeedbackOpen, setUpdateFeedbackOpen] = useState(false);
  const [updateFeedbackId, setUpdateFeedbackId] = useState("");
  const [updateFeedbackDescription, setUpdateFeedbackDescription] =
    useState("");
  const [updateFeedbackRating, setUpdateFeedbackRating] = useState<
    number | undefined
  >(undefined);
  const [healthChecks, setHealthChecks] = useState<any[]>([]);

  const [events, setEvents] = useState<any[]>([]);

  const { userList } = useAppSelector((state) => state.user);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const getVolunteerInfo = (supporterId: string) => {
    return userList.find((user) => user._id === supporterId);
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await dispatch(deleteAdoptionRequest(requestId)).unwrap();
      setAdoptionRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      message.success("Successfully cancelled adoption request");
    } catch (error: unknown) {
      console.error("Error deleting request:", error);
      message.error("Unable to cancel request. Please try again");
    }
  };
  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      const feedbackToDelete = feedbacks.find((f) => f._id === feedbackId);
      if (feedbackToDelete) {
        await dispatch(deleteFeedback(feedbackId)).unwrap();
        localStorage.removeItem(`feedbackCreated_${feedbackToDelete.petId}`);
        message.success("Feedback deleted successfully");
        fetchUserFeedbacks();
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      message.error("Failed to delete feedback. Please try again.");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleLogOut = (): void => {
    dispatch(logout());
    router.push("/signin");
  };

  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
    if (e.key === "5") {
      handleLogOut();
    } else if (e.key === "1") {
      handleGoHome();
    } else if (e.key === "4") {
      fetchUserFeedbacks();
    } else if (e.key === "3") {
      fetchHealthChecks();
    } else if (e.key === "6") {
      fetchEvents();
    }
  };

  const getUserIdFromToken = (token: string): string | null => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.id;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setToken(null);
      return null;
    }
  };

  const fetchUserFeedbacks = async () => {
    if (token) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        try {
          const feedbackData = await dispatch(
            fetchFeedbackByUserId(userId)
          ).unwrap();
          const updatedFeedbacks = await Promise.all(
            feedbackData.map(async (feedback: any) => {
              try {
                const petData = await dispatch(
                  fetchPetById(feedback.petId)
                ).unwrap();
                return {
                  ...feedback,
                  petName: petData.name,
                  petImage: petData.image,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch pet information for petId ${feedback.petId}:`,
                  error
                );
                return feedback;
              }
            })
          );
          setFeedbacks(updatedFeedbacks);
        } catch (error) {
          console.error("Failed to fetch feedbacks:", error);
        }
      }
    }
  };
  const fetchHealthChecks = async () => {
    if (adoptionRequests.length > 0) {
      try {
        const allHealthChecks = await Promise.all(
          adoptionRequests.map(async (request) => {
            const healthCheckResponse = await dispatch(
              fetchHealthCheckByPetID(request.petId)
            ).unwrap();
            const petDetails = await dispatch(
              fetchPetById(request.petId)
            ).unwrap();
            return healthCheckResponse.map((healthCheck: any) => ({
              ...healthCheck,
              petName: petDetails.name,
              petImage: petDetails.image,
            }));
          })
        );

        const adoptedHealthChecks = allHealthChecks
          .flat()
          .filter((healthCheck: any) => healthCheck.checkingType === "ADOPTED");

        console.log(adoptedHealthChecks); // Verify the data here
        setHealthChecks(adoptedHealthChecks);
      } catch (error) {
        console.error("Error fetching health checks:", error);
        message.error("Failed to fetch health checks. Please try again.");
      }
    }
  };
  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        const userId = getUserIdFromToken(storedToken);
        if (userId) {
          setCheckingBy(userId);
          dispatch(fetchAdoptionRequestsByUserId(userId))
            .unwrap()
            .then(async (data) => {
              const updatedRequests = await Promise.all(
                data.map(async (request: AdoptionRequest) => {
                  try {
                    const petData = await dispatch(
                      fetchPetById(request.petId)
                    ).unwrap();
                    return {
                      ...request,
                      petImage: petData.image,
                      petName: petData.name,
                      key: request.petId,
                    };
                  } catch (error) {
                    console.error(
                      `Failed to fetch pet information for petId ${request.petId}:`,
                      error
                    );
                    return request;
                  }
                })
              );
              setAdoptionRequests(
                updatedRequests.map((request) => ({
                  ...request,
                  key: request.petId,
                }))
              );
            })
            .catch((error) => {
              console.error("Failed to fetch adoption requests:", error);
            });
        }
      }
    }
  }, [dispatch]);
  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const currentCheckingDate = new Date();
    const healthCheckData = {
      petId,
      healthStatus: healthStatus ? healthStatus.toString() : "",
      healthStatusDescription,
      note,
      checkingDate: currentCheckingDate,
      checkingBy,
      checkingType: checkingType ? checkingType.toString() : "",
    };
    setLoading(true);
    try {
      await dispatch(createHealthCheck(healthCheckData)).unwrap();
      message.success("Health Check created successfully!");
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error from API:", error);
      message.error("Failed to create Health Check. Please try again.");
      setLoading(false);
    }
  };
  const resetModalFeedback = () => {
    setFeedbackDescription("");
    setFeedbackRating(undefined);
  };
  const showFeedbackModal = () => {
    resetModalFeedback();
    setFeedbackOpen(true);
  };

  const handleFeedbackCancel = () => {
    setFeedbackOpen(false);
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackRating === undefined) {
      message.error("Please provide a rating.");
      return;
    }
    const feedbackData = {
      userId: checkingBy,
      petId,
      description: feedbackDescription,
      rating: feedbackRating,
    };
    setLoading(true);
    try {
      await dispatch(createFeedback(feedbackData)).unwrap();
      message.success("Feedback created successfully!");
      localStorage.setItem(`feedbackCreated_${petId}`, "true");
      setLoading(false);
      setFeedbackOpen(false);
    } catch (error) {
      console.error("Error from API:", error);
      message.error("Failed to create feedback. Please try again.");
      setLoading(false);
    }
  };
  const showUpdateFeedbackModal = (feedback: any) => {
    setUpdateFeedbackId(feedback._id);
    setUpdateFeedbackDescription(feedback.description);
    setUpdateFeedbackRating(feedback.rating);
    setUpdateFeedbackOpen(true);
  };

  const handleUpdateFeedbackCancel = () => {
    setUpdateFeedbackOpen(false);
  };

  const handleUpdateFeedbackSubmit = async () => {
    const feedbackData = {
      description: updateFeedbackDescription,
      rating: updateFeedbackRating ?? 0,
    };
    setLoading(true);
    try {
      await dispatch(
        updateFeedback({ feedbackId: updateFeedbackId, feedbackData })
      ).unwrap();
      message.success("Feedback updated successfully!");
      setLoading(false);
      setUpdateFeedbackOpen(false);
      fetchUserFeedbacks(); // Refresh feedbacks
    } catch (error) {
      console.error("Error from API:", error);
      message.error("Failed to update Feedback. Please try again.");
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (token) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8000/event/view-event-joined/${userId}`
          );
          console.log("Fetched joined events:", response.data);

          const formattedEvents = response.data.map((event: any) => ({
            ...event,
            key: event._id,
            startDate: event.start,
            endDate: event.end,
            volunteer: event.supporters?.join(", ") || "No volunteers yet",
          }));

          setEvents(formattedEvents);
        } catch (error: any) {
          console.error("Failed to fetch joined events:", error);
          if (error.response?.status === 404) {
            message.info("You haven't joined any events yet");
            setEvents([]); // Reset events list
          } else {
            message.error("Failed to fetch events. Please try again.");
          }
        }
      }
    }
  };

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "2",
      icon: <HistoryOutlined />,
      label: "Adopt History",
    },
    {
      key: "3",
      icon: <HeartOutlined />,
      label: "Pet Health Check",
    },
    {
      key: "4",
      icon: <FormOutlined />,
      label: "Pet Feedback",
    },
    {
      key: "6",
      icon: <CarryOutOutlined />,
      label: "Event ",
    },
    {
      key: "5",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const columns = [
    {
      title: "Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (text: string) => (
        <Image
          width={180}
          height={200}
          className="rounded-sm shadow-2xl"
          src={text}
          alt="Pet Image"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "petName",
      key: "petName",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: { status: string }) =>
        record.status === "PENDING" ? (
          <Tag color="yellow" className="font-semibold uppercase">
            Waiting for approve
          </Tag>
        ) : record.status === "APPROVED" ? (
          <Tag color="green" className="font-semibold uppercase">
            APPROVED
          </Tag>
        ) : record.status === "REJECTED" ? (
          <Tag color="red" className="font-semibold uppercase">
            REJECTED
          </Tag>
        ) : record.status === "NOT_AVAILABLE" ? (
          <Tag color="gray" className="font-semibold uppercase">
            CANCELLED
          </Tag>
        ) : (
          record.status
        ),
    },
    {
      title: "Warning",
      key: "warning",
      render: (text: string, record: { status: string }) =>
        record.status === "APPROVED" ? (
          <Tooltip title="You must create a health check after 1 month from the date of adopting the pet">
            <Tag color="red" className="font-semibold">
              Health Check Required
            </Tag>
          </Tooltip>
        ) : null,
    },
    {
      title: "Comment from ShelterStaff",
      dataIndex: "comment",
      key: "comment",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: AdoptionRequest) => (
        <div>
          {record.status === "APPROVED" && (
            <div className="flex gap-5">
              <Button
                type="primary"
                onClick={() => {
                  setPetId(record.key);
                  showModal();
                }}
              >
                Create Health Check
              </Button>
              {!localStorage.getItem(`feedbackCreated_${record.key}`) && (
                <Button
                  type="primary"
                  onClick={() => {
                    setPetId(record.key);
                    showFeedbackModal();
                  }}
                >
                  Create Feedback
                </Button>
              )}
            </div>
          )}
          {record.status === "PENDING" && (
            <Popconfirm
              title="Confirm cancellation"
              description="Are you sure you want to cancel this adoption request?"
              onConfirm={() => handleDeleteRequest(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger type="primary">
                DELETE REQUEST
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const feedbackColumns = [
    {
      title: "Pet Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (text: string) => (
        <Image
          width={100}
          height={100}
          className="rounded-sm shadow-2xl"
          src={text}
          alt="Pet Image"
        />
      ),
    },
    {
      title: "Pet Name",
      dataIndex: "petName",
      key: "petName",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <span className="font-semibold text-sm">
          {Array.from({ length: rating }, (_, index) => (
            <StarOutlined key={index} style={{ color: "#FFCC00" }} />
          ))}
        </span>
      ),
    },
    {
      title: "Feedback Date",
      dataIndex: "feedbackAt",
      key: "feedbackAt",
      render: (text: string) => (
        <span className="font-semibold text-sm">
          {new Date(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: { _id: string }) => (
        <div className="flex gap-2">
          <Button
            style={{ backgroundColor: "green", color: "white" }}
            onClick={() => showUpdateFeedbackModal(record)}
          >
            Update Feedback
          </Button>
          <Popconfirm
            title="Delete Feedback"
            description="Are you sure you want to delete this feedback?"
            onConfirm={() => handleDeleteFeedback(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="primary">
              Delete Feedback
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const healthCheckColumns = [
    {
      title: "Pet Name",
      dataIndex: "petName",
      key: "petName",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Pet Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (url: string) => (
        <img src={url} alt="Pet Avatar" className="w-10 h-10 object-cover" />
      ),
    },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "healthStatusDescription",
      key: "healthStatusDescription",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Checking Date",
      dataIndex: "checkingDate",
      key: "checkingDate",
      render: (text: string) => (
        <span className="font-semibold text-sm">
          {new Date(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Checking Type",
      dataIndex: "checkingType",
      key: "checkingType",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
  ];

  const eventColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <Image
          width={180}
          height={200}
          className="rounded-sm shadow-2xl"
          src={text}
          alt="Event Image"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Volunteer",
      dataIndex: "supporters",
      key: "supporters",
      render: (supporters: string[]) => (
        <div className="flex -space-x-4">
          {supporters && Array.isArray(supporters) && supporters.length > 0 ? (
            supporters.map((supporterId: string) => {
              const volunteerInfo = getVolunteerInfo(supporterId);
              if (!volunteerInfo) return null;

              return (
                <div key={supporterId} className="relative">
                  <Tooltip title={volunteerInfo.name}>
                    <img
                      src={
                        volunteerInfo.avatar ||
                        "https://via.placeholder.com/150"
                      }
                      alt={volunteerInfo.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </Tooltip>
                </div>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm">No supporters</span>
          )}
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => (
        <span className="font-semibold text-sm">
          {new Date(text).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => (
        <span className="font-semibold text-sm">
          {new Date(text).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          {selectedKey === "2" && (
            <div>
              <Table columns={columns} dataSource={adoptionRequests} />
            </div>
          )}
          {selectedKey === "4" && (
            <div>
              <Table columns={feedbackColumns} dataSource={feedbacks} />
            </div>
          )}
          {selectedKey === "3" && (
            <div>
              <Table columns={healthCheckColumns} dataSource={healthChecks} />
            </div>
          )}
          {selectedKey === "6" && (
            <>
              <div className="w-full mb-6">
                <Search
                  placeholder="Search events by title..."
                  allowClear
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />}>
                      Search
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  style={{
                    width: "100%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <Table
                columns={eventColumns}
                dataSource={filteredEvents}
                pagination={{ pageSize: 5 }}
              />
            </>
          )}
        </Content>
      </Layout>
      <Modal
        open={open}
        title="Create Health Check"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold">Health Status:</label>
            <Select
              value={healthStatus}
              onChange={(value) => setHealthStatus(value as HealthStatus)}
              placeholder="Select Health Status"
            >
              {Object.values(HealthStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Health Status Description:</label>
            <Input.TextArea
              value={healthStatusDescription}
              onChange={(e) => setHealthStatusDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Note:</label>
            <Input.TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={feedbackOpen}
        title="Create Feedback"
        onCancel={handleFeedbackCancel}
        footer={[
          <Button key="back" onClick={handleFeedbackCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleFeedbackSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold">Description:</label>
            <Input.TextArea
              value={feedbackDescription}
              onChange={(e) => setFeedbackDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">
              Rating <StarOutlined style={{ color: "#FFCC00" }} /> :
            </label>
            <Select
              value={feedbackRating}
              onChange={(value) => setFeedbackRating(value as number)}
              placeholder="Select Rating"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <Select.Option key={rating} value={rating}>
                  {rating}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
      <Modal
        open={updateFeedbackOpen}
        title="Update Feedback"
        onCancel={handleUpdateFeedbackCancel}
        footer={[
          <Button key="back" onClick={handleUpdateFeedbackCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleUpdateFeedbackSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold">Description:</label>
            <Input.TextArea
              value={updateFeedbackDescription}
              onChange={(e) => setUpdateFeedbackDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">
              Rating <StarOutlined style={{ color: "#FFCC00" }} /> :
            </label>
            <Select
              value={updateFeedbackRating}
              onChange={(value) => setUpdateFeedbackRating(value as number)}
              placeholder="Select Rating"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <Select.Option key={rating} value={rating}>
                  {rating}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Dashboard;

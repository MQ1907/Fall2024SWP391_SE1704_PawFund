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
  Popconfirm,
} from "antd";
import {
  LogoutOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hook";
import { logout } from "@/lib/features/auth/authSlice";
import {
  fetchAdoptionRequestsByUserId,
  deleteAdoptionRequest,
} from "@/lib/features/adopt/adoptSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";
import { jwtDecode } from "jwt-decode";
import { Modal, Select, Input, message } from "antd";
import { createHealthCheck } from "@/lib/features/pet/HealthCheckSlice";
import { HealthStatus, CheckingTypeCustomer } from "../../enum";
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

  const handleGoHome = () => {
    router.push("/");
  };
  const handleLogOut = (): void => {
    dispatch(logout());
    // Optionally, redirect to the login page after logout
    router.push("/signin");
  };
  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
    if (e.key === "3") {
      handleLogOut();
    } else if (e.key === "1") {
      handleGoHome();
    }
  };
  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token"); // Check client-side before accessing localStorage
      setToken(storedToken);

      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const userId = decodedToken.id;

          console.log("userId", userId);
          setCheckingBy(userId);
          // Fetch adoption requests by userId
          dispatch(fetchAdoptionRequestsByUserId(userId))
            .unwrap()
            .then(async (data) => {
              console.log("Fetched adoption requests:", data); // Debugging log

              // Fetch pet information for each adoption request
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
                      key: request.petId, // Add a unique key property
                    };
                  } catch (error) {
                    console.error(
                      `Failed to fetch pet information for petId ${request.petId}:`,
                      error
                    );
                    return request; // Return the request without pet information if fetching fails
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
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
  }, [dispatch]);

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "2",
      icon: <HistoryOutlined />,
      label: "History",
    },
    {
      key: "3",
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
            <Button
              type="primary"
              onClick={() => {
                setPetId(record.petId);
                showModal();
              }}
            >
              Create Health Check
            </Button>
          )}
          {record.status === "PENDING" && (
            <Popconfirm
              title="Confirm Cancellation"
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
    console.log("Health Check Data:", healthCheckData);
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
    </Layout>
  );
};

export default Dashboard;

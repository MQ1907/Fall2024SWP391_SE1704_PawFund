"use client";
import React, { useEffect, useState } from "react";
import { Layout, Menu, Table, Image, Tag, Button, Modal, message } from "antd";
import {
  LogoutOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hook";
import { logout } from "@/lib/features/auth/authSlice";
import {
  fetchCreateByVolunteerId,
  deletePet,
} from "../../lib/features/pet/petSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";
import { jwtDecode } from "jwt-decode";
interface AdoptionRequest {
  petId: string;
  deliveryStatus: string;
  comment: string;
  isAdopted: boolean;
  note: string;
  rescueDate: string;
  key: string; // Add the key property
  [key: string]: string | number | boolean;
}

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const { Header, Sider, Content } = Layout;

const HistoryVolunteer = () => {
  const [token, setToken] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [historyVolunteer, setHistoryVolunteer] = useState<AdoptionRequest[]>(
    []
  );
  const dispatch = useAppDispatch();
  const [selectedKey, setSelectedKey] = useState("2");
  const router = useRouter();

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

  const handleDelete = async (petId: string) => {
    try {
      await dispatch(deletePet(petId));

      setHistoryVolunteer((prevHistory) =>
        prevHistory.filter((pet) => pet._id !== petId)
      );
      message.success("Pet deleted successfully!");
    } catch (error) {
      message.error("Failed to delete pet");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (petId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this pet?",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(petId);
      },
    });
  };

  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const userId = decodedToken.id;

          console.log("userId", userId);

          // Fetch adoption requests by userId
          dispatch(fetchCreateByVolunteerId(userId))
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
              setHistoryVolunteer(
                updatedRequests.map((request) => ({
                  ...request,
                  key: request.petId,
                }))
              );
            })
            .catch((error) => {
              console.error("Failed to fetch history volunteer:", error);
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
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (text: string) => (
        <Image
          width={200}
          height={200}
          className="rounded-sm shadow-2xl"
          src={text}
          alt="Image"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      width: 100,
      render: (text: string, record: { deliveryStatus: string }) =>
        record.deliveryStatus === "PENDING" ? (
          <Tag color="yellow" className="font-semibold uppercase">
            Waiting for approve
          </Tag>
        ) : record.deliveryStatus === "INPROCESS" ? (
          <Tag color="purple" className="font-semibold uppercase">
            You should do HealCheck to send this pet to shelter
          </Tag>
        ) : record.deliveryStatus === "COMPLETED" ? (
          <Tag color="green" className="font-semibold uppercase">
            COMPLETED
          </Tag>
        ) : record.deliveryStatus === "CANCELED" ? (
          <Tag color="red" className="font-semibold uppercase">
            Reject
          </Tag>
        ) : (
          record.deliveryStatus
        ),
    },
    {
      title: "Adopted",
      dataIndex: "isAdopted",
      key: "isAdopted",
      width: 100,
      render: (isAdopted: boolean, record: { deliveryStatus: string }) =>
        ["CANCELED", "PENDING", "INPROCESS"].includes(
          record.deliveryStatus
        ) ? null : isAdopted ? ( // Hide tag if status is CANCELED, PENDING, or INPROCESS
          <Tag color="yellow" className="font-semibold uppercase">
            Adopted
          </Tag>
        ) : (
          <Tag color="red" className="font-semibold uppercase">
            Not Adopted
          </Tag>
        ),
    },
    {
      title: "Comment",
      dataIndex: "note",
      key: "note",
      width: 100,
      render: (text: string) => (
        <span className="font-semibold text-sm">{text}</span>
      ),
    },
    {
      title: "Day create",
      dataIndex: "rescueDate",
      key: "rescueDate",
      width: 100,
      render: (text: string) => (
        <span className="font-semibold text-sm">
          {new Date(text).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
       width: 100,
      render: (text: string, record: { _id: string }) => (
        <div>
          <Button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => confirmDelete(record._id)}
          >
            Delete
          </Button>
        </div>
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
              <Table columns={columns} dataSource={historyVolunteer} />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HistoryVolunteer;

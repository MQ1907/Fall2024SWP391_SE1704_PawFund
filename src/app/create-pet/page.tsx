"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Alert,
  Button,
  message,
  Modal,
  Input,
  Select,
} from "antd";
import {
  fetchPets,
  selectPendingPets,
  selectCompletedPets,
  updatePetDelivery,
  deletePet,
} from "../../lib/features/pet/petSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createHealthCheck } from "@/lib/features/pet/HealthCheckSlice";
import { CheckingTypeShelterStaff, HealthStatus } from "../../enum";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const CreatePet = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pendingPets = useAppSelector(selectPendingPets);
  const completedPets = useAppSelector(selectCompletedPets);
  const petsStatus = useAppSelector((state) => state.pets.status);
  const error = useAppSelector((state) => state.pets.error);
  const [view, setView] = useState("PENDING");
  const [role, setRole] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [petId, setPetId] = useState("");
  const [displayPetId, setDisplayPetId] = useState("********");
  const [healthStatus, setHealthStatus] = useState<HealthStatus | undefined>(
    undefined
  );
  const [healthStatusDescription, setHealthStatusDescription] = useState("");
  const [note, setNote] = useState("");
  const [checkingDate, setCheckingDate] = useState("");
  const [checkingBy, setCheckingBy] = useState("");
  const [checkingType, setCheckingType] = useState<
    CheckingTypeShelterStaff | undefined
  >(undefined);
  const [hiddenCheckingBy, setHiddenCheckingBy] = useState("");
  const [loading, setLoading] = useState(false);
  const showModal = (pet) => {
    setPetId(pet._id);
    setDisplayPetId("********");
    setHealthStatus(undefined);
    setHealthStatusDescription("");
    setNote("");
    setWeight(undefined);
    setTemperature(undefined);
    setCheckingDate("");
    setCheckingType(undefined);
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const healthCheckData = {
      petId,
      healthStatus: healthStatus ? healthStatus.toString() : "",
      healthStatusDescription,
      note,
      weight,
      temperature,
      checkingDate: new Date(checkingDate),
      checkingBy,
      checkingType: checkingType ? checkingType.toString() : "",
    };
    console.log("Health Check Data:", healthCheckData);
    setLoading(true);
    try {
      await dispatch(createHealthCheck(healthCheckData)).unwrap();
      setTimeout(() => {
        setLoading(false);
        handleOk(); // Đóng modal sau khi tạo thành công
      }, 3000);
    } catch (error) {
      console.error("Error from API:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;
        setCheckingBy(userId); // Đặt ID người dùng vào state checkingBy
        setHiddenCheckingBy("*".repeat(userId.length)); // Đặt giá trị ẩn của checkingBy

        const fetchUser = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8000/users/${userId}`
            );
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
    if (petsStatus === "idle") {
      dispatch(fetchPets());
    }
  }, [petsStatus, dispatch]);

  const handleUpdateStatus = async (petId: string) => {
    try {
      await dispatch(
        updatePetDelivery({ petId, deliveryStatus: "COMPLETED" })
      ).unwrap();
      message.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status. Please try again.");
    }
  };

  const handleDelete = (petId: string) => {
    dispatch(deletePet(petId));
  };

  const confirmDelete = (petId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this pet?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(petId);
      },
    });
  };

  const commonColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (
        text: string,
        record: { _id: string; image: string; name: string }
      ) => <img src={record.image} alt={record.name} style={{ width: 100 }} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Rescue Day",
      dataIndex: "rescueDate",
      key: "rescueDate",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Breed",
      dataIndex: "breed",
      key: "breed",
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
    },
    {
      title: "Button",
      key: "button",
      render: (text: string, record: { _id: string }) => (
        <>
          <Button
            style={{ backgroundColor: "red", color: "white", marginRight: 8 }}
            onClick={() => confirmDelete(record._id)}
          >
            Delete
          </Button>
          <Button
            style={{ backgroundColor: "blue", color: "white" }}
            onClick={() => showModal(record)}
          >
            Create Health Check
          </Button>
        </>
      ),
    },
  ];

  const pendingColumns = [
    ...commonColumns,
    {
      title: "Action",
      key: "action",
      render: (text: string, record: { _id: string }) => (
        <Button
          style={{ backgroundColor: "green", color: "white" }}
          onClick={() => handleUpdateStatus(record._id)}
        >
          Update to COMPLETED status
        </Button>
      ),
    },
  ];

  const columns = view === "PENDING" ? pendingColumns : commonColumns;
  const dataSource = view === "PENDING" ? pendingPets : completedPets;

  return (
    <div className="mt-[50px]">
      <div style={{ marginBottom: 16 }}></div>
      {petsStatus === "loading" && <Spin tip="Loading..." />}
      {petsStatus === "failed" && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}
      {petsStatus === "succeeded" && dataSource.length > 0 ? (
        <Table dataSource={dataSource} columns={columns} rowKey="id" />
      ) : (
        petsStatus === "succeeded" && <p>No pets found.</p>
      )}
      <Modal
        open={open}
        title="Create Health Check"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold">Pet ID:</label>
            <Input
              value={displayPetId}
              onChange={(e) => setPetId(e.target.value)}
              disabled
            />
          </div>
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
          <div className="flex flex-col">
            <label className="font-semibold">Weight(Kg):</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Temperature(°C):</label>
            <Input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Checking Date:</label>
            <Input
              type="datetime-local"
              value={checkingDate}
              onChange={(e) => setCheckingDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Checked By:</label>
            <Input
              value={hiddenCheckingBy}
              onChange={(e) => setCheckingBy(e.target.value)}
              disabled
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Checking Type:</label>
            <Select
              value={checkingType}
              onChange={(value) =>
                setCheckingType(value as CheckingTypeShelterStaff)
              }
              placeholder="Select Checking Type"
            >
              {Object.values(CheckingTypeShelterStaff).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePet;

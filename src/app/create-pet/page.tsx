"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  const [checkingType, setCheckingType] = useState<CheckingTypeShelterStaff>(
    CheckingTypeShelterStaff.ROUTINE
  );
  const [hiddenCheckingBy, setHiddenCheckingBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [healthCheckCreated, setHealthCheckCreated] = useState<{
    [key: string]: { created: boolean; type?: string };
  }>({});
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedHealthCheckCreated =
        localStorage.getItem("healthCheckCreated");
      if (storedHealthCheckCreated) {
        setHealthCheckCreated(JSON.parse(storedHealthCheckCreated));
      }
    }
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(
        "healthCheckCreated",
        JSON.stringify(healthCheckCreated)
      );
    }
  }, [healthCheckCreated, hasHydrated]);

  const showModal = useCallback((pet) => {
    setPetId(pet._id);
    setDisplayPetId("********");
    setHealthStatus(undefined);
    setHealthStatusDescription("");
    setNote("");
    setWeight(undefined);
    setTemperature(undefined);
    setCheckingDate("");
    setCheckingType(CheckingTypeShelterStaff.ROUTINE);
    setOpen(true);
  }, []);

  const handleOk = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const [weightError, setWeightError] = useState<string | null>(null);
  const [temperatureError, setTemperatureError] = useState<string | null>(null);

  const validateWeight = useCallback(
    (weight: number | undefined): string | null => {
      if (weight === undefined) {
        return "Weight is required.";
      }
      if (weight <= 0) {
        return "Weight must be a positive number greater than zero.";
      }
      if (weight >= 90) {
        return "Weight must be less than 90kg.";
      }
      return null;
    },
    []
  );

  const handleWeightChange = useCallback(
    (value: number | undefined) => {
      setWeight(value);
      const error = validateWeight(value);
      setWeightError(error);
    },
    [validateWeight]
  );

  const validateTemperature = useCallback(
    (temperature: number | undefined): string | null => {
      if (temperature === undefined) {
        return "Temperature is required.";
      }
      if (temperature <= 0) {
        return "Temperature must be a positive number greater than zero.";
      }
      if (temperature >= 50) {
        return "Temperature must be less than 50°C.";
      }
      return null;
    },
    []
  );

  const handleTemperatureChange = useCallback(
    (value: number | undefined) => {
      setTemperature(value);
      const error = validateTemperature(value);
      setTemperatureError(error);
    },
    [validateTemperature]
  );

  const handleSubmit = useCallback(async () => {
    const weightError = validateWeight(weight);
    const temperatureError = validateTemperature(temperature);

    if (weightError || temperatureError) {
      alert(weightError || temperatureError);
      return;
    }
    const currentCheckingDate = new Date();
    const healthCheckData = {
      petId,
      healthStatus: healthStatus ? healthStatus.toString() : "",
      healthStatusDescription,
      note,
      weight,
      temperature,
      checkingDate: currentCheckingDate,
      checkingBy,
      checkingType: checkingType ? checkingType.toString() : "",
    };
    console.log("Health Check Data:", healthCheckData);
    setLoading(true);
    try {
      await dispatch(createHealthCheck(healthCheckData)).unwrap();
      setHealthCheckCreated((prev) => ({
        ...prev,
        [petId]: { created: true, type: checkingType },
      }));
      setTimeout(() => {
        setLoading(false);
        handleOk(); // Close modal after successful creation
      }, 2000);
    } catch (error) {
      console.error("Error from API:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
    }
  }, [
    validateWeight,
    validateTemperature,
    weight,
    temperature,
    petId,
    healthStatus,
    healthStatusDescription,
    note,
    checkingBy,
    checkingType,
    dispatch,
    handleOk,
  ]);

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

  const handleUpdateStatusCancel = useCallback(
    async (petId: string) => {
      try {
        await dispatch(
          updatePetDelivery({ petId, deliveryStatus: "CANCELED" })
        ).unwrap();
        message.success("Status cancel successfully!");
      } catch (error) {
        console.error("Error updating status:", error);
        message.error("Failed to update status. Please try again.");
      }
    },
    [dispatch]
  );

  const handleUpdateStatus = useCallback(
    async (petId: string) => {
      if (
        !healthCheckCreated[petId] ||
        healthCheckCreated[petId].type !== "ROUTINE"
      ) {
        message.warning("You must create a health check before approve.");
        return;
      }

      try {
        await dispatch(
          updatePetDelivery({ petId, deliveryStatus: "COMPLETED" })
        ).unwrap();
        message.success("Status updated successfully!");
      } catch (error) {
        console.error("Error updating status:", error);
        message.error("Failed to update status. Please try again.");
      }
    },
    [dispatch, healthCheckCreated]
  );

  const confirmCancel = useCallback(
    (petId: string) => {
      Modal.confirm({
        title: "Are you sure you want to cancel this pet?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          handleUpdateStatusCancel(petId);
        },
      });
    },
    [handleUpdateStatusCancel]
  );

  const commonColumns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        render: (
          text: string,
          record: { _id: string; image: string; name: string }
        ) => (
          <img src={record.image} alt={record.name} style={{ width: 100 }} />
        ),
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
              onClick={() => confirmCancel(record._id)}
            >
              Cancel
            </Button>

            {(!healthCheckCreated[record._id] ||
              healthCheckCreated[record._id]?.type !== "ROUTINE") && (
              <Button
                style={{ backgroundColor: "blue", color: "white" }}
                onClick={() => showModal(record)}
              >
                Create Health Check
              </Button>
            )}
          </>
        ),
      },
    ],
    [confirmCancel, healthCheckCreated, showModal]
  );

  const pendingColumns = useMemo(
    () => [
      ...commonColumns,
      {
        title: "Action",
        key: "action",
        render: (text: string, record: { _id: string }) => (
          <Button
            style={{ backgroundColor: "green", color: "white" }}
            onClick={() => handleUpdateStatus(record._id)}
          >
            APPROVED
          </Button>
        ),
      },
    ],
    [commonColumns, handleUpdateStatus]
  );

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
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
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
          <div className="flex flex-col">
            <label className="font-semibold">Weight(Kg):</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
            />
            {weightError && <span style={{ color: "red" }}>{weightError}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Temperature(°C):</label>
            <Input
              type="number"
              value={temperature}
              onChange={(e) => handleTemperatureChange(Number(e.target.value))}
            />
            {temperatureError && (
              <span style={{ color: "red" }}>{temperatureError}</span>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePet;

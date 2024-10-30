"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Alert,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Switch,
} from "antd"; // Import Switch from antd
import {
  fetchPets,
  selectCompletedPets,
  deletePet,
  updatePet,
  changeVaccinated, // Import your changeVaccinated action
} from "../../lib/features/pet/petSlice";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const PetManagement = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const completedPets = useAppSelector(selectCompletedPets);
  const petsStatus = useAppSelector((state) => state.pets.status);
  const error = useAppSelector((state) => state.pets.error);
  const [view, setView] = useState("COMPLETED");
  const [role, setRole] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;

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

  const handleDelete = (petId: string) => {
    dispatch(deletePet(petId));
  };

  const confirmDelete = (petId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this pet?",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(petId);
        message.success("Pet deleted successfully!");
      },
    });
  };
  const showUpdateModal = (pet) => {
    setCurrentPet(pet);
    form.setFieldsValue(pet);
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      const updatedPet = {
        ...currentPet,
        ...values,
      };
      dispatch(updatePet({ petId: currentPet._id, petData: updatedPet }))
        .unwrap()
        .then(() => {
          setIsModalVisible(false);
          message.success("Cập nhật pet thành công!");
        })
        .catch((error) => {
          message.error("Failed to update pet: " + error);
        });
    });
  };

  const columns = [
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
      render: (rescueDate: string) => {
        const date = new Date(rescueDate);
        const formattedDate = date.toLocaleDateString();
        return <span>{formattedDate}</span>;
      },
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
      title: "Vaccinated",
      dataIndex: "isVacinted",
      key: "isVacinted",
      render: (isVaccinated: boolean) => (
        <span>{isVaccinated ? "Yes" : "No"}</span>
      ),
    },

    {
      title: "Action",
      key: "action",
      width: 500,
      render: (text: string, record: { _id: string }) => (
        <div>
          <Button
            style={{
              backgroundColor: "yellow",
              color: "black",
              marginRight: "10px",
            }}
            onClick={() => showUpdateModal(record)}
          >
            Update
          </Button>
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
    <div className="mt-[148px]">
      <div style={{ marginBottom: 16 }}></div>

      {petsStatus === "loading" && <Spin tip="Loading..." />}
      {petsStatus === "failed" && (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      )}
      {petsStatus === "succeeded" && completedPets.length > 0 ? (
        <Table dataSource={completedPets} columns={columns} rowKey="_id" />
      ) : (
        petsStatus === "succeeded" && <p>Not find any pets</p>
      )}

      {/* Modal để cập nhật pet */}
      <Modal
        title="Cập nhật Pet"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the name!" },
              {
                validator: (_, value) => {
                  if (!value || /^[a-zA-Z\s]*$/.test(value)) {
                    return Promise.resolve(); // Valid input
                  }
                  return Promise.reject(
                    new Error("Name cannot contain numbers!")
                  );
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item
            name="breed"
            label="Breed"
            rules={[{ required: true, message: "Please enter the breed!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Male">Male</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isVacinted"
            label="Vaccinated"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PetManagement;

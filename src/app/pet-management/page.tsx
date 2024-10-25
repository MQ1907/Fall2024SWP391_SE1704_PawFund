"use client";
import React, { useEffect, useState } from "react";

import { Table, Spin, Alert, Button, message, Modal, Form, Input } from "antd";
import { fetchPets, selectCompletedPets, deletePet, updatePet } from "../../lib/features/pet/petSlice";

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
      title: "Bạn có chắc chắn muốn xóa con pet này không?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(petId);
        message.success("Đã xóa con pet thành công!");
      },
    });
  };

  const showUpdateModal = (pet) => {
    setCurrentPet(pet);
    form.setFieldsValue(pet); // Đặt giá trị hiện tại cho form
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
      render: (text: string, record: { _id: string; image: string; name: string }) => (
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
      title: "Action",
      key: "action",
      render: (text: string, record: { _id: string }) => (
        <div>
          <Button
            style={{ backgroundColor: "yellow", color: "black", marginRight: "10px" }}
            onClick={() => showUpdateModal(record)} // Hiển thị modal cho cập nhật
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
        petsStatus === "succeeded" && <p>Không tìm thấy pet nào.</p>
      )}

      {/* Modal để cập nhật pet */}
      <Modal
        title="Cập nhật Pet"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="image" label="Hình ảnh" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item name="breed" label="Giống" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* Thêm các trường khác nếu cần */}
        </Form>
      </Modal>
    </div>
  );
};

export default PetManagement;

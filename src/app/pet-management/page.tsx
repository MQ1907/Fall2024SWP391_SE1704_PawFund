"use client";
import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, message, Modal } from "antd";
import {
  fetchPets,
  selectCompletedPets,
  deletePet,
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
  const [view, setView] = useState("COMPLETED"); // Đặt mặc định là "COMPLETED"
  const [role, setRole] = useState<string | null>(null);

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
        handleDelete(petId); // Gọi hàm xóa pet
        message.success("Đã xóa con pet thành công!");
      },
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
      title: "Age",
      dataIndex: "age",
      key: "age",
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
        <Button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => confirmDelete(record._id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-[50px]">
      <div style={{ marginBottom: 16 }}></div>

      {petsStatus === "loading" && <Spin tip="Loading..." />}
      {petsStatus === "failed" && (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      )}
      {petsStatus === "succeeded" && completedPets.length > 0 ? (
        <Table dataSource={completedPets} columns={columns} rowKey="id" />
      ) : (
        petsStatus === "succeeded" && <p>Not find any pet</p>
      )}
    </div>
  );
};

export default PetManagement;

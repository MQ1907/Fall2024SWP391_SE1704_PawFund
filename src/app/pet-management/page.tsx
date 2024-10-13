"use client";
import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, message } from "antd";
import { fetchPets, selectCompletedPets, deletePet } from "../../lib/features/pet/petSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { Modal } from "antd";

function PetManagement() {
  const dispatch = useAppDispatch();
  const completedPets = useAppSelector(selectCompletedPets);
  const petsStatus = useAppSelector((state) => state.pets.status);
  const error = useAppSelector((state) => state.pets.error);
  const [view, setView] = useState("COMPLETED"); // Đặt mặc định là "COMPLETED"

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
      title: "Pet Code",
      dataIndex: "petCode",
      key: "petCode",
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
      title: "Shelter Id",
      dataIndex: "shelterId",
      key: "shelterId",
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
    <div className="mt-[148px]">
      <div style={{ marginBottom: 16 }}>
      </div>

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
}

export default PetManagement;

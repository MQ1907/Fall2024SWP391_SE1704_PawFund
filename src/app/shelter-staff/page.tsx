"use client";
import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, message } from "antd";
import {
  fetchPets,
  selectPendingPets,
  selectCompletedPets,
  updatePetDelivery,
} from "../../lib/features/pet/petSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { Modal } from "antd";
import { deletePet } from '../../lib/features/pet/petSlice'; 

function ShelterStaff() {
  const dispatch = useAppDispatch();
  const pendingPets = useAppSelector(selectPendingPets);
  const completedPets = useAppSelector(selectCompletedPets);
  const petsStatus = useAppSelector((state) => state.pets.status);
  const error = useAppSelector((state) => state.pets.error);
  const [view, setView] = useState("PENDING");

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
        handleDelete(petId); // Gọi hàm xóa pet
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
      title: "Shelter",
      dataIndex: "shelterId",
      key: "shelterId",
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
          {/* <Button
        style={{ backgroundColor: "blue", color: "white" }}
        onClick={() => handleUpdatePet(record._id)}
      >
        Update
      </Button> */}
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
    <div className="mt-[148px]">
      <div style={{ marginBottom: 16 }}>
      </div>
      {petsStatus === "loading" && <Spin tip="Loading..." />}
      {petsStatus === "failed" && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}
      {petsStatus === "succeeded" && dataSource.length > 0 ? (
        <Table dataSource={dataSource} columns={columns} rowKey="id" />
      ) : (
        petsStatus === "succeeded" && <p>No pets found.</p>
      )}
    </div>
  );
}

export default ShelterStaff;

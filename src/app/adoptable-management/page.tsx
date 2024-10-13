"use client";
import React, { useEffect } from "react";
import { Table, Spin, Alert, message, Button } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  fetchAdoptionRequests,
  fetchAdoptionRequestsByPetId,
  updateAdoptionRequestStatus,
  deleteAdoptionRequest,
} from "../../lib/features/adopt/adoptSlice";

const AdoptableManagement: React.FC<{ petId?: string }> = ({ petId }) => {
  const dispatch = useAppDispatch();
  const adoptionRequests = useAppSelector((state) => state.adoption.adoptionRequests);
  const requestsStatus = useAppSelector((state) => state.adoption.status);
  const error = useAppSelector((state) => state.adoption.error);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (petId) {
          await dispatch(fetchAdoptionRequestsByPetId(petId)).unwrap();
        } else {
          await dispatch(fetchAdoptionRequests()).unwrap();
        }
      } catch (error) {
        message.error("Failed to fetch adoption requests.");
      }
    };

    fetchRequests();
  }, [petId, dispatch]);

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      if (status === "CANCELLED") {
        await dispatch(deleteAdoptionRequest(requestId)).unwrap();
        message.success("Adoption request cancelled.");
      } else if (status === "COMPLETED") {
        await dispatch(updateAdoptionRequestStatus({ requestId, status })).unwrap();
        message.success(`Status updated to ${status}`);
      }
    } catch (error) {
      message.error("Failed to update status.");
    }
  };

  const columns = [
    {
      title: "Pet ID",
      dataIndex: "petId",
      key: "petId",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Review By",
      dataIndex: "reviewBy",
      key: "reviewBy",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Adoption Date",
      dataIndex: "adoptionDate",
      key: "adoptionDate",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: { _id: string; status: string }) => (
        <span>
          {record.status !== "COMPLETED" && (
            <Button
              onClick={() => handleStatusChange(record._id, "COMPLETED")}
              type="primary"
              className="bg-green-500 hover:bg-green-600 text-white"
              style={{ marginRight: 8 }}
            >
              Complete
            </Button>
          )}
          <Button
            onClick={() => handleStatusChange(record._id, "CANCELLED")}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Cancel
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="mt-[148px]">
      {requestsStatus === "loading" && <Spin tip="Loading..." />}
      {requestsStatus === "failed" && <Alert message="Error" description={error} type="error" showIcon />}
      {requestsStatus === "succeeded" && (
        <Table dataSource={adoptionRequests} columns={columns} rowKey="_id" />
      )}
    </div>
  );
};

export default AdoptableManagement;

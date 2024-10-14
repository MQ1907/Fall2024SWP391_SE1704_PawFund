"use client";
import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, message, Button, Modal, Input, Dropdown, Menu } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  fetchAdoptionRequests,
  // fetchAdoptionRequestsByPetId,
  updateAdoptionRequestStatus,
} from "../../lib/features/adopt/adoptSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";

const AdoptableManagement: React.FC<{ petId?: string }> = ({ petId }) => {
  const dispatch = useAppDispatch();
  const requestsStatus = useAppSelector((state) => state.adoption.status);
  const error = useAppSelector((state) => state.adoption.error);

  const [adoptionRequestsWithPetInfo, setAdoptionRequestsWithPetInfo] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await dispatch(fetchAdoptionRequests()).unwrap();

        const requestsWithPetInfo = await Promise.all(
          requests.map(async (request: any) => {
            const pet = await dispatch(fetchPetById(request.petId)).unwrap();
            return {
              ...request,
              petName: pet.name,
              petImage: pet.image,
            };
          })
        );

        setAdoptionRequestsWithPetInfo(requestsWithPetInfo);
      } catch (error) {
        message.error("Failed to fetch adoption requests or pet information.");
      }
    };

    fetchRequests();
  }, [dispatch]);

  const showModal = (requestId: string, status: string) => {
    setCurrentRequestId(requestId);
    setNewStatus(status);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (newStatus === "REJECTED") {
        await dispatch(
          updateAdoptionRequestStatus({
            requestId: currentRequestId!,
            status: "REJECTED",
            comment,
          })
        ).unwrap();
        setAdoptionRequestsWithPetInfo((prevRequests) =>
          prevRequests.map((request) =>
            request._id === currentRequestId ? { ...request, status: "REJECTED", comment } : request
          )
        );
        message.success("Adoption request rejected.");
      } else if (newStatus === "APPROVED") {
        await dispatch(
          updateAdoptionRequestStatus({
            requestId: currentRequestId!,
            status: "APPROVED",
            comment,
          })
        ).unwrap();
        setAdoptionRequestsWithPetInfo((prevRequests) =>
          prevRequests.filter((request) => request._id !== currentRequestId) // Xóa yêu cầu khỏi danh sách "ALL"
        );
        message.success("Adoption request approved.");
      }
    } catch (error) {
      message.error("Failed to update status.");
    }

    setIsModalVisible(false);
    setComment("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setComment("");
  };

  const handleMenuClick = (e: any) => {
    setFilter(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="ALL">SEE ALL ADOPTION REQUEST</Menu.Item>
      <Menu.Item key="APPROVED">ADOPTION APPROVED</Menu.Item>
      <Menu.Item key="REJECTED">ADOPTION REJECTED</Menu.Item>
    </Menu>
  );

  const filteredRequests = adoptionRequestsWithPetInfo.filter((request) => {
    if (filter === "APPROVED") return request.status === "APPROVED";
    if (filter === "REJECTED") return request.status === "REJECTED";
    return true; // ALL
  });

  const columns = [
    {
      title: "Pet Name",
      dataIndex: "petName",
      key: "petName",
    },
    {
      title: "Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (image: string) => <img src={image} alt="Pet" style={{ width: "100px", height: "100px" }} />,
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
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
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: { _id: string; status: string }) => (
        <span>
          {record.status !== "APPROVED" && record.status !== "CANCELLED" && (
            <Button
              onClick={() => showModal(record._id, "APPROVED")}
              type="primary"
              className="bg-green-500 hover:bg-green-600 text-white"
              style={{ marginRight: 8 }}
            >
              Approve
            </Button>
          )}
          {record.status !== "REJECTED" && record.status !== "CANCELLED" && (
            <Button
              onClick={() => showModal(record._id, "REJECTED")}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reject
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-[148px]">
      {requestsStatus === "loading" && <Spin tip="Loading..." />}
      {requestsStatus === "failed" && <Alert message="Error" description={error} type="error" showIcon />}
      {requestsStatus === "succeeded" && (
        <>
          <Dropdown overlay={menu} trigger={['hover']}>
            <Button>
              Manage Requests <span>▼</span>
            </Button>
          </Dropdown>
          <Table dataSource={filteredRequests} columns={columns} rowKey="_id" />
        </>
      )}
      <Modal
        title="Enter a comment"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={newStatus === "APPROVED" ? "Approve" : "Reject"}
      >
        <Input.TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter comment for this action"
        />
      </Modal>
    </div>
  );
};

export default AdoptableManagement;

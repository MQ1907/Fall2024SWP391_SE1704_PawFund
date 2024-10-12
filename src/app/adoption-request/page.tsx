"use client";
import { createAdoptionRequest } from "@/lib/features/adopt/adoptSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { Button, Form, Input, message, Select } from "antd";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
interface DecodedToken {
  id: string;
}

const CreateAdoptionRequest: React.FC<{ petId: string }> = ({ petId }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.adoption);
  const [userId, setUserId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserIdFromToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          setUserId(decodedToken.id);
        } catch (error) {
          console.error("Invalid token:", error);
          message.error("Failed to decode token. Please log in again.");
        }
      } else {
        message.error("No token found. Please log in.");
      }
    };

    fetchUserIdFromToken();
  }, []);

  const handleSubmit = async (values: any) => {
    if (!userId) {
      message.error("User ID is not available. Please log in.");
      return;
    }

    const requestData = {
      petId: petId,
      userId: userId,
      requestDate: values.requestDate || new Date(),
      reviewBy: userId, // Gán userId cho reviewBy , co the thay doi sau nay
      comment: values.comment,
      adoptionDate: values.adoptionDate || new Date(),
      status: values.status || "PENDING", // Đặt giá trị mặc định
    };

    try {
      const resultAction = await dispatch(createAdoptionRequest(requestData));

      if (createAdoptionRequest.fulfilled.match(resultAction)) {
        message.success("Adoption request submitted successfully!");

        form.resetFields();
      } else {
        const errorMessage =
          resultAction.error.message || "An unknown error occurred";
        message.error(`Failed to submit adoption request: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-[450px] mt-[10px]">
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          status: "PENDING",
        }}
      >
        <Form.Item
          label="Request Date"
          name="requestDate"
          rules={[{ required: true, message: "Please select a request date!" }]}
        >
          <Input type="datetime-local" />
        </Form.Item>

        <Form.Item
          label="Review By"
          name="reviewBy"
          initialValue={userId}
          hidden
        >
          <Input.TextArea rows={4} disabled />{" "}
          {/* Chỉ hiển thị, không cho sửa */}
        </Form.Item>

        <Form.Item label="Comment" name="comment">
          <Input />
        </Form.Item>

        <Form.Item
          label="Adoption Date"
          name="adoptionDate"
          rules={[
            { required: true, message: "Please select an adoption date!" },
          ]}
        >
          <Input type="datetime-local" />
        </Form.Item>

        <Form.Item
          label="Adoption Request Status"
          name="status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select>
            <Select.Option value="PENDING">PENDING</Select.Option>
            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
            <Select.Option value="CANCELLED">CANCELLED</Select.Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send Adoption Request"}
        </Button>

        {status === "loading" && <p>Processing your request...</p>}
        {status === "failed" && (
          <p style={{ color: "red" }}>
            Error: {error || "An unexpected error occurred. Please try again."}
          </p>
        )}
      </Form>
    </div>
  );
};

export default CreateAdoptionRequest;

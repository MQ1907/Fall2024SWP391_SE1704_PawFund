"use client";
import {
  useAdoptionRequests,
  useAppDispatch,
  useAppSelector,
} from "@/lib/hook";
import { Button, Form, Input, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { createAdoptionRequest } from "@/lib/features/adopt/adoptSlice";
import { useParams } from "next/navigation";

interface DecodedToken {
  id: string;
}

const CreateAdoptionRequest = () => {
  const params = useParams();
  const petId = params.id as string;
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.adoption);
  const [userId, setUserId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(true);
  const { hasExistingRequest, addRequest } = useAdoptionRequests();

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

    if (hasExistingRequest(petId, userId)) {
      message.error("You have already submitted an adoption request for this pet.");
      return;
    }

    const requestData = {
      petId: petId,
      userId: userId,
      requestDate: new Date(),

      comment: values.comment,
      status: "PENDING",
    };

    try {
      const resultAction = await dispatch(createAdoptionRequest(requestData));

      if (createAdoptionRequest.fulfilled.match(resultAction)) {
        addRequest({ petId, userId });
        message.success("Adoption request has been sent successfully!");
        form.resetFields();
        setShowForm(false);
      } else {
        const errorMessage =
          resultAction.error.message || "An undefined error occurred";
        message.error(`Cannot send adoption request: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error when sending adoption request:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  if (!showForm) {
    return <div>Thank you for your adoption request!</div>;
  }

  return (
    <div className="w-[450px] mt-[10px] ">
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          requestDate: new Date().toISOString(),
          status: "PENDING",
        }}
      >
        <Form.Item
          label="Request Date"
          name="requestDate"
          initialValue={new Date().toISOString()}
          hidden
        >
          <Input type="hidden" />
        </Form.Item>

        <Form.Item label="Comment" name="comment" className="text-[20px]">
          <Input />
        </Form.Item>

        <Form.Item
          label="Adoption Request Status"
          name="status"
          initialValue="PENDING"
          hidden
        >
          <Input value="PENDING" disabled />
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

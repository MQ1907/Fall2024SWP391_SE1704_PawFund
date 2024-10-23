"use client"
import { useAdoptionRequests, useAppDispatch, useAppSelector } from "@/lib/hook";
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
      message.error("ID người dùng không khả dụng. Vui lòng đăng nhập.");
      return;
    }

    if (hasExistingRequest(petId, userId)) {
      message.error("Bạn đã gửi yêu cầu nhận nuôi cho con vật cưng này rồi.");
      return;
    }

    const requestData = {
      petId: petId,
      userId: userId,
      requestDate: new Date(),
      reviewBy: userId,
      comment: values.comment,
      adoptionDate: new Date(),
      status: "PENDING",
    };

    try {
      const resultAction = await dispatch(createAdoptionRequest(requestData));

      if (createAdoptionRequest.fulfilled.match(resultAction)) {
        addRequest({ petId, userId });
        message.success("Yêu cầu nhận nuôi đã được gửi thành công!");
        form.resetFields();
        setShowForm(false);
      } else {
        const errorMessage =
          resultAction.error.message || "Đã xảy ra lỗi không xác định";
        message.error(`Không thể gửi yêu cầu nhận nuôi: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu nhận nuôi:", error);
      message.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
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

        <Form.Item
          label="Review By"
          name="reviewBy"
          initialValue={userId}
          hidden
        >
          <Input.TextArea rows={4} disabled />
        </Form.Item>

        <Form.Item label="Comment" name="comment" className="text-[20px]">
          <Input />
        </Form.Item>

        {/* <Form.Item
          label="Adoption Date"
          name="adoptionDate"
          rules={[{ required: true, message: "Please select an adoption date!" }]}
        >
          <Input type="date" min={new Date().toISOString().split("T")[0]} />
        </Form.Item> */}

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

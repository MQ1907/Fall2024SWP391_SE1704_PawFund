import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { Button, Form, Input, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { createAdoptionRequest } from "@/lib/features/adopt/adoptSlice";

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
      requestDate: new Date().toISOString(), // Set to current date
      reviewBy: userId,
      comment: values.comment,
      adoptionDate: values.adoptionDate, // Set to the selected adoption date
      status: "PENDING",
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

        <Form.Item
          label="Adoption Date"
          name="adoptionDate"
          rules={[{ required: true, message: "Please select an adoption date!" }]}
        >
          <Input type="date" min={new Date().toISOString().split("T")[0]} />
        </Form.Item>

        <Form.Item label="Adoption Request Status" name="status" initialValue="PENDING" hidden>
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

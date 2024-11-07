"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Upload,
} from "antd";
import { createPet } from "../../lib/features/pet/petSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { jwtDecode } from "jwt-decode";
import { UploadOutlined } from "@ant-design/icons";
import ImageUploader from "../components/uploadImage/page";

const { TextArea } = Input;

interface DecodedToken {
  id: string;
}

const AddPet: React.FC = () => {
  const [rescueBy, setRescueBy] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.pets);
  const [form] = Form.useForm();

  const [petData, setPetData] = useState({
    shelterLocation: "",
    name: "",
    gender: "",
    description: "",
    image: "",
    color: "",
    breed: "",
    note: "",
    rescueBy: rescueBy,
    rescueFee: null,
    locationFound: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        setRescueBy(decodedToken.id);
        setPetData((prevState) => ({
          ...prevState,
          rescueBy: decodedToken.id,
        }));
      } catch (error) {
        console.error("Invalid token:", error);
        message.error("Failed to decode token. Please log in again.");
      }
    } else {
      message.error("No token found. Please log in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      if (!petData.rescueBy) {
        message.error("Failed to submit. No rescueBy found.");
        return;
      }

      const resultAction = await dispatch(createPet(petData));
      if (createPet.fulfilled.match(resultAction)) {
        message.success("Pet added successfully!");
        form.resetFields();
      } else if (createPet.rejected.match(resultAction)) {
        const errorMessage =
          resultAction.error.message || "Unknown error occurred";
        message.error(`Failed to add pet: ${errorMessage}`);
      }
    } catch (error) {
      message.error(
        "An error occurred while submitting the form. Please try again."
      );
    }
  };

  return (
    <div className="w-full mt-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-2xl mx-auto"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Name cannot be empty" },
            { min: 3, message: "Name must be at least 3 characters long" },
            { max: 50, message: "Name cannot exceed 50 characters" },
            {
              pattern: /^[A-Z][a-zA-Z\s]*$/,
              message: "The first letter must be uppercase",
            },
          ]}
        >
          <Input name="name" value={petData.name} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select a gender" }]}
        >
          <Select
            onChange={(value) => setPetData({ ...petData, gender: value })}
            placeholder="Select gender"
          >
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Male">Male</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Rescue By" name="rescueBy" hidden>
          <Input value={rescueBy} disabled />
        </Form.Item>

        <Form.Item
          label="Shelter Location"
          name="shelterLocation"
          rules={[
            { required: true, message: "Please select Shelter Location" },
          ]}
        >
          <Select
            onChange={(value) =>
              setPetData({ ...petData, shelterLocation: value })
            }
            placeholder="Select Shelter Location"
          >
            <Select.Option value="Location A">Location A</Select.Option>
            <Select.Option value="Location B">Location B</Select.Option>
            <Select.Option value="Location C">Location C</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[{ required: true, message: "Please select a color" }]}
        >
          <Select
            onChange={(value) => setPetData({ ...petData, color: value })}
            placeholder="Select a color"
          >
            <Select.Option value="Black">Black</Select.Option>
            <Select.Option value="White">White</Select.Option>
            <Select.Option value="Brown">Brown</Select.Option>
            <Select.Option value="Yellow">Yellow</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Breed"
          name="breed"
          rules={[
            { required: true, message: "Please enter the breed" },
            {
              pattern: /^[A-Za-z\s]+$/,
              message: "Breed can only contain letters",
            },
          ]}
        >
          <Input name="breed" value={petData.breed} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter a description" },
            { max: 150, message: "Description cannot exceed 150 characters" },
          ]}
        >
          <TextArea
            name="description"
            value={petData.description}
            onChange={handleChange}
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Rescue Fee"
          name="rescueFee"
          rules={[
            { required: true, message: "Please enter the Rescue Fee" },
            {
              validator: (_, value) =>
                value && value >= 0
                  ? Promise.resolve()
                  : Promise.reject("Rescue Fee must be a positive number"),
            },
          ]}
        >
          <InputNumber
            value={petData.rescueFee}
            onChange={(value) => setPetData({ ...petData, rescueFee: value })}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
            addonAfter="VND"
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Location Found"
          name="locationFound"
          rules={[{ required: true, message: "Please enter location found" }]}
        >
          <Input
            name="locationFound"
            value={petData.locationFound}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Note"
          name="note"
          rules={[{ required: true, message: "Please enter a note" }]}
        >
          <Input name="note" value={petData.note} onChange={handleChange} />
        </Form.Item>

         <Form.Item
          label="Upload"
          name="image"
          rules={[
            {
              required: true,
              message: "Please upload an image",
            },
          ]}
        >
          <ImageUploader name="image" value={petData.image} onChange={handleChange} />
        </Form.Item>


        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={status === "loading"}
          >
            Submit
          </Button>
        </Form.Item>

        {status === "failed" && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </div>
  );
};

export default AddPet;

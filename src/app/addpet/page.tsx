"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Switch, message } from "antd";
import { createPet } from "../../lib/features/pet/petSlice"; // Import the createPet action
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { jwtDecode } from "jwt-decode";

const { TextArea } = Input;

interface DecodedToken {
  id: string;
}

const AddPet: React.FC = () => {
  const [rescueBy, setRescueBy] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.pets);

  useEffect(() => {
    const fetchRescueByFromToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          setRescueBy(decodedToken.id);
          // Cập nhật vào petData ngay sau khi lấy được rescueBy
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
    };

    fetchRescueByFromToken();
  }, []);

  const [petData, setPetData] = useState({
    shelterLocation: "",
    name: "",
    gender: "",
    description: "",
    image: "",
    color: "",
    breed: "",
    age: "",
    note: "",
    rescueBy: rescueBy,
    rescueFee: "",
    locationFound: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["age", "rescueFee"].includes(
      name
    )
      ? parseInt(value, 10)
      : value;

    setPetData({ ...petData, [name]: parsedValue });
    console.log("Updated petData:", { ...petData, [name]: parsedValue });
  };


 const handleSubmit = async () => {
  try {
    await form.validateFields();

    if (!petData.rescueBy) {
      message.error("Failed to submit. No rescueBy found.");
      return;
    }

    console.log("Submitting petData:", petData);
    const resultAction = await dispatch(createPet(petData));

    if (createPet.fulfilled.match(resultAction)) {
      message.success("Thêm thú cưng thành công!");
      // Reset form fields
      form.resetFields();
    } else if (createPet.rejected.match(resultAction)) {
      const errorMessage = resultAction.error.message || "Unknown error occurred";
      message.error(`Thêm thú cưng thất bại: ${errorMessage}`);
      console.error("Error details:", resultAction.error);
    }
  } catch (error) {
    console.error("Submission error:", error);
    message.error("Có lỗi xảy ra khi gửi form. Vui lòng thử lại.");
  }
};
  const [form] = Form.useForm();

  return (
    <div className="w-[100%] mt-[10px]">
      <Form form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Tên không được để trống" },
            { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
            { max: 50, message: "Tên không được vượt quá 50 ký tự" },
            {
              pattern: /^[A-Z][a-zA-Z\s]*$/,
              message: "Chữ cái đầu phải viết hoa",
            },
          ]}
        >
          <Input name="name" value={petData.name} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Select
            onChange={(value) => setPetData({ ...petData, gender: value })}
            value={petData.gender}
            placeholder="Chọn giới tính"
          >
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Male">Male</Select.Option>
          </Select>
        </Form.Item>

          <Form.Item
          label="Rescue By"
          name="rescueBy"
          initialValue={rescueBy}
          hidden
        >
          <Input.TextArea rows={4} disabled />
        </Form.Item>

        <Form.Item
          label="Shelter Location"
          name="shelterLocation"
          rules={[
            { required: true, message: "Vui lòng nhập Shelter Location" },
          ]}
        >
         <Select
            onChange={(value) => setPetData({ ...petData, shelterLocation: value })}
            value={petData.shelterLocation}
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
          rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
        >
          <Select
            onChange={(value) => setPetData({ ...petData, color: value })}
            value={petData.color}
            placeholder="Chọn màu sắc"
          >
            <Select.Option value="Black">Black</Select.Option>
            <Select.Option value="White">White</Select.Option>
            <Select.Option value="Brown">Brown</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Breed"
          name="breed"
          rules={[
            { required: true, message: "Vui lòng nhập giống loài (Breed)" },
            {
              pattern: /^[A-Za-z\s]+$/,
              message: "Giống loài (Breed) chỉ được chứa chữ cái",
            },
          ]}
        >
          <Input name="breed" value={petData.breed} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            { required: true, message: "Vui lòng nhập tuổi (Age)" },
            { pattern: /^[0-9]+$/, message: "Tuổi (Age) chỉ được chứa số" },
          ]}
        >
          <Input name="age" value={petData.age} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { max: 150, message: "Mô tả không được quá 150 ký tự" },
          ]}
        >
          <TextArea
            name="description"
            value={petData.description}
            onChange={handleChange}
            rows={4}
          />
        </Form.Item>


        <Form.Item label="Rescue Fee">
          <Input
            name="rescueFee"
            value={petData.rescueFee}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item label="Location Found">
          <Input
            name="locationFound"
            value={petData.locationFound}
            onChange={handleChange}
          />
        </Form.Item>


        <Form.Item label="Note">
          <Input name="note" value={petData.note} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Upload">
          <Input name="image" value={petData.image} onChange={handleChange} />
        </Form.Item>

        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>

        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </div>
  );
};

export default AddPet;

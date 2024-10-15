"use client";
import React, { useState } from "react";
import { Button, Form, Input, Select, Switch, message } from "antd";
import { createPet } from "../../lib/features/pet/petSlice"; // Import the createPet action
import { useAppDispatch, useAppSelector } from "@/lib/hook";

const { TextArea } = Input;

const AddPet: React.FC = () => {
  // const [rescueDate, setRescueDate] = useState("");
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.pets);
  const [petData, setPetData] = useState({
    shelterId: "",
    petCode: "",
    name: "",
    gender: "",
    description: "",
    image: "",
    color: "",
    breed: "",
    age: "",
    isVacinted: false,
    isVerified: false,
    deliveryStatus: "",
    isAdopted: false,
    note: "",
    rescueBy: "",
    rescueDate: "",
    rescueFee: "",
    locationFound: "",
    petStatus: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["age", "shelterId", "species", "rescueFee"].includes(
      name
    )
      ? parseInt(value, 10)
      : value;

    setPetData({ ...petData, [name]: parsedValue });
    console.log("Updated petData:", { ...petData, [name]: parsedValue });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    console.log(`Switch ${name} changed to:`, checked);
    setPetData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

const handleSubmit = async () => {
  try {
    // Kiểm tra tính hợp lệ của tất cả các trường
    await form.validateFields(); // 'form' là biến bạn sẽ tạo bên ngoài component

    console.log("Submitting petData:", petData);
    const resultAction = await dispatch(createPet(petData));

    if (createPet.fulfilled.match(resultAction)) {
      message.success("Thêm thú cưng thành công!");
      setPetData({
        // Reset the form after successful submission
        shelterId: "",
        petCode: "",
        name: "",
        description: "",
        image: "",
        color: "",
        breed: "",
        age: "",
        isVacinted: false,
        isVerified: false,
        deliveryStatus: "",
        isAdopted: false,
        note: "",
        rescueBy: "",
        rescueFee: "",
        locationFound: "",
        petStatus: "",
        gender: "",
        rescueDate: "",
      });
    } else {
      message.error(`Thêm thú cưng thất bại: ${error}`);
    }
  } catch (error) {
    // Xử lý lỗi nếu có trường không hợp lệ
    console.error("Validation failed:", error);
    message.error("Vui lòng kiểm tra các trường và thử lại.");
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
          label="Rescue Date"
          name="rescueDate"
          rules={[
            { required: true, message: "Vui lòng nhập ngày cứu hộ" },
            {
              type: "date",
              message: "Định dạng ngày không hợp lệ",
            },
          ]}
        >
          <Input
            type="datetime-local"
            name="rescueDate"
            value={petData.rescueDate}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Shelter ID"
          name="shelterId"
          rules={[
            { required: true, message: "Vui lòng nhập Shelter ID" },
            { pattern: /^[0-9]+$/, message: "Shelter ID chỉ được chứa số" },
          ]}
        >
          <Input
            name="shelterId"
            value={petData.shelterId}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Pet Code"
          name="petCode"
          rules={[{ required: true, message: "Vui lòng nhập Pet Code" }]}
        >
          <Input
            name="petCode"
            value={petData.petCode}
            onChange={handleChange}
          />
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

        <Form.Item label="Vaccinated" valuePropName="checked">
          <Switch
            checked={petData.isVacinted}
            onChange={(checked) => handleSwitchChange("isVacinted", checked)}
          />
        </Form.Item>

        <Form.Item label="Verified" valuePropName="checked">
          <Switch
            checked={petData.isVerified}
            onChange={(checked) => handleSwitchChange("isVerified", checked)}
          />
        </Form.Item>

        <Form.Item label="Delivery Status">
          <Select
            onChange={(value) =>
              setPetData({ ...petData, deliveryStatus: value })
            }
            value={petData.deliveryStatus}
          >
            {/* <Select.Option value="PENDING">PENDING</Select.Option>
            <Select.Option value="COMPLETED">COMPLETED</Select.Option> */}
            <Select.Option value="INPROCESS">INPROCESS</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Adopted" valuePropName="checked">
          <Switch
            checked={petData.isAdopted}
            onChange={(checked) => handleSwitchChange("isAdopted", checked)}
          />
        </Form.Item>

        <Form.Item label="Rescue By">
          <Input
            name="rescueBy"
            value={petData.rescueBy}
            onChange={handleChange}
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

        <Form.Item label="Pet Status">
          <Select
            onChange={(value) => setPetData({ ...petData, petStatus: value })}
            value={petData.petStatus}
          >
            <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
            <Select.Option value="ADOPTED">ADOPTED</Select.Option>
            <Select.Option value="LOST">LOST</Select.Option>
          </Select>
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

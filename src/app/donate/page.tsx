"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/lib/hook";
import { Button, Input, Form, InputNumber, message } from "antd";

import GoodBaby from "../goodpet/page";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Donate = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supporterData = [
    {
      id: 1,
      name: "ME-0 Vietnam",
      description: "Number 1 cat food supplier",
      image: "/images/sp1.png",
    },
    {
      id: 2,
      name: "SmartHeart Vietnam",
      description: "Number 1 cat food supplier",
      image: "/images/sp2.png",
    },
    {
      id: 3,
      name: "BetterWord Saigon",
      description: "Number 1 cat food supplier",
      image: "/images/sp3.png",
    },
    {
      id: 4,
      name: "FPT University",
      description: "Sponsor of animal support and fundraising campaigns",
      image: "/images/sp4.png",
    },
  ];

  const handleDonate = async (values: any) => {
    try {
      setLoading(true);

      const paymentData = {
        amount: Number(values.amount),
        returnUrl: "http://localhost:3000/success",
        cancelUrl: "http://localhost:3000/cancel",
      };

      console.log("Sending payment data:", paymentData);

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "API request failed");
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        throw new Error("No checkout URL in response");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error(
        error.message || "An error occurred while creating the transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative "
        style={{ backgroundImage: "url('/images/donate.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16 ">
          <div className="animate__animated animate__fadeInLeft">
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              DONATE
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">Donate</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-10 mt-10 animate__animated animate__zoomIn">
        <div className="col-span-2 bg-[#FFFFFF] ml-[200px]">
          <h1 className="text-[35px] font-medium text-3xl">I WANT TO DONATE</h1>
          <hr className="w-[60px] border-[1px] text-[#cecece] mt-2" />
          <p className="mt-4 text-black text-lg italic font-medium">
            All rescue activities of Hanoi Pet Adoption are completely based on
            donations from the community. The groups monthly expenses include
            rent, hospital fees, food, electricity, water, medicine and
            supplies, diapers, salaries to support volunteers in cleaning... The
            group really needs your help. you to be able to maintain the common
            house as well as the rescue team. Just a fixed amount of 50k - 100k
            monthly will help the group and children a lot!
          </p>
          <br />
          <p className=" text-[16px] font-medium text-black">
            The costs will be divided equally among the other children still in
            the hospital and a common home will be built. In addition, the Group
            also accepts donations in kind such as old clothes (for bedding),
            diapers, medical gloves, food, sand, etc.
          </p>
          <br />

          <br />
          <p className="text-[16px] font-medium text-black">
            *Note: the group does not use zalo and NEVER asks Manh Thuong Quan
            to provide card information or OTP code
          </p>

          <br />
        </div>
        <div>
          <Image
            src="/images/donatepic.jpg"
            alt="pets"
            width={230}
            height={230}
            className="transform transition-transform duration-300 hover:scale-110"
          />
        </div>

        <div>
          <div
            className="relative bg-cover bg-center h-[500px] ml-[200px] w-[800px] rounded-lg overflow-hidden"
            style={{
              backgroundImage: "url('/images/bgdonate.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />

            <div className="relative z-10 h-full p-8">
              <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
                DONATE TO PAWFUND COMMUNITY
              </h2>
              <Form onFinish={handleDonate} layout="vertical">
                <Form.Item
                  name="amount"
                  label={
                    <span className="text-white font-normal text-lg">
                      Donation Amount (VND)
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter amount" },
                    {
                      type: "number",
                      min: 10000,
                      message: "Minimum amount is 10,000 VND",
                    },
                    {
                      type: "number",
                      max: 100000000,
                      message: "Maximum amount is 100,000,000 VND",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full h-12 text-lg bg-white/80 backdrop-blur-sm rounded-md"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/[^\d]/g, "")} // Only allow digits
                    placeholder="Enter amount"
                    min={10000}
                    max={100000000}
                    precision={0}
                    keyboard={true}
                    controls={false}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={
                    <span className="text-white font-medium text-lg">
                      Message
                    </span>
                  }
                >
                  <Input.TextArea
                    className="bg-white/80 backdrop-blur-sm rounded-md"
                    placeholder="Enter your message (optional)"
                    rows={4}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-12 text-lg bg-[#EC4899] hover:bg-[#008ADE]/80 border-none"
                  >
                    Donate Now
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <div className="flex items-end ml-[200px] mt-7">
            <button
              onClick={() => {
                router.push("/contact");
              }}
              className="bg-pink-500 hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full w-[200px]"
            >
              SUPPORT
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pt-10 mt-8 gap-3 bg-[#F6F6F6]">
        <div className="font-semibold text-3xl ">SUPPORTER COMMUNITY</div>
        <Image
          src="/images/dogfoot.png"
          alt="Pet search logo"
          width={30}
          height={30}
          className="transform rotate-12"
        />
        <div>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-6 p-6 w-[1100px]">
              {supporterData.slice(0, 16).map((suppoter, index) => (
                <div
                  key={index}
                  className="relative bg-[#F6F6F6] rounded-2xl shadow-md p-4 group"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={suppoter.image}
                      alt=""
                      width={200}
                      height={200}
                      className="w-[200px] h-[200px] rounded-2xl transition-transform duration-500 transform group-hover:scale-110"
                    />
                    {/* Overlay với description */}
                    <div className="absolute  inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100  rounded-2xl-transition-opacity duration-500 transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-white text-center">
                        {suppoter.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 items-center">
                    <h3 className="text-[21px] font-medium">{suppoter.name}</h3>
                    <Image
                      src="/images/dogfoot.png"
                      alt="Pet search logo"
                      width={30}
                      height={30}
                      className="transform rotate-12"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="h-[200px] w-full  relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/donatepic2.jpg")',
          backgroundSize: "100% 100%",
        }}
      >
        <div className="bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
          <div className="flex-col-reverse animate__animated animate__bounce  animation-duration: 5s ">
            <div>
              <h1 className="text-white text-2xl font-medium mt-2 ml-[100px] w-[600px] text-center">
                LIST OF SPONSORS
              </h1>
            </div>
            <div className="ml-[300px] mt-10">
              <a
                href="#"
                className="bg-[#d4376e] hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full mr-[170px]"
              >
                VIEW ALL
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <GoodBaby />
      </div>
    </div>
  );
};

export default Donate;

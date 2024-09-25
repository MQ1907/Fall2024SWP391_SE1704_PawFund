import Image from "next/image";
import React from "react";
import { Input } from "antd";

const Page = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[50%] bg-gray-200  h-full">
        <Image
          src="/images/dogandcat.png"
          alt="Dog and Cat"
          width={1000}
          height={2000}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-[50%] text-center w-[100%] ">
        <div>
          <h1 className="text-[40px] font-bold pt-[140px] ">Sign In </h1>
          <h2 className="text-[35px] font-bold pt-5 ">Welcome to PawFund </h2>
        </div>
        <div className="w-[50%] ml-[200px] pt-[50px] ">
          <Input
            className="h-[40px]"
            placeholder="Username"
            style={{ backgroundColor: "#e5e4e4", border: "none" }}
          />
          <Input
            type="password"
            className="h-[40px] "
            placeholder="Password"
            style={{
              backgroundColor: "#e5e4e4",
              border: "none",
              marginTop: "30px",
            }}
          />
          {/* <button className="text-[15px] mt-6 px-4 py-3 w-[100%] bg-[#2b74d4] text-white font-semibold rounded-md transition duration-1000 ease-in-out hover:text-black  hover:bg-[#FFEB55]">
            Get Started
          </button> */}
          {/* <button className=" font-semibold duration-300  mt-6 rounded-md text-[15px] w-[100%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#2b74d4] hover:bg-[#FFEB55] py-2.5 px-5 uppercase text-white before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all">
            Get Started
          </button> */}
          <button className=" font-semibold duration-300  mt-6 rounded-md text-[15px] w-[100%] relative border-2 border-gray-800 bg-transparent py-2.5 px-5 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-[#2b74d4] before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100">
            button one
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

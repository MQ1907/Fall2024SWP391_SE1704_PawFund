"use client";
import Image from "next/image";
import React from "react";
import { Dropdown, Input, Button, MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { DownOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../lib/hook"; // Import hooks
import { signup } from "../../lib/features/auth/authSlice"; // Import async thunk
const buttonChooseRole = (isHovered: boolean): React.CSSProperties => {
  return {
    width: "100%",
    marginTop: "1.25rem",
    backgroundColor: isHovered ? "#2b74d4" : "#FFEB55", // Thay đổi màu nền khi hover
    borderColor: "#FFEB55",
    color: isHovered ? "#FFFFFF" : "#000000",
    padding: "1.25rem 0",
    fontWeight: "600",
    fontSize: "17px",
  };
};

const Page: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [role, setRole] = React.useState("Choose Your Role");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [confirmPassword, setConfirmPassword] = React.useState('');

  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "CUSTOMER",
      onClick: () => setRole("CUSTOMER"),
    },
    {
      key: "2",
      label: "VOLUNTEER",
      onClick: () => setRole("VOLUNTEER"),
    },
  ];

  const handleSignup = () => {
    dispatch(signup({ name, email, password, role }));
  };

  React.useEffect(() => {
    if (authStatus === "succeeded") {
      router.push("/signin"); // Điều hướng sau khi đăng ký thành công
    }
  }, [authStatus, router]);

  return (
    <div className="flex h-screen text-center justify-center align-middle">
      <div className="w-[50%] bg-gray-200">
        <Image
          src="/images/btlogin.png"
          alt="Dog and Cat"
          width={1000}
          height={1000}
          className="w-[100%] h-[100%]"
        />
      </div>
      <div className="w-[50%] w-[100%]">
        <div className="relative">
          <div className="absolute w-[15%] h-[15%]">
            <Image
              src="/images/logo1.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="object-contain"
            />
          </div>
        </div>

        <div>
          <h1 className="text-[40px] font-bold pt-[50px] ">Sign Up </h1>
          <h2 className="text-[35px] font-bold pt-5 ">Welcome to PawFund </h2>
        </div>
        <div className="w-[50%] ml-[200px] pt-[50px] flex flex-col gap-3">
          <Input
            className="h-[40px] "
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ backgroundColor: "#e5e4e4", border: "none" }}
          />

          <Input
            className="h-[40px] "
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ backgroundColor: "#e5e4e4", border: "none" }}
          />
         
           <Input.Password 
            type="password"
              className="h-[40px]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}/>

         
          <Dropdown menu={{ items }} placement="bottomLeft">
            <Button
              style={buttonChooseRole(isHovered)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {role}
              <DownOutlined className="text-[50px]" />
            </Button>
          </Dropdown>
          
           <button  onClick={handleSignup}  className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[100%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all">
              Get Started
            </button>
          {authStatus === "failed" && <p className="text-red-500">{error}</p>}{" "}
          {/* Hiển thị lỗi nếu có */}
          <div className="flex pt-5">
            <hr className="bg-black w-48 mt-5 px-2 h-[2px]" />
            <p className="px-5 pt-2">or</p>
            <hr className="bg-black w-44 mt-5 px-2 h-[2px]" />
          </div>
          <div className="flex">
            <div>
              <button className="flex items-center gap-4 font-semibold duration-300 mt-6 rounded-md text-[15px] w-full relative border-2 border-gray-800 bg-transparent py-2.5 px-10 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-[#4b6cff] before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100">
                <Image
                  src="/images/facebook.png"
                  alt="Facebook"
                  width={1000}
                  height={1000}
                  className="w-[20px] h-[20px] ml-[-30px]"
                />
                Facebook
              </button>
            </div>
            <div className="ml-[70px]">
              <button className="flex font-semibold gap-4 duration-300  mt-6 rounded-md text-[15px] w-[100%] relative border-2 border-gray-800 bg-transparent py-2.5 px-10 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-[#000000] before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100">
                <Image
                  src="/images/google.png"
                  alt="Google"
                  width={1000}
                  height={1000}
                  className="w-[20px] h-[20px] ml-[-30px]"
                />
                Google
              </button>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-[15px]">
              You already have account
              <a
                className="text-[#FFEB55] cursor-pointer px-2"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

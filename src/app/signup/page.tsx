"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dropdown, Input, Button, MenuProps, Spin, notification } from "antd";
import { useRouter } from "next/navigation";
import { DownOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../lib/hook";
import { signup } from "../../lib/features/auth/authSlice";

const Page = () => {
  const buttonChooseRole = (isHovered: boolean): React.CSSProperties => {
    return {
      width: "100%",
      marginTop: "1.25rem",
      backgroundColor: isHovered ? "#2b74d4" : "#FFEB55",
      borderColor: "#FFEB55",
      color: isHovered ? "#FFFFFF" : "#000000",
      padding: "1.25rem 0",
      fontWeight: "600",
      fontSize: "17px",
    };
  };

  const [isHovered, setIsHovered] = useState(false);
  const [role, setRole] = useState("Choose Your Role");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

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

  const validateField = (field: string, value: string) => {
    const newErrors: { [key: string]: string } = { ...errors };

    switch (field) {
      case "name":
        if (!value) newErrors.name = "Name is required";
        else if (!/^[A-Z]/.test(value))
          newErrors.name = "Name must start with an uppercase letter";
        else delete newErrors.name;
        break;
      case "email":
        if (!value) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value))
          newErrors.email = "Invalid email format";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (value.length < 6)
          newErrors.password = "Password must be at least 6 characters long";
        else delete newErrors.password;
        break;
      case "confirmPassword":
        if (value !== password)
          newErrors.confirmPassword = "Passwords do not match";
        else delete newErrors.confirmPassword;
        break;
      case "phone":
        if (!value) newErrors.phone = "Phone number is required";
        else if (!/^0/.test(value))
          newErrors.phone = "Phone number must start with 0";
        else if (!/^\d{10,11}$/.test(value))
          newErrors.phone = "Phone number must be 10 to 11 numbers";
        else delete newErrors.phone;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      validateField(field, value);
    };
  const validate = () => {
    const requiredFields = { name, email, password, confirmPassword, phone };
    let valid = true;

    Object.keys(requiredFields).forEach((field) => {
      if (!requiredFields[field as keyof typeof requiredFields]) {
        validateField(field, requiredFields[field as keyof typeof requiredFields]);
        valid = false;
      }
    });

    return valid;
  };

  const handleSignup = () => {
    if (validate()) {
      setLoading(true);
      dispatch(signup({ name, email, password, role, address, phone }));
    }
  };

  useEffect(() => {
    if (authStatus === "succeeded") {
      notification.success({
        message: "Registration Successful",
        description: "Please verify in your email",
      });
      setTimeout(() => {
        router.push("/signin");
      }, 2000); // Delay to allow the user to see the notification
    }
    setLoading(false);
  }, [authStatus, router]);

  return (
    <Spin spinning={loading} size="large">
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
              onChange={handleInputChange(setName, "name")}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <Input
              className="h-[40px] "
              placeholder="Email"
              value={email}
              onChange={handleInputChange(setEmail, "email")}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <Input.Password
              type="password"
              className="h-[40px]"
              placeholder="Password"
              value={password}
              onChange={handleInputChange(setPassword, "password")}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}

            <Input.Password
              type="password"
              className="h-[40px]"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleInputChange(
                setConfirmPassword,
                "confirmPassword"
              )}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}

            <Input
              className="h-[40px] "
              placeholder="Address"
              value={address}
              onChange={handleInputChange(setAddress, "address")}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />

            <Input
              className="h-[40px] "
              placeholder="Phone"
              value={phone}
              onChange={handleInputChange(setPhone, "phone")}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}

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

            <button
           
              onClick={handleSignup}
              className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[100%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all"
            >
              Get Started
            </button>
            {authStatus === "failed" && <p className="text-red-500">{error}</p>}
           
         
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
    </Spin>
  );
};

export default Page;
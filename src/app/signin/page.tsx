"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input, notification, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../../lib/hook";
import { signin } from "../../lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import "animate.css";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Please enter correct email";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSignin = () => {
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (!emailValidationError && !passwordValidationError) {
      setLoading(true);
      dispatch(signin({ email, password }));
    }
  };

  const handleSignup = () => {
    setLoading(true);
    router.push("/signup");
  };

  useEffect(() => {
    if (authStatus === "succeeded") {
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in",
      });
      router.push("/home");
    } else if (authStatus === "failed" && error === "Please verify in the mail was sent to your device") {
      notification.warning({
        message: "Verification Required",
        description: "Please verify in the mail was sent to your device",
      });
    } else if (authStatus === "failed" && error === "Wrong Username or password") {
      notification.error({
        message: "Login Failed",
        description: "Wrong Username or password",
      });
    } else if (authStatus === "failed") {
      notification.error({
        message: "Login Failed",
        description: error,
      });
    }
    setLoading(false);
  }, [authStatus, error, router]);

  return (
    <Spin spinning={loading} size="large">
      <div className="flex h-screen text-center justify-center align-middle animate__animated animate__fadeIn">
        <div className="w-[50%] bg-gray-200 animate__animated animate__fadeInLeft">
          <Image
            src="/images/btlogin.png"
            alt="Dog and Cat"
            width={1000}
            height={1000}
            className="w-[100%] h-[100%]"
          />
        </div>
        <div className="w-[50%] flex flex-col items-center justify-center animate__animated animate__fadeInRight pb-72">
          <div className="">
            <div className=" pt-28  w-[15%] h-[15%] animate__animated animate__bounceIn ">
              <Image
                src="/images/logo1.png"
                alt="Logo"
                width={1000}
                height={1000}
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-[40px] font-bold pt-[140px] animate__animated animate__fadeInDown">
              Sign In
            </h1>
            <h2 className="text-[35px] font-bold pt-5 animate__animated animate__fadeInDown animate__delay-1s">
              Welcome to PawFund
            </h2>
           
            <div className="w-[50%] pt-[50px]">
              <Input
                className="h-[40px] animate__animated animate__fadeInUp"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ backgroundColor: "#e5e4e4", border: "none" }}
              />
              {emailError && <p className="text-red-500">{emailError}</p>}
              <Input.Password
                type="password"
                className="h-[40px] animate__animated animate__fadeInUp animate__delay-1s"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: "#e5e4e4",
                  border: "none",
                  marginTop: "30px",
                }}
              />
              {passwordError && <p className="text-red-500">{passwordError}</p>}
              <button
                onClick={handleSignin}
                className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[100%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all animate__animated animate__fadeInUp animate__delay-2s"
              >
                Get Started
              </button>
              
              
              <div className="pt-10">
                <p className="text-[15px]">
                  Dont have an account?{" "}
                  <a
                    className="text-[#FFEB55] cursor-pointer px-2 animate__animated animate__fadeInUp animate__delay-2s"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default SignIn;
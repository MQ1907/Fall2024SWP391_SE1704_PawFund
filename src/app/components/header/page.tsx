"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "../../../lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hook";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "animate.css";
import {  Spin } from "antd";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const controlHeader = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlHeader);

      return () => {
        window.removeEventListener("scroll", controlHeader);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token"); // Check client-side before accessing localStorage
      setToken(storedToken);

      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const userId = decodedToken.id;

          console.log("userId", userId);

          // Gọi API để lấy thông tin người dùng
          const fetchUser = async () => {
            try {
              const response = await axios.get(
                `http://localhost:8000/users/${userId}`
              );
              console.log("User data:", response.data);

              setName(response.data.name);
              setRole(response.data.role);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          };

          fetchUser();
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
  }, []);

  const handleClick = (path: string) => {
    setSpinning(true);
    setTimeout(() => {
      router.push(path);
      setSpinning(false);
    }, 1000); // Simulate a delay for loading
  };

  const handleLoginClick = () => {
    setSpinning(true);
    setTimeout(() => {
      router.push("/signin");
      setSpinning(false);
    }, 1000); // Simulate a delay for loading
  };

  const handleLogoutClick = () => {
    setSpinning(true);
    setTimeout(() => {
      dispatch(logout());
      router.push("/signin");
      setSpinning(false);
    }, 1000); // Simulate a delay for loading
  };

  const handleAdminClick = () => {
    setSpinning(true);
    setTimeout(() => {
      router.push("/admin");
      setSpinning(false);
    }, 1000); // Simulate a delay for loading
  };

  const handleShelterStaffClick = () => {
    setSpinning(true);
    setTimeout(() => {
      router.push("/shelter-staff");
      setSpinning(false);
    }, 1000); // Simulate a delay for loading
  };

  if (!hasHydrated) {
    return null;
  }

  return (
    <Spin spinning={spinning} size="large">
      <div className="fixed z-50 w-full">
        <div
          className={`h-[42px] bg-[#FFCC00] flex items-center justify-between fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out animate__animated ${
            showTopBar ? "animate__fadeInDown" : "animate__fadeOutUp"
          }`}
        >
          <ul className="flex gap-4 sm:gap-10 pl-4 sm:pl-96 items-center">
            <li className="flex items-center gap-2 group">
              <Image src="/images/location.png" alt="" width={30} height={30} />
              <div className="text-white group-hover:text-black transition duration-300">
                SaiGon-VietNam
              </div>
            </li>
            <li className="flex items-center gap-2 group">
              <Image src="/images/mail.png" alt="" width={30} height={30} />
              <div className="text-white group-hover:text-black transition duration-300">
                trilhmse173578@fpt.edu.vn
              </div>
            </li>
            <li className="flex items-center gap-2 group">
              <Image
                src="/images/telephone.png"
                alt=""
                width={30}
                height={30}
              />
              <div className="text-white group-hover:text-black transition duration-300">
                (84+)5835484
              </div>
            </li>
          </ul>
          <ul className="flex gap-4 sm:gap-10 pr-4 sm:pr-60 items-center">
            <li>
              <Image src="/images/search.png" alt="" width={30} height={30} />
            </li>
            <li>
              <Image src="/images/vietnam.png" alt="" width={30} height={30} />
            </li>
            <li className="animate__animated animate__fadeInRight">
              Hi {name ? name : "Guest"} ❤️
            </li>
            <li>
              <button
                onClick={token ? handleLogoutClick : handleLoginClick}
                className="rounded-md border border-black px-4 text-white bg-[#D94E66] hover:bg-white hover:text-[#D94E66] transition duration-300 animate__animated animate__fadeInRight"
              >
                {token ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </div>

        <div
          className={`h-[106px] bg-[#F4F4F4] flex items-center justify-center fixed top-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out animate__animated ${
            showTopBar ? "animate__fadeInDown mt-[42px]" : ""
          }`}
        >
          <ul className="flex flex-wrap gap-4 sm:gap-[60px] items-center justify-center">
            <li>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={106}
                height={106}
                className="animate__animated animate__bounceIn"
              />
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={() => handleClick("/")}
            >
              HOMEPAGE
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/adopt"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={() => handleClick("/adopt")}
            >
              ADOPT
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/donate"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={() => handleClick("/donate")}
            >
              DONATE
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/volunteer"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={() => handleClick("/volunteer")}
            >
              VOLUNTEER
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/news"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={() => handleClick("/news")}
            >
              NEWS
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/contact"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={() => handleClick("/contact")}
            >
              CONTACT
            </li>
            <li
              className={`cursor-pointer animate__animated animate__fadeInLeft ${
                pathname === "/admin"
                  ? "text-[#D94E66]"
                  : "text-black hover:text-[#D94E66]"
              }`}
              onClick={
                role === "ADMIN"
                  ? handleAdminClick
                  : role === "SHELTER_STAFF"
                  ? handleShelterStaffClick
                  : undefined
              }
            >
              {role === "ADMIN" && "ADMIN DASHBOARD"}
              {role === "SHELTER_STAFF" && "SHELTERSTAFF DASHBOARD"}
            </li>
            {role === "ADMIN" && (
              <li
                className={`cursor-pointer animate__animated animate__fadeInLeft ${
                  pathname === "/user"
                    ? "text-[#D94E66]"
                    : "text-black hover:text-[#D94E66]"
                }`}
                onClick={() => handleClick("/user")}
              >
                USER
              </li>
            )}
          </ul>
        </div>
      </div>
    </Spin>
  );
};

export default Header;
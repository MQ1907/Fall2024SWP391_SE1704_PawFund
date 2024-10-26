"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  address: string;
}

const UserProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const userId = decodedToken.id;

          const response = await axios.get(
            `http://localhost:8000/users/${userId}`
          );
          setUserData(response.data);
          setEditedData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.id;

      console.log(
        "Sending request to:",
        `http://localhost:8000/users/${userId}`
      );
      console.log("Data being sent:", editedData);

      // Gửi request PUT để cập nhật dữ liệu trong backend
      const response = await axios.put(
        `http://localhost:8000/users/${userId}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Kiểm tra response từ server
      if (response.status === 200) {
        // Cập nhật state với dữ liệu mới
        setUserData(response.data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error updating user data:",
          error.response?.data || error.message
        );
        alert(
          `Failed to update profile. Error: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        console.error("Error updating user data:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-36">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
          <img
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white"
            src={userData.avatar || "/images/unknownUser.jpg"}
            alt="Profile Picture"
            width={128}
            height={128}
          />
        </div>
        <div className="pt-16 pb-8 px-6 text-center bg-white shadow-lg rounded-lg">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={editedData?.name || ""}
                onChange={handleChange}
                placeholder="Full Name"
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              />
              <input
                type="email"
                name="email"
                value={editedData?.email || ""}
                onChange={handleChange}
                placeholder="Email Address"
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              />
              <input
                type="tel"
                name="phone"
                value={editedData?.phone || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              />
              <input
                type="text"
                name="address"
                value={editedData?.address || ""}
                onChange={handleChange}
                placeholder="Address"
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              />
              <input
                type="text"
                name="avatar"
                value={editedData?.avatar || ""}
                onChange={handleChange}
                placeholder="Avatar URL"
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              />
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-300 mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                {userData.name}
              </h1>
              <p className="text-gray-600 mt-2">{userData.email}</p>
              <p className="text-gray-600 mt-2">{userData.phone}</p>
              <p className="text-gray-600 mt-2">{userData.address}</p>
              <p className="text-gray-600 mt-2">
                Role:{" "}
                <span className="font-semibold text-gray-800">
                  {userData.role}
                </span>
              </p>
              {!isEditing && (
                <div className="flex justify-end p-6  border-gray-200">
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

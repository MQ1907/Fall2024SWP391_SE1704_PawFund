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

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

const UserProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!editedData) return false;
    
    if (!editedData.name.trim()) newErrors.name = "Name is required";
    else if (editedData.name.length < 2) newErrors.name = "Name must be at least 2 characters long";
    
    if (!editedData.email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedData.email)) newErrors.email = "Invalid email format";
    }
    
    if (editedData.phone && !/^\d{10,}$/.test(editedData.phone)) newErrors.phone = "Phone number must have at least 10 digits";
    
    if (editedData.avatar && !editedData.avatar.startsWith('http')) newErrors.avatar = "Avatar URL must start with http";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!editedData) return;

    if (!validateForm()) {
      return;
    }

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

      if (response.status === 200) {
        
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
    // Clear the error for this field when the user starts typing
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-36 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Public profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img
              className="w-32 h-32 rounded-full"
              src={userData.avatar || "/images/unknownUser.jpg"}
              alt="Profile Picture"
            />
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="space-y-4">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedData?.name || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editedData?.email || ""}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={editedData?.phone || ""}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={editedData?.address || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={editedData?.role || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input
                type="text"
                name="avatar"
                value={editedData?.avatar || ""}
                onChange={handleChange}
                placeholder="Enter image URL"
                className={`w-full p-2 border ${errors.avatar ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E1B3A] text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{userData.name}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{userData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{userData.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="text-gray-900">{userData.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900">{userData.role}</p>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-[#1E1B3A] text-white rounded-md"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

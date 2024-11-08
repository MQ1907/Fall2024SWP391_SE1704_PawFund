"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ImageUploader from '../components/uploadImage/page';

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
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10 max-w-3xl">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Public Profile</h2>
      <div className="bg-white shadow-xl rounded-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <img
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 shadow-lg"
              src={userData.avatar || "/images/unknownUser.jpg"}
              alt="Profile Picture"
            />
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedData?.name || ""}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedData?.email || ""}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedData?.phone || ""}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editedData?.address || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={editedData?.role || ""}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col ">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar</label>
              <ImageUploader 
                name="avatar" 
                value={editedData?.avatar} 
                onChange={handleChange}
              />
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E1B3A] text-white rounded-lg hover:bg-[#2a2751] transition duration-200"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userData.email}</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userData.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userData.address}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userData.role}</p>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                onClick={handleEdit}
                className="px-6 py-2.5 bg-[#1E1B3A] text-white rounded-lg hover:bg-[#2a2751] transition duration-200"
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

"use client"
import React, { useEffect, useState } from 'react';
import { Table, Avatar } from 'antd';
import axios from 'axios';
import { fetchAllFeedback } from '../../lib/features/feedback/feedbackSlice'; // Adjust the import path as necessary

import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { RootState } from '@/lib/store';
import {
   
    StarOutlined,
  } from "@ant-design/icons";
const FeedBack = () => {
  const dispatch = useAppDispatch();
  const feedback = useAppSelector((state: RootState) => state.feedback.feedback);
  const feedbackStatus = useAppSelector((state: RootState) => state.feedback.status);

  const [userData, setUserData] = useState<{ [key: string]: { name: string; avatar: string } }>({});
  const [petData, setPetData] = useState<{ [key: string]: { name: string; image: string } }>({});

  useEffect(() => {
    dispatch(fetchAllFeedback());
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async (userId: string) => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${userId}`);
        console.log("User data:", response.data);

        setUserData((prevData) => ({
          ...prevData,
          [userId]: {
            name: response.data.name,
            avatar: response.data.avatar,
          },
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchPet = async (petId: string) => {
      try {
        const response = await axios.get(`http://localhost:8000/pet/find-by-id/${petId}`);
        console.log("Pet data:", response.data);

        setPetData((prevData) => ({
          ...prevData,
          [petId]: {
            name: response.data.name,
            image: response.data.image,
          },
        }));
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    if (feedback && Array.isArray(feedback)) {
      feedback.forEach((item) => {
        if (item.userId && !userData[item.userId]) {
          fetchUser(item.userId);
        }
        if (item.petId && !petData[item.petId]) {
          fetchPet(item.petId);
        }
      });
    }
  }, [feedback, userData, petData]);

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => {
        const user = userData[userId];
        return user ? user.name : 'Loading...';
      },
    },
    {
      title: 'Avatar',
      dataIndex: 'userId',
      key: 'avatar',
      render: (userId: string) => {
        const user = userData[userId];
        return user && user.avatar ? <Avatar src={user.avatar} /> : 'Loading...';
      },
    },
    {
      title: 'Pet Name',
      dataIndex: 'petId',
      key: 'petName',
      render: (petId: string) => {
        const pet = petData[petId];
        return pet ? pet.name : 'Loading...';
      },
    },
    {
      title: 'Pet Image',
      dataIndex: 'petId',
      key: 'petImage',
      render: (petId: string) => {
        const pet = petData[petId];
        return pet && pet.image ? <Avatar src={pet.image} /> : 'Loading...';
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span className="font-semibold text-sm">
          {Array.from({ length: rating }, (_, index) => (
            <StarOutlined key={index} style={{ color: "#FFCC00" }} />
          ))}
        </span>
      ),
    },
    {
      title: 'Feedback At',
      dataIndex: 'feedbackAt',
      key: 'feedbackAt',
      render: (text: string) => (
        <span className="font-semibold text-sm">
          {new Date(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
  ];

  return (
    <div>
      
      {feedbackStatus === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <Table dataSource={feedback} columns={columns} rowKey="_id" />
      )}
    </div>
  );
};

export default FeedBack;
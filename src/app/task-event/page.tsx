'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hook'; 
import { fetchSupportedEvents } from '../../lib/features/event/eventSlice'; 
import { jwtDecode } from 'jwt-decode';
import { Image, Layout, Menu, Table, Tag } from "antd";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const ViewSupportedEvent: React.FC = () => {
  const { Header, Sider, Content } = Layout;
  const dispatch = useAppDispatch();
  const [supporterId, setSupporterId] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>('2'); // Default selected key for event view

  const events = useAppSelector((state) => state.events.supportedEvents);
  const loading = useAppSelector((state) => state.events.status === "loading");
  const error = useAppSelector((state) => state.events.error);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setSupporterId(decodedToken.id);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (supporterId) {
      dispatch(fetchSupportedEvents(supporterId));
    }
  }, [dispatch, supporterId]);

  const columns = [
     {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (text: string) => (
        <Image
          width={200}
          height={200}
          className="rounded-sm shadow-2xl"
          src={text}
          alt="Image"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Start',
      dataIndex: 'start',
      key: 'start',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'End',
      dataIndex: 'end',
      key: 'end',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'eventStatus',
      key: 'eventStatus',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Failed to load events: {error}</p>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
  
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          {selectedKey === "2" ? (
            <Table columns={columns} dataSource={events} rowKey="_id" />
          ) : (
            <p>No events to see</p>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ViewSupportedEvent;

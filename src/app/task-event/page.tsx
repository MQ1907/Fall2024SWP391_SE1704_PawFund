'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchUserList } from '@/lib/features/user/userSlice';
import axios from 'axios';

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  start: Date;
  end: Date;
  location: string;
  eventStatus: 'SCHEDULED' | 'ON_GOING' | 'COMPLETED' | 'CANCELLED';
  supporters: string[];
}

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await axios.put(`http://localhost:8000/event/update-status/${event._id}`, {
        eventStatus: newStatus
      });
      alert('Status updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
          <img 
            src={event.image || "https://via.placeholder.com/150"} 
            alt={event.title} 
            className="w-full h-64 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150";
            }}
          />
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Start: {new Date(event.start).toLocaleString()}</span>
            <span>End: {new Date(event.end).toLocaleString()}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Location: </span>
            <span className="text-gray-600">{event.location}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Current Status: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              event.eventStatus === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
              event.eventStatus === 'ON_GOING' ? 'bg-green-100 text-green-800' :
              event.eventStatus === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {event.eventStatus}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateStatus('SCHEDULED')}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              disabled={event.eventStatus === 'SCHEDULED'}
            >
              Set Scheduled
            </button>
            <button
              onClick={() => handleUpdateStatus('ON_GOING')}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={event.eventStatus === 'ON_GOING'}
            >
              Set Ongoing
            </button>
            <button
              onClick={() => handleUpdateStatus('COMPLETED')}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={event.eventStatus === 'COMPLETED'}
            >
              Set Completed
            </button>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EventRow = ({ event, onView }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-4 px-6">
      <img 
        src={event.image || "https://via.placeholder.com/150"} 
        alt={event.title} 
        className="w-12 h-12 object-cover rounded-full"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/150";
        }}
      />
    </td>
    <td className="py-4 px-6">
      <div className="font-medium text-gray-900">{event.title}</div>
      <div className="text-sm text-gray-500">{event.location}</div>
    </td>
    <td className="py-4 px-6">{new Date(event.start).toLocaleDateString()}</td>
    <td className="py-4 px-6">{new Date(event.end).toLocaleDateString()}</td>
    <td className="py-4 px-6">
      <span className={`px-2 py-1 rounded text-sm ${
        event.eventStatus === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
        event.eventStatus === 'ON_GOING' ? 'bg-green-100 text-green-800' :
        event.eventStatus === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
        'bg-red-100 text-red-800'
      }`}>
        {event.eventStatus}
      </span>
    </td>
    <td className="py-4 px-6">
      <button 
        onClick={() => onView(event)} 
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        View & Update
      </button>
    </td>
  </tr>
);

const Page = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/event/view-event-supported/${currentUser._id}`);
      if (response.data) {
        setEvents(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 404) {
        setEvents([]);
      } else {
        setError(error.response?.data?.message || 'Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchEvents();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Task Events</h1>
      
      {error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          You haven't been assigned to any events yet
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-6">Image</th>
                  <th className="py-3 px-6">Event</th>
                  <th className="py-3 px-6">Start Date</th>
                  <th className="py-3 px-6">End Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {events.map((event) => (
                  <EventRow key={event._id} event={event} onView={setSelectedEvent} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => {
            setSelectedEvent(null);
            fetchEvents(); // Refresh data sau khi update
          }} 
        />
      )}
    </div>
  );
};

export default Page;

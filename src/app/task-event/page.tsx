'use client';

import React, { useState } from 'react'

const EventModal = ({ event, onClose }) => {
  if (!event) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
          <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Start: {new Date(event.startDate).toLocaleString()}</span>
            <span>End: {new Date(event.endDate).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const EventRow = ({ event, onView }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-4 px-6"><img src={event.image} alt={event.title} className="w-12 h-12 object-cover rounded-full" /></td>
    <td className="py-4 px-6">
      <div className="font-medium text-gray-900">{event.title}</div>
    </td>
    <td className="py-4 px-6">{new Date(event.startDate).toLocaleDateString()}</td>
    <td className="py-4 px-6">{new Date(event.endDate).toLocaleDateString()}</td>
    <td className="py-4 px-6">
      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Update Status</button>
    </td>
    <td className="py-4 px-6">
      <button onClick={() => onView(event)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">View</button>
    </td>
  </tr>
)

const Page = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)

  const events = [
    { 
      image: '/path/to/event1.jpg', 
      title: 'Summer Festival', 
      description: 'An annual music event featuring top artists from around the world.',
      startDate: '2024-07-01T00:00:00Z', 
      endDate: '2024-07-03T23:59:59Z' 
    },
    { 
      image: '/path/to/event2.jpg', 
      title: 'Tech Conference', 
      description: 'A gathering of industry leaders to discuss the latest innovations in technology.',
      startDate: '2024-09-15T00:00:00Z', 
      endDate: '2024-09-17T23:59:59Z' 
    },

  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-6">Image</th>
                <th className="py-3 px-6">Event</th>
                <th className="py-3 px-6">Start Date</th>
                <th className="py-3 px-6">End Date</th>
                <th className="py-3 px-6">Update Status</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {events.map((event, index) => (
                <EventRow key={index} event={event} onView={setSelectedEvent} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="px-3 py-1 border rounded bg-blue-100 text-blue-800 text-sm">1</button>
        <button className="px-3 py-1 border rounded ml-2 text-sm">&gt;</button>
      </div>
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}

export default Page

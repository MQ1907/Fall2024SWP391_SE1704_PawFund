'use client'

import React, { useState } from 'react'

const CreateEventPage = () => {
  const [location, setLocation] = useState("Store Kongensgade 66, 1264 København K, Denmark");
  const [description, setDescription] = useState("");

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Create event</h1>
        <button className="text-gray-600 hover:text-gray-800">Cancel</button>
      </div>
      <div className="flex gap-8">
        <div className="flex-grow">
          <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">TITLE</h2>
            <input type="text" className="w-full p-3 border rounded text-lg" defaultValue="Hikoot app concept development" />
            

            <div className="mt-8 grid grid-cols-4 gap-6">
              <div>
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">DAY</h2>
                <input type="date" className="w-full p-3 border rounded" defaultValue="2017-11-13" />
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">HOUR</h2>
                <input type="time" className="w-full p-3 border rounded" defaultValue="10:00" />
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">MINUTE</h2>
                <input type="number" className="w-full p-3 border rounded" min="0" max="59" defaultValue="15" />
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">DURATION</h2>
                <select className="w-full p-3 border rounded">
                  <option>2h 45m</option>
                </select>
              </div>
            </div>

            <p className="text-green-600 mt-3 text-sm">This event will take place on the 13th of November 2017 from 10:15am until 1:00pm</p>

            <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">DESCRIPTION</h2>
            <textarea
              className="w-full p-3 border rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description..."
            />

            <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">LOCATION</h2>
            <div className="flex gap-4">
              <div className="flex-grow">
                <input 
                  type="text" 
                  className="w-full p-3 border rounded" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">UPLOAD IMAGES</h2>
            <div className="border-2 border-dashed rounded-lg p-8 mt-3 text-center text-gray-400">
              <p>You can also drop your files here</p>
            </div>
          </div>
        </div>

        <div className="w-80">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">ADD TEAM MEMBERS</h2>
            <div className="flex gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-300"></div>
              <div className="w-10 h-10 rounded-full bg-blue-300"></div>
              <div className="w-10 h-10 rounded-full bg-yellow-300"></div>
              <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-gray-300">+</button>
            </div>

            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">ADD GUESTS</h2>
            <div className="flex mb-6">
              <input type="email" className="flex-grow p-3 border rounded-l" placeholder="Email invitation" />
              <button className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">Send</button>
            </div>

            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">SET REMINDER</h2>
            <select className="w-full p-3 border rounded mb-6">
              <option>2 hours before event</option>
            </select>

            <button className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300">Create event</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEventPage

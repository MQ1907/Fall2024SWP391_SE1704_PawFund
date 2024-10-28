'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchUserList } from '@/lib/features/user/userSlice';
import { createEvent } from '@/lib/features/event/eventSlice';

interface Volunteer {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}

const CreateEventPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userList, status, error } = useSelector((state: RootState) => state.user);
  const { status: eventStatus } = useSelector((state: RootState) => state.events);
  
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState("");
  const [selectedVolunteers, setSelectedVolunteers] = useState<Volunteer[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchUserList());

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  const volunteers = userList.filter(user => user.role === 'VOLUNTEER');

  const addVolunteer = (volunteer: Volunteer) => {
    if (!selectedVolunteers.find(v => v._id === volunteer._id)) {
      setSelectedVolunteers([...selectedVolunteers, volunteer]);
    }
    setIsDropdownOpen(false);
  };

  const removeVolunteer = (volunteerId: string) => {
    setSelectedVolunteers(selectedVolunteers.filter(v => v._id !== volunteerId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title,
      description,
      image,
      start: new Date(startDate),
      end: new Date(endDate),
      location,
      supporters: selectedVolunteers.map(v => v._id) // Changed from volunteers to supporters
    };

    console.log('Submitting event with data:', eventData);

    try {
      await dispatch(createEvent(eventData)).unwrap();
      alert('Event created successfully!');
      // Optional: Add redirect or form reset here
    } catch (error) {
      console.error('Create event error:', error);
      alert('Failed to create event');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    setImage(imageUrl);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Create event</h1>
        <button className="text-gray-600 hover:text-gray-800">Cancel</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-8">
          <div className="flex-grow">
            <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
              <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">TITLE</h2>
              <input 
                type="text" 
                className="w-full p-3 border rounded text-lg" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">START DATE</h2>
                  <input 
                    type="datetime-local" 
                    className="w-full p-3 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">END DATE</h2>
                  <input 
                    type="datetime-local" 
                    className="w-full p-3 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <p className="text-green-600 mt-3 text-sm">
                {startDate && endDate && `This event will take place from ${new Date(startDate).toLocaleString()} until ${new Date(endDate).toLocaleString()}`}
              </p>

              <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">DESCRIPTION</h2>
              <textarea
                className="w-full p-3 border rounded"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description..."
                required
              />

              <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">LOCATION</h2>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {image && (
                  <div className="mt-2">
                    <img 
                      src={image} 
                      alt="Event preview" 
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/default-image.png'; 
                      }}
                    />
                  </div>
                )}
              </div>

              {/* <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">ADD TEAM MEMBERS</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedVolunteers.map(volunteer => (
                    <div key={volunteer._id} className="relative">
                      <img src={volunteer.avatar} alt={volunteer.name} className="w-10 h-10 rounded-full" />
                      <button 
                        type="button"
                        onClick={() => removeVolunteer(volunteer._id)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      type="button"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-gray-300"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      +
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                        {status === 'loading' && <p className="p-2">Loading...</p>}
                        {status === 'failed' && <p className="p-2 text-red-500">{error}</p>}
                        {status === 'succeeded' && volunteers.map(volunteer => (
                          <button
                            type="button"
                            key={volunteer._id}
                            onClick={() => addVolunteer(volunteer)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <img src={volunteer.avatar || '/default-avatar.png'} alt={volunteer.name} className="w-8 h-8 rounded-full mr-2" />
                              <div>
                                <div>{volunteer.name}</div>
                                <div className="text-xs text-gray-500">{volunteer.email}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={eventStatus === 'loading'}
                  className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                >
                  {eventStatus === 'loading' ? 'Creating...' : 'Create event'}
                </button>
              </div> */}
            </div>
          </div>

          <div className="w-80">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">ADD TEAM MEMBERS</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedVolunteers.map(volunteer => (
                  <div key={volunteer._id} className="relative">
                    <img src={volunteer.avatar} alt={volunteer.name} className="w-10 h-10 rounded-full" />
                    <button 
                      type="button"
                      onClick={() => removeVolunteer(volunteer._id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-gray-300"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    +
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                      {status === 'loading' && <p className="p-2">Loading...</p>}
                      {status === 'failed' && <p className="p-2 text-red-500">{error}</p>}
                      {status === 'succeeded' && volunteers.map(volunteer => (
                        <button
                          type="button"
                          key={volunteer._id}
                          onClick={() => addVolunteer(volunteer)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <img src={volunteer.avatar || '/default-avatar.png'} alt={volunteer.name} className="w-8 h-8 rounded-full mr-2" />
                            <div>
                              <div>{volunteer.name}</div>
                              <div className="text-xs text-gray-500">{volunteer.email}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={eventStatus === 'loading'}
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
              >
                {eventStatus === 'loading' ? 'Creating...' : 'Create event'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateEventPage

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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setImage("");
    setSelectedVolunteers([]);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Validate title
    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    // Validate dates
    if (startDateTime < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    if (endDateTime < startDateTime) {
      newErrors.endDate = 'End date must be after or equal to start date';
    }

    // Validate minimum time difference (30 minutes)
    const timeDifferenceInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    if (timeDifferenceInMinutes < 30) {
      newErrors.endDate = 'End time must be at least 30 minutes after start time';
    }

    // Validate location
    if (location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters long';
    }

    // Validate description
    if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    // Validate image URL (optional)
    if (image && !isValidUrl(image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      image,
      start: new Date(startDate),
      end: new Date(endDate),
      location: location.trim(),
      supporters: selectedVolunteers.map(v => v._id)
    };

    try {
      await dispatch(createEvent(eventData)).unwrap();
      alert('Event created successfully!');
      resetForm();
      setErrors({});
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
                className={`w-full p-3 border rounded text-lg ${errors.title ? 'border-red-500' : ''}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">START DATE</h2>
                  <input 
                    type="date" 
                    className={`w-full p-3 border rounded ${errors.startDate ? 'border-red-500' : ''}`}
                    value={startDate.split('T')[0]}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">END DATE</h2>
                  <input 
                    type="date" 
                    className={`w-full p-3 border rounded ${errors.endDate ? 'border-red-500' : ''}`}
                    value={endDate.split('T')[0]}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <p className="text-green-600 mt-3 text-sm">
                {startDate && endDate && `This event will take place from ${new Date(startDate).toLocaleDateString()} until ${new Date(endDate).toLocaleDateString()}`}
              </p>

              <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">DESCRIPTION</h2>
              <textarea
                className={`w-full p-3 border rounded ${errors.description ? 'border-red-500' : ''}`}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description..."
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

              <h2 className="text-sm font-semibold uppercase text-gray-500 mt-8 mb-2">LOCATION</h2>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    className={`w-full p-3 border rounded ${errors.location ? 'border-red-500' : ''}`}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.image ? 'border-red-500' : ''}`}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
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

'use client';

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchEvents, deleteEvent, updateEvent } from '@/lib/features/event/eventSlice';
import { fetchUserList } from '@/lib/features/user/userSlice';
import ImageUploader from '../components/uploadImage/page';

interface Volunteer {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}


const EventModal = ({ event, onClose }) => {
  if (!event) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">{event.title}</h2>
          <img src={event.image} alt={event.title} className="w-full h-72 object-cover rounded-lg mb-6 shadow-md" />
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Start: {new Date(event.startDate).toLocaleString()}</span>
            <span>End: {new Date(event.endDate).toLocaleString()}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Supporters</h3>
            <div className="flex flex-wrap gap-2">
              {event.supporters && event.supporters.map((supporter) => (
                <div key={supporter._id} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                  <img
                    src={supporter.avatar }
                    alt={supporter.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{supporter.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const EventRow = ({ event, onView, onUpdate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.events);
  const { userList } = useSelector((state: RootState) => state.user);

  // Helper function to get volunteer info from supporter ID
  const getVolunteerInfo = (supporterId: string) => {
    return userList.find(user => user._id === supporterId);
  };

  // Kiểm tra nếu userList chưa được tải, dispatch fetchUserList
  useEffect(() => {
    if (userList.length === 0) {
      dispatch(fetchUserList());
    }
  }, [dispatch, userList.length]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        await dispatch(deleteEvent(event._id)).unwrap();
        alert('Event canceld successfully!');
      } catch (error: any) {
        console.error('Canceld event error:', error);
        alert(error.message || 'Failed to cancel event');
      }
    }
  };

  return (
    <tr className="border-b hover:bg-gray-100 transition">
      <td className="py-4 px-6">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-12 h-12 object-cover rounded-full border border-gray-200 shadow-sm"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150'; 
          }}
        />
      </td>
      <td className="py-4 px-6">
        <div className="font-medium text-gray-900">{event.title}</div>
      </td>
      <td className="py-4 px-6">{new Date(event.start).toLocaleDateString()}</td>
      <td className="py-4 px-6">{new Date(event.end).toLocaleDateString()}</td>
      <td className="py-4 px-6">
        <div className="flex -space-x-2">
          {event.supporters && Array.isArray(event.supporters) && event.supporters.length > 0 ? (
            event.supporters.map((supporterId: string) => {
              const volunteerInfo = getVolunteerInfo(supporterId);
              if (!volunteerInfo) return null;

              return (
                <div key={supporterId} className="relative">
                  <img
                    src={volunteerInfo.avatar || "https://via.placeholder.com/150"}
                    alt={volunteerInfo.name}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    title={volunteerInfo.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm">No supporters</span>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => onUpdate(event)}
            disabled={status === 'loading'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow transition-colors duration-200 disabled:bg-gray-400"
          >
            {status === 'loading' ? 'Updating...' : 'Update'}
          </button>
          <button 
            onClick={handleDelete}
            disabled={status === 'loading'}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow transition-colors duration-200 disabled:bg-gray-400"
          >
            {status === 'loading' ? 'Deleting...' : 'Cancel'}
          </button>
        </div>
      </td>
    </tr>
  );
};

const UpdateEventModal = ({ event, onClose, onUpdate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userList, status: userStatus } = useSelector((state: RootState) => state.user);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [startDate, setStartDate] = useState(new Date(event.start).toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date(event.end).toISOString().slice(0, 16));
  const [image, setImage] = useState(event.image);
  const [selectedVolunteers, setSelectedVolunteers] = useState(() => {
    if (!Array.isArray(event.supporters)) return [];
    
    return event.supporters
      .map(supporterId => userList.find(user => user._id === supporterId))
      .filter(volunteer => volunteer !== undefined); // Remove any undefined values
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [eventStatus, setEventStatus] = useState(event.eventStatus);

  useEffect(() => {
    console.log('Selected Volunteers:', selectedVolunteers);
    console.log('Event Supporters:', event.supporters);
    console.log('User List:', userList);
  }, [selectedVolunteers, event.supporters, userList]);

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

  const addVolunteer = (volunteer: any) => {
    if (!selectedVolunteers.find(v => v._id === volunteer._id)) {
      setSelectedVolunteers([...selectedVolunteers, volunteer]);
    }
    setIsDropdownOpen(false);
  };

  const removeVolunteer = (volunteerId: string) => {
    setSelectedVolunteers(selectedVolunteers.filter(v => v._id !== volunteerId));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Validate title
    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    // Chỉ validate end date phải >= start date
    if (endDateTime < startDateTime) {
      newErrors.endDate = 'End date must be after or equal to start date';
    }

    // Validate location
    if (location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters long';
    }

    // Validate description
    if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    // Validate image URL
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

    const updateEventDto = {
      title: title.trim(),
      description: description.trim(),
      image,
      start: new Date(startDate),
      end: new Date(endDate),
      location: location.trim(),
      supporters: selectedVolunteers.map(v => v._id || v),
      eventStatus
    };

    try {
      await dispatch(updateEvent({ 
        id: event._id, 
        updateEventDto 
      })).unwrap();
      alert('Event updated successfully!');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Update event error:', error);
      alert(error.message || 'Failed to update event');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Update Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Event Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Status</label>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ON_GOING">ON GOING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate.split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Ngăn chọn ngày trong quá khứ
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate.split('T')[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate.split('T')[0]} // Đảm bảo end date không thể chọn trước start date
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-500' : ''}`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <ImageUploader 
                name="image" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Volunteers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedVolunteers.map(volunteer => (
                  <div key={volunteer._id} className="relative">
                    <img 
                      src={volunteer.avatar || '/default-avatar.png'} 
                      alt={volunteer.name} 
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => removeVolunteer(volunteer._id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* Dropdown container */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-gray-300"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    +
                  </button>
                  {isDropdownOpen && (
                    <div 
                      className="absolute bottom-full left-0 mb-2 w-64 bg-white border rounded-lg shadow-lg z-50" 
                      style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        bottom: '100%'  
                      }}
                    >
                      {userStatus === 'loading' && <p className="p-2">Loading...</p>}
                      {userStatus === 'failed' && <p className="p-2 text-red-500">Failed to load volunteers</p>}
                      {userStatus === 'succeeded' && volunteers
                        .filter(v => !selectedVolunteers.find(sv => sv._id === v._id))
                        .map(volunteer => (
                          <button
                            type="button"
                            key={volunteer._id}
                            onClick={() => addVolunteer(volunteer)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                          >
                            <div className="flex items-center">
                              <img 
                                src={volunteer.avatar || "https://via.placeholder.com/150"} 
                                alt={volunteer.name} 
                                className="w-8 h-8 rounded-full mr-2"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/150";
                                }}
                              />
                              <div>
                                <div className="font-medium">{volunteer.name}</div>
                                <div className="text-xs text-gray-500">{volunteer.email}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events } = useSelector((state: RootState) => state.events);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToUpdate, setEventToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 7;

  useEffect(() => {
    dispatch(fetchEvents());
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, [dispatch]);

  useEffect(() => {
    setSearchResults(events);
  }, [events]);


  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = searchResults.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(searchResults.length / eventsPerPage);


  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(events);
      setShowHistory(false);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
    
    const newHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setShowHistory(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectHistory = (term: string) => {
    setSearchTerm(term);
    setShowHistory(false);
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowHistory(true);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowHistory(true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400 hover:text-blue-500"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {showHistory && searchHistory.length > 0 && (
            <div 
              className="absolute z-10 w-full bg-white mt-2 rounded-lg shadow-lg border border-gray-200"
              onMouseDown={(e) => e.preventDefault()}
            >
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleSelectHistory(term)}
                >
                  <svg 
                    className="h-4 w-4 mr-2 text-gray-400" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {term}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {searchResults.length === 0 ? (
        <div className="text-center text-gray-600">No events found</div>
      ) : (
        <>
          <table className="w-full text-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left text-xs font-semibold uppercase text-gray-700 tracking-wider">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Event</th>
                <th className="py-4 px-6">Start Date</th>
                <th className="py-4 px-6">End Date</th>
                <th className="py-4 px-6">Volunteers</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentEvents.map((event) => (
                <EventRow 
                  key={event._id} 
                  event={event} 
                  onView={setSelectedEvent}
                  onUpdate={setEventToUpdate}
                />
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end space-x-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded text-sm shadow-md transition
                ${currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
                }`}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 border rounded text-sm shadow-md transition
                  ${pageNum === currentPage 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded text-sm shadow-md transition
                ${currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
                }`}
            >
              &gt;
            </button>
          </div>
        </>
      )}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      
      {eventToUpdate && (
        <UpdateEventModal 
          event={eventToUpdate} 
          onClose={() => setEventToUpdate(null)}
          onUpdate={() => {
            setEventToUpdate(null);
            dispatch(fetchEvents());
          }}
        />
      )}
    </div>
  );
};

export default Page;

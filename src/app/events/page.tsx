'use client';

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchEvents } from '@/lib/features/event/eventSlice';


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
                    src={supporter.avatar || '/default-avatar.png'}
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

const EventRow = ({ event, onView }) => {
  const { status } = useSelector((state: RootState) => state.events);
  
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
          {event.supporters && event.supporters.length > 0 ? (
            event.supporters.map((supporter) => (
              <div key={supporter._id} className="relative">
                <img
                  src={supporter.avatar} 
                  alt={supporter.name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  title={supporter.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150'; 
                  }}
                />
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No supporters</span>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <button 
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow transition-colors duration-200"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events } = useSelector((state: RootState) => state.events);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default Page;

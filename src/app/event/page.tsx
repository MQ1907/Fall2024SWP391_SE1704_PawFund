"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchEvents } from '@/lib/features/event/eventSlice';

const Event = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { events, status } = useSelector((state: RootState) => state.events);
  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerPage = 3; 
  const [isAnimating] = useState(true);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(events.length - petsPerPage, 0) : prevIndex - petsPerPage
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + petsPerPage >= events.length ? 0 : prevIndex + petsPerPage
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
    };
  };

  const currentEvents = events.slice(currentIndex, currentIndex + petsPerPage);

  return (
    <div>
      <div className="h-[620px] bg-[#F6F6F7]">
        <div className={`flex flex-col items-center justify-center pt-10 gap-3 ${isAnimating ? 'animate__animated animate__fadeInLeft animate__delay-2s animate__duration-4s' : ''}`}>
          <div className="font-semibold text-3xl">Event</div>
          <Image src="/images/dogfoot.png" alt="" width={30} height={30} className="transform rotate-12" />
        </div>
        <div className="flex justify-center gap-14"> 
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : (
            currentEvents.map((event) => (
              <div 
                key={event._id} 
                className="overflow-hidden cursor-pointer" 
                onClick={() => {
                  if (event._id) {
                    console.log('Navigating to:', `/news/${event._id}`);
                    router.push(`/news/${event._id}`);
                  }
                }}
              >
                <div className={`bg-white w-80 h-auto rounded-lg shadow-md overflow-hidden relative ${isAnimating ? 'animate__animated animate__fadeInLeft animate__delay-2s animate__duration-4s' : ''}`}>
                  <div 
                    className="overflow-hidden" 
                    style={{ height: '200px' }}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full rounded-lg shadow-md object-cover"
                    />
                    <div className="absolute top-[180px] ml-5 left-0 text-white bg-[#D61C62] w-[40px] h-[20px] z-10 flex items-center justify-center">
                      {formatDate(event.start).day}
                    </div>
                    <div className="absolute top-[200px] ml-5 left-0 text-white bg-[#D61C62] w-[40px] h-[20px] z-10 flex items-center justify-center">
                      T{formatDate(event.start).month}
                    </div>
                  </div>
                  <div className='p-4'>
                    <h3 className="text-xl font-semibold mt-4">{event.title}</h3>
                    <p className="text-[#6F6F6F] mt-5 font-medium">
                      {new Date(event.start).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-[#6F6F6F] mt-5 font-medium">{event.location}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-5 space-x-2"> 
          <button
            onClick={handlePrevClick}
            className="bg-gray-300 p-3 rounded-full hover:bg-gray-400 disabled:opacity-50"
            disabled={currentIndex === 0}
          >
            &#9664; 
          </button>
          <button
            onClick={handleNextClick}
            className="bg-gray-300 p-3 rounded-full hover:bg-gray-400 disabled:opacity-50"
            disabled={currentIndex + petsPerPage >= events.length}
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Event;

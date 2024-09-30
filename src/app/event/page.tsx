import React, { useState } from 'react';
import Image from "next/image";

const Event = () => {
  const events = [
    {
      id: 1,
      title: 'Phiên chợ gây quỹ nhận nuôi Hanoi Pet Adoption',
      image: '/images/event.png',
      calender: "4/21/2024 10:15:00 AM",
      address: "102 Quang an, Tay Ho, Ha Noi",
    },
    {
      id: 2,
      title: 'Phiên chợ gây quỹ nhận nuôi Hanoi Pet Adoption',
      image: '/images/event.png',
      calender: "4/21/2024 10:15:00 AM",
      address: "102 Quang an, Tay Ho, Ha Noi",
    },
    {
      id: 3,
      title: 'Phiên chợ gây quỹ nhận nuôi Hanoi Pet Adoption',
      image: '/images/event.png',
      calender: "4/21/2024 10:15:00 AM",
      address: "102 Quang an, Tay Ho, Ha Noi",
    },
    {
      id: 4,
      title: 'Phiên chợ gây quỹ nhận nuôi Hanoi Pet Adoption',
      image: '/images/event.png',
      calender: "4/21/2024 10:15:00 AM",
      address: "102 Quang an, Tay Ho, Ha Noi",
    },
    {
      id: 5,
      title: 'Phiên chợ gây quỹ nhận nuôi Hanoi Pet Adoption',
      image: '/images/event.png',
      calender: "4/21/2024 10:15:00 AM",
      address: "102 Quang an, Tay Ho, Ha Noi",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerPage = 3; 

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

  const currentEvents = events.slice(currentIndex, currentIndex + petsPerPage);
  const [isAnimating] = useState(true);

  return (
    <div>
      <div className="h-[620px] bg-[#F6F6F7]">
        <div className={`flex flex-col items-center justify-center pt-10 gap-3 ${isAnimating ? 'animate__animated animate__fadeInLeft animate__delay-2s animate__duration-4s' : ''}`}>
          <div className="font-semibold text-3xl">Event</div>
          <Image src="/images/dogfoot.png" alt="" width={30} height={30} className="transform rotate-12" />
        </div>
        <div className="flex justify-center gap-14"> 
          {currentEvents.map((event) => (
            <div key={event.id} className={`bg-white w-80 h-auto rounded-lg shadow-md overflow-hidden relative ${isAnimating ? 'animate__animated animate__fadeInLeft animate__delay-2s animate__duration-4s' : ''}`}>
              <div className="overflow-hidden" style={{ height: '200px' }}>
                <Image
                  src={event.image}
                  alt={event.title}
                  width={320}
                  height={300}
                  className="rounded-lg shadow-md object-cover"
                />
                <div className="absolute top-[180px] ml-5 left-0 text-white bg-[#D61C62] w-[40px] h-[20px] z-10 flex items-center justify-center">23</div>
                <div className="absolute top-[200px] ml-5 left-0 text-white bg-[#D61C62] w-[40px] h-[20px] z-10 flex items-center justify-center">T9</div>
              </div>
              <div className='p-4'>
                <h3 className="text-xl font-semibold mt-4">{event.title}</h3>
                <p className="text-[#6F6F6F] mt-5 font-medium">{event.calender}</p>
                <p className="text-[#6F6F6F] mt-5 font-medium">{event.address}</p>
              </div>
            </div>
          ))}
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

'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter(); 

  const slides = [
    {
      img: "/images/crs.jpg",
      text: "DOGS NEED TO BE ADOPT",
      text1:
        "Hope you give the children a chance! Become a member of your family",
    },
    {
      img: "/images/csr2.jpg",
      text: "CATS ARE WAITING TO BE ADOPTED...",
      text1:
        "Hope you give the children a chance! Become a member of your family",
    },
    {
      img: "/images/crs3.jpg",
      text: "How TO SUPPORT AND HELP THE GROUP",
      text1:
        "Let's learn about ways to support PAWFUND Adoption's activities!",
    },
    {
      img: "/images/crs4.jpg",
      text: "LET'S ADOPT, DON'T BANISH !",
      text1:
        "Animals also have sentience and emotions, they also know pain, fear, love and want to be loved !",
    },
  ];

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 

    
    return () => clearInterval(interval);
  }, [currentIndex]); 

  
  const handleReadMore = () => {
    if (currentIndex === 2) {
      router.push("/donate"); 
    } else {
      router.push("/adopt"); 
    }
  };

  return (
    <div className="relative w-full h-[691px] overflow-hidden ">
      <div
        className="flex transition-transform ease-out duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-[691px] flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="absolute bottom-[500px] left-[200px] text-white text-2xl font-semibold">
              {slide.text}
            </div>
            <div className="absolute bottom-[470px] left-[200px] text-white text-lg font-normal">
              {slide.text1}
            </div>
            <button
              className="absolute bottom-[400px] left-[200px] text-white text-lg font-normal border border-none rounded-xl px-6 py-2 bg-[#D61C62] hover:bg-[#018AE0]"
              onClick={handleReadMore} 
            >
              READ MORE
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;

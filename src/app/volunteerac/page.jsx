"use client"; // Thêm chỉ thị này ở đầu file

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Volunteerac = () => {
  const router = useRouter();
  const petsData = [
    {
      id: 1,
      title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
      detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
      image: '/images/corgi.png',
    },
    {
        id: 2,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 3,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 4,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 5,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 6,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 7,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 8,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
      {
        id: 9,
        title: 'Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu',
        detail: 'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
        image: '/images/corgi.png',
      },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerPage = 4;

  const totalPages = Math.ceil(petsData.length / petsPerPage);
  const currentPage = Math.floor(currentIndex / petsPerPage) + 1;

  const goToPage = (page) => {
    setCurrentIndex((page - 1) * petsPerPage);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const currentPets = petsData.slice(currentIndex, currentIndex + petsPerPage);

  return (
    <div className='mt-[148px]'>
        <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/news.png')" }}
      >
        <div className="bg-black bg-opacity-20 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">News</h1>
            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">HomePage</a>
              <span className="mx-2">&gt;</span>
              <a href="/news">News</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-10 p-8 py-10">
        <div className="col-span-6 ml-[200px]">
          <div className="h-auto">
            <div className="bg-white relative">
              <div className="grid grid-cols-2 gap-y-5">
                {currentPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white w-80 h-[500px] rounded-lg shadow-md overflow-hidden relative "
                  >
                    <div className="overflow-hidden" style={{ height: '200px' }}>
                      <Image
                        src={pet.image}
                        alt={pet.title}
                        width={320}
                        height={300}
                        className="rounded-lg shadow-md object-cover"
                        onClick={() => router.push('/infnew')}
                      />
                      <div className="absolute top-[180px] ml-5 left-0 text-white bg-[#D61C62] w-[40px] h-[20px] z-10 flex items-center justify-center">23</div>
                      <div className="absolute top-[200px] ml-5 left-0 text-white bg-[#D61C62] w-[40px] h-[20px] z-10 flex items-center justify-center">T9</div>
                    </div>
                    <div className='p-4'>
                      <h3 className="text-xl font-semibold mt-4">{pet.title}</h3>
                      <p className="text-[#6F6F6F] mt-5 font-medium">{pet.detail}</p>
                      <div className="flex items-center mt-5 ml-6">
                        <p className="text-[#6F6F6F] font-medium">Posted by</p>
                        <p className='text-[#018AE0] ml-2'>Pawfund(English Only)</p>
                      </div>
                      <div className='flex justify-center'>
                        <button
                          onClick={() => router.push('/infnew')}
                          className="mt-4 bg-[#018AE0] text-white w-[172px] h-[44px] rounded hover:bg-[#F1CC63] transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-5 space-x-2">
                <button
                  onClick={handlePrevClick}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#D51C63] text-white'}`}
                >
                  &#9664;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-[#D51C63] text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={handleNextClick}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#D51C63] text-white'}`}
                >
                  &#9654;
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 ml-[200px]">
        <div className='h-auto bg-[#F6F6F6] w-60'>
            <h1 className='text-center mt-2 text-2xl font-bold'>Category</h1>
            <hr className='border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2' />
            
            {/* Button for Category */}
            <button
              className='bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded'
              onClick={() => router.push("/volunteerac")}
            >
              <p className='text-center text-black hover:text-white'>
                Volunteer activities
              </p>
            </button>

            {/* Video Section */}
            <h1 className='text-center mt-5 text-2xl font-bold'>Video about us</h1>
            <hr className='border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2' />
            <div className='ml-2'>
              <iframe
                width={220}
                height={200}
                src="https://www.youtube.com/embed/ZTw49Ww18UA"
                title="Laugh Till You Cry With These Funny Animal Videos! 🤣"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            
            {/* Footer Image */}
            <div className="h-[40px] relative">
              <Image
                src="/images/bgfooter.png"
                alt=""
                width={1440}
                height={117}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteerac;

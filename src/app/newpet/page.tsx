import React, { useState } from 'react';
import Image from 'next/image';

const Newpet = () => {
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerPage = 2;

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
    <div className="h-auto py-10">
      <div className="w-[90%] lg:w-[75%] mx-auto bg-white rounded-xl p-8 relative">
        <div className="flex justify-between items-center">
          <div className="flex justify-center gap-10 lg:gap-16">
            {currentPets.map((pet) => (
              <div key={pet.id} className="text-center w-[250px] lg:w-[280px] mx-auto">
                <Image
                  src={pet.image}
                  alt={pet.title}
                  width={250}
                  height={250}
                  className="rounded-lg shadow-md"
                />
                <h3 className="text-xl font-semibold mt-4">{pet.title}</h3>
                <p className="text-gray-700 font-medium">{pet.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center  mt-5 ml-14 space-x-2 ">
          <button
            onClick={handlePrevClick}
            className=""
            disabled={currentPage === 1}
          >
            &#9664;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? 'bg-[#D51C63] text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextClick}
            className=""
            disabled={currentPage === totalPages}
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newpet;

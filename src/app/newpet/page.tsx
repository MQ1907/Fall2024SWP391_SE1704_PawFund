import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Newpet = () => {
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
  const [isAnimating] = useState(true);

  return (
    <div className="h-auto">
      <div className=" bg-white relative">
        <div className=" grid grid-cols-2 gap-y-5"> 
          {currentPets.map((pet) => (
            <div
            key={pet.id}
            className="bg-white w-80 h-[500px] rounded-lg shadow-md overflow-hidden relative animate__animated animate__fadeInUp animate__delay-1s animate__duration-3s"
          >                  
              <div className="overflow-hidden" style={{ height: '200px' }}> 
                <Image
                  src={pet.image}
                  alt={pet.title}
                  width={320}
                  height={300}
                  className="rounded-lg shadow-md object-cover"
                  // onClick={() => router.push(`/pets/${pet.id}`)}
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
                <button className="mt-4 bg-[#018AE0] text-white w-[172px] h-[44px] rounded hover:bg-[#F1CC63] transition-colors">
                  Detail
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-5 space-x-2">
          <button onClick={handlePrevClick} disabled={currentPage === 1}>
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
          <button onClick={handleNextClick} disabled={currentPage === totalPages}>
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newpet;

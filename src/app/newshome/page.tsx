import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const NewsHome = () => {
    const router = useRouter();
  const items = [
    {
      id: 1,
      title: 'Chú Chó Corgi Sinh Ra Với 1 Mắt Và 2 Mũi...',
      date: '23',
      month: 'T4',
      description:
        'Khuyết tật bẩm sinh khiến chú chó gặp rất nhiều trở ngại nhưng sức sống mãnh liệt đã chiến thắng tất cả.',
      image: '/images/corgi.jpg',
    },
    {
      id: 2,
      title: 'Chú Chó Shiba Inu Nổi Tiếng Khắp Thế Giới...',
      date: '23',
      month: 'T4',
      description:
        'Trong hội bạn thân nào cũng có ai đó chuyên gia "phá game", cả đám tạo dáng đồng đều riêng mình nó lại muốn khác biệt',
      image: '/images/shiba.jpg',
    },
    {
      id: 3,
      title: "'Chú Mèo Buồn Bã Nhất Thế Giới' Ngày Ấy...",
      date: '23',
      month: 'T4',
      description: 'Cái kết hạnh phúc cho chú mèo chỉ sau 1 năm',
      image: '/images/cat.jpg',
    },
    {
      id: 4,
      title: "Câu chuyện về chú chó Golden Retriever...",
      date: '24',
      month: 'T4',
      description: 'Câu chuyện cảm động về chú chó trung thành.',
      image: '/images/golden.png',
    },
    {
      id: 5,
      title: "Chú chó Husky và hành trình tìm lại gia đình...",
      date: '25',
      month: 'T4',
      description: 'Hành trình đầy xúc động của chú chó Husky.',
      image: '/images/bosscat.png',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="h-[828px]">
      <div className="flex flex-col items-center justify-center pt-10 gap-3">
        <div className="font-semibold text-3xl">NEWS</div>
        <Image
          src="/images/dogfoot.png"
          alt="Dog foot logo"
          width={30}
          height={30}
          className="transform rotate-12"
        />
      </div>
      <div className="relative flex items-center justify-center mt-10">
        {/* Previous Button */}
        <button
          className={`absolute left-80 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-10 ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handlePrev}
          disabled={currentIndex === 0} 
          style={{ top: '50%', transform: 'translateY(-50%)' }} 
        >
          Prev
        </button>

       
        <div className="flex overflow-hidden w-full justify-center gap-4">
          {items.slice(currentIndex, currentIndex + 3).map((item) => (
            <div
              key={item.id}
              className="max-w-xs rounded overflow-hidden shadow-lg text-center bg-[#F4F4F4] relative"
            >
              <div className="relative w-auto h-[300px]  ">
                <Image
                  className="object-cover "
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                />
               
                <div className="absolute top-64 left-2 text-white font-semibold  text-center px-2 py-1 rounded-md">
                  <p className='bg-[#D11B60] px-2 py-1 '>{item.date}</p>
                  <p className='bg-[#C01958] px-2 py-1'>{item.month}</p>
                </div>
              </div>
              <div className="px-6 py-4 mt-2">
                <div className="font-bold text-xl mb-2">{item.title}</div>
                <p className="text-gray-700 text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      
        <button
          className={`absolute right-80 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-10 ${
            currentIndex === items.length - 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleNext}
          disabled={currentIndex === items.length - 3} 
          style={{ top: '50%', transform: 'translateY(-50%)' }} 
        >
          Next
        </button>
      </div>
      <div className="flex justify-center mt-8">
    <button onClick={()=>{router.push('/news')}}  className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#018AE0] mt-10">
      READ MORE
    </button>
  </div>
    </div>
  );
};

export default NewsHome;

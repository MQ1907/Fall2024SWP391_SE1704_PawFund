"use client"; // Thêm dòng này để chỉ định đây là Client Component

import React, { useState } from 'react';

const Admin = () => {
  const pet = [
    {
      id: 1,
      name: 'Long',
      age: 6,
      breed: 'dog',
      description: 'stupid dog',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 2,
      name: 'Bobby',
      age: 4,
      breed: 'cat',
      description: 'cute cat',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 3,
      name: 'Max',
      age: 5,
      breed: 'dog',
      description: 'happy dog',
      vaccinated: 'no',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 4,
      name: 'Kitty',
      age: 3,
      breed: 'cat',
      description: 'playful cat',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 5,
      name: 'Rex',
      age: 2,
      breed: 'dog',
      description: 'loyal dog',
      vaccinated: 'no',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 6,
      name: 'Bella',
      age: 1,
      breed: 'dog',
      description: 'friendly dog',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 7,
      name: 'Coco',
      age: 1,
      breed: 'dog',
      description: 'cute dog',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 8,
      name: 'Luna',
      age: 1,
      breed: 'dog',
      description: 'playful dog',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 9,
      name: 'Charlie',
      age: 1,
      breed: 'dog',
      description: 'friendly dog',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 10,
      name: 'Rocky',
      age: 1,
      breed: 'dog',
      description: 'active dog',
      vaccinated: 'no',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 11,
      name: 'Daisy',
      age: 1,
      breed: 'dog',
      description: 'lovely dog',
      vaccinated: 'yes',
      image: 'https://via.placeholder.com/200',
    },
  ];

  // Trạng thái cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 10;

  // Tính toán chỉ số bắt đầu và kết thúc
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pet.slice(indexOfFirstPet, indexOfLastPet);

  // Thay đổi trang
  const nextPage = () => {
    if (currentPage < Math.ceil(pet.length / petsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm xử lý nút Accept và Decline
  const handleAccept = (petId) => {
    console.log(`Accepted pet with ID: ${petId}`);
  };

  const handleDecline = (petId) => {
    console.log(`Declined pet with ID: ${petId}`);
  };

  return (
    <div className='mt-[148px]'>
      <div className="flex flex-col border border-gray-300">
        <div className="flex border-b border-gray-300">
          <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">ID</div>
          <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[300px]">Hình ảnh</div>
          <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">Name</div>
          <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">Age</div>
          <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">Breed</div>
          <div className="border-r border-gray-300 p-4 flex items-center justify-center flex-1">Description</div>
          <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">Vaccinated</div>
          <div className="p-4 flex items-center justify-center w-[200px]">Accept</div>
        </div>
        {currentPets.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex border-b border-gray-300">
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">{item.id}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[300px]">
                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover" />
              </div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">{item.name}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">{item.age}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">{item.breed}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center flex-1">{item.description}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">{item.vaccinated}</div>
              <div className="p-4 flex items-center justify-center w-[200px]">
                <button
                  onClick={() => handleAccept(item.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Nút điều hướng trang */}
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 flex items-center"
        >
          &#9664; {/* Mũi tên trái */}
        </button>
        <span className="text-lg">Trang {currentPage} / {Math.ceil(pet.length / petsPerPage)}</span> {/* Hiển thị số trang */}
        <button 
          onClick={nextPage} 
          disabled={currentPage >= Math.ceil(pet.length / petsPerPage)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 flex items-center"
        >
          &#9654; {/* Mũi tên phải */}
        </button>
      </div>
    </div>
  );
}

export default Admin;

import Image from "next/image";
import React from "react";

const FindPet = () => {
  const dogData = [
    {
      id: 1,
      name: "Win",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
    {
      id: 2,
      name: "Elvis",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Chưa rõ",
      image: "/images/pet2.jpeg",
    },
    {
      id: 3,
      name: "Mimi",
      gender: "Cái",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet3.jpeg",
    },
    {
      id: 4,
      name: "Orion",
      gender: "Cái",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet4.jpeg",
    },
    {
      id: 5,
      name: "Oscar",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Chưa rõ",
      image: "/images/pet1.jpeg",
    },
    {
      id: 6,
      name: "Lucy",
      gender: "Cái",
      age: "Con",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
    {
      id: 7,
      name: "Daisy",
      gender: "Cái",
      age: "Con",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
    {
      id: 8,
      name: "Max",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
  ];
  const catData = [
    {
      id: 1,
      name: "Win",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
    {
      id: 2,
      name: "Elvis",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Chưa rõ",
      image: "/images/pet2.jpeg",
    },
    {
      id: 3,
      name: "Mimi",
      gender: "Cái",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet3.jpeg",
    },
    {
      id: 4,
      name: "Orion",
      gender: "Cái",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet4.jpeg",
    },
    {
      id: 5,
      name: "Oscar",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Chưa rõ",
      image: "/images/pet1.jpeg",
    },
    {
      id: 6,
      name: "Lucy",
      gender: "Cái",
      age: "Con",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
    {
      id: 7,
      name: "Daisy",
      gender: "Cái",
      age: "Con",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
    {
      id: 8,
      name: "Max",
      gender: "Đực",
      age: "Trưởng thành",
      vaccination: "Có",
      image: "/images/pet1.jpeg",
    },
  ];



  return (


    
    <div>
      <div className="flex flex-col items-center justify-center pt-10 gap-3">
        <div className="font-semibold text-3xl">FIND PETS</div>
        <Image
          src="/images/dogfoot.png"
          alt=""
          width={30}
          height={30}
          className="transform rotate-12"
        />
      </div>
      <div className="flex items-center justify-center mt-6 gap-6">
        <div className="text-white font-medium">
          <button
            type="button"
            className="text-white, text-[20px] bg-[#008ADF] w-[120px] h-[50px] rounded-[30px]"
          >
            All
          </button>
        </div>
        <div className="text-white font-medium">
          <button
            type="button"
            className="text-white, text-[20px] bg-yellow-400 hover:bg-blue-400 w-[120px] h-[50px] rounded-[30px]"
          >
            Dogs
          </button>
        </div>
        <div className="text-white font-medium">
          <button
            type="button"
            className="text-white, text-[20px] bg-yellow-400 hover:bg-blue-400 w-[120px] h-[50px] rounded-[30px]"
          >
            Cats
          </button>
        </div>
        <div className="text-white font-medium">
          <button
            type="button"
            className="text-white, text-[20px] bg-yellow-400 hover:bg-blue-400 w-[120px] h-[50px] rounded-[30px]"
          >
            Others
          </button>
        </div>
      </div>
      <div className="w-[1100px] mx-auto p-4 mt-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Gender
            </label>
            <select className="block w-full border border-blue-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <select className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>All</option>
              <option>1-2 years</option>
              <option>3-5 years</option>
              <option>Over 5 years</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Sterilization
            </label>
            <select className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>All</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Color
            </label>
            <select className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>All</option>
              <option>White</option>
              <option>Black</option>
              <option>Yellow</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter Name..."
            />
          </div>

          <div className="flex items-end ml-[100px]">
            <button className="bg-pink-500 hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full w-[200px]">
              Search
            </button>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default FindPet;

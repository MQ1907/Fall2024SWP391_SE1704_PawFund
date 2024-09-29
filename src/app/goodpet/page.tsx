import React, { useState } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
const GoodBaby = () => {
  const router = useRouter();
  const [isAnimating] = useState(true);
    const petsData = [
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
    
      const [currentIndex, setCurrentIndex] = useState(0);
      const petsPerPage = 4;
    
      const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? Math.max(petsData.length - petsPerPage, 0) : prevIndex - petsPerPage
        );
      };
    
      const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex + petsPerPage >= petsData.length ? 0 : prevIndex + petsPerPage
        );
      };
    
      const currentPets = petsData.slice(currentIndex, currentIndex + petsPerPage);
  return (
    <div className="h-[775px] bg-[#F6F6F7] ">
    <div className={`flex flex-col items-center justify-center pt-10 gap-3 ${isAnimating ? 'animate__animated animate__fadeInLeft animate__delay-3s animate__duration-4s' : ''}`}>
    <div className="font-semibold text-3xl">GOOD BABY OF THE WEEK</div>
    <Image src="/images/dogfoot.png" alt="" width={30} height={30} className="transform rotate-12" />
    </div>


    <div className="w-[1111px] h-[581px] bg-white mx-auto shadow-lg rounded-lg p-8 relative mt-5">
  <div className="flex justify-between items-center">
   
    <button
      onClick={handlePrevClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full hover:bg-gray-400"
    >
      &#9664;
    </button>

 
    <div className="flex justify-center gap-14">
      {currentPets.map((pet) => (
        <div key={pet.id} className="text-center w-[220px] mx-auto">
          <Image
            src={pet.image}
            alt={pet.name}
            width={220}
            height={220}
            className="rounded-md"
          />
          <h3 className="text-lg font-bold mt-4">{pet.name}</h3>
          <hr className="border-1 border-gray-300 my-2 w-[60px] mx-auto" />
          <p className="text-gray-600 font-semibold">Giới tính: {pet.gender}</p>
          <p className="text-gray-600 font-semibold">Tuổi: {pet.age}</p>
          <p className="text-gray-600 font-semibold">Tiêm phòng: {pet.vaccination}</p>
        </div>
      ))}
    </div>

   
    <button
      onClick={handleNextClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full hover:bg-gray-400 "
    >
      &#9654;
    </button>
  </div>

  
  <div className="flex justify-center mt-8">
    <button onClick={()=>{router.push('/adopt')}} className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#018AE0] mt-10">
      ADOPT
    </button>
  </div>
</div>
    
  </div>
  )
}

export default GoodBaby

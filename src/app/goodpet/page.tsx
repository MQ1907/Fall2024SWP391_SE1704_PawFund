"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  fetchPetsByStatus,
  selectCompletedPets,
} from "@/lib/features/pet/petSlice";
import "animate.css";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import Link from "next/link";

const GoodBaby = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isAnimating] = useState(true);
  const petsData = useAppSelector(selectCompletedPets);
  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerPage = 4;

  useEffect(() => {
    dispatch(fetchPetsByStatus("COMPLETED"));
  }, [dispatch]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(petsData.length - petsPerPage, 0)
        : prevIndex - petsPerPage
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + petsPerPage >= petsData.length ? 0 : prevIndex + petsPerPage
    );
  };

  const currentPets = petsData.slice(currentIndex, currentIndex + petsPerPage);

  return (
    <div className="min-h-screen bg-[#F6F6F7]">
      <div
        className={`flex flex-col items-center justify-center pt-10 gap-3 ${
          isAnimating
            ? "animate__animated animate__fadeInLeft animate__delay-3s animate__duration-4s"
            : ""
        }`}
      >
        <div className="font-semibold text-3xl text-gray-800">
          GOOD BABY OF THE WEEK
        </div>
        <Image
          src="/images/dogfoot.png"
          alt=""
          width={30}
          height={30}
          className="transform rotate-12"
        />
      </div>

      <div className="w-full max-w-6xl bg-white mx-auto shadow-lg rounded-lg p-8 relative mt-5">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevClick}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full hover:bg-gray-400 transition duration-300 ease-in-out animate__animated animate__fadeInLeft"
          >
            &#9664;
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentPets.map((pet, index) => (
              <Link href={`/pet-detail/${pet._id}`} key={pet._id}>
                <div
                  key={pet._id}
                  className={`relative text-center mx-auto animate__animated transform transition-transform duration-300 hover:scale-110 ${
                    pet.isAdopted ? "bg-gray-300" : "bg-white"
                  } shadow-md rounded-lg p-4 transition duration-300 ease-in-out hover:shadow-lg`}
                >
                  <div className="relative">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="rounded-md w-full h-56 object-cover"
                    />
                    {pet.isAdopted && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-black bg-opacity-70 text-white font-bold text-lg rounded-lg px-4 py-2 shadow-xl transition duration-300 ease-in-out uppercase flex items-center justify-center">
                        Adopted
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mt-4 text-gray-800">
                    {pet.name}
                  </h3>
                  <hr className="border-1 border-gray-300 my-2 w-[60px] mx-auto" />
                  <p className="text-gray-600 font-semibold">
                    GENDERr: {pet.gender}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    VACCINE: {pet.isVacinted ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    Adopted: {pet.isAdopted ? "Already adopted" : "Not yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={handleNextClick}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full hover:bg-gray-400 transition duration-300 ease-in-out animate__animated animate__fadeInRight"
          >
            &#9654;
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              router.push("/adopt");
            }}
            className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#018AE0] mt-10 animate__animated animate__pulse animate__infinite transition duration-300 ease-in-out"
          >
            ADOPT
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoodBaby;
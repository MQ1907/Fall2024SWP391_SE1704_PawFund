"use client";
import Image from "next/image";
import React, { useState } from "react";

const AboutUs = () => {
  const memberData = [
    {
      id: 1,
      name: "Pham The Long",
      role: "CEO",
      detail:
        "Before founding SaiGon Pet Adoption in 2015, Long had been involved in dog and cat rescue activities in SaiGon for many years. Looking at Long's small and youthful stature, no one would think that they had such great strength and determination to bring a better life to dogs and cats, as well as positive energy to connect like-minded people. Long always cherishes the dream of building the most beautiful shared home in Vietnam to be able to shelter more stray dogs and cats.",
      image: "/images/long.jpg",
    },
    {
      id: 2,
      name: "Le Huynh Minh Tri",
      role: "CEO",
      detail:
        "Before founding SaiGon Pet Adoption in 2015, Tri had been involved in dog and cat rescue activities in SaiGon for many years. Looking at Tri's small and youthful stature, no one would think that they had such great strength and determination to bring a better life to dogs and cats, as well as positive energy to connect like-minded people. Tri always cherishes the dream of building the most beautiful shared home in Vietnam to be able to shelter more stray dogs and cats.",
      image: "/images/miti.jpg",
    },
    {
      id: 3,
      name: "Dinh Ba Minh Quan",
      role: "Marketing",
      detail:
        "Before founding SaiGon Pet Adoption in 2015, Quan had been involved in dog and cat rescue activities in SaiGon for many years. Looking at Quan's small and youthful stature, no one would think that they had such great strength and determination to bring a better life to dogs and cats, as well as positive energy to connect like-minded people. Quan always cherishes the dream of building the most beautiful shared home in Vietnam to be able to shelter more stray dogs and cats.",
      image: "/images/quanAP.jpg",
    },
    {
      id: 4,
      name: "Tran Nguyen Minh Thien",
      role: "Culi",
      detail:
        "Before founding SaiGon Pet Adoption in 2015, Thien had been involved in dog and cat rescue activities in SaiGon for many years. Looking at Thien's small and youthful stature, no one would think that they had such great strength and determination to bring a better life to dogs and cats, as well as positive energy to connect like-minded people. Thien always cherishes the dream of building the most beautiful shared home in Vietnam to be able to shelter more stray dogs and cats.",
      image: "/images/quanAP.jpg",
    },
    {
      id: 5,
      name: "Bui Le Bao Phi",
      role: "CEO",
      detail:
        "Before founding SaiGon Pet Adoption in 2015, Phi had been involved in dog and cat rescue activities in SaiGon for many years. Looking at Phi's small and youthful stature, no one would think that they had such great strength and determination to bring a better life to dogs and cats, as well as positive energy to connect like-minded people. Phi always cherishes the dream of building the most beautiful shared home in Vietnam to be able to shelter more stray dogs and cats.",
      image: "/images/miti.jpg",
    },
  ];
  const [isAnimating] = useState(true);
  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/aboutuspic.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div className="animate__animated animate__fadeInLeft">
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              ABOUT US
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">About us</a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 animate__animated animate__zoomIn">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">
            ABOUT US
          </h1>
          <div className="w-20 h-1 bg-[#D51C63] mx-auto"></div>
        </div>

        <div className="space-y-6 text-gray-700 font-medium">
          <p className="leading-relaxed text-lg">
            We are a young group of Vietnamese volunteers and some international
            friends, working together for the love of dogs and cats. Our
            operating principle is to never give up on any animal, no matter how
            sick or disabled they may be, because every pet needs a chance to
            hope for a better future. We try our best to care for them, somewhat
            compensating for the trauma of rescued pets whether they are stray,
            lost, abandoned, or abused. Additionally, we always strive to find
            loving forever homes for them. Finally, we help raise awareness
            about owner responsibilities through social media and volunteer
            activities.
          </p>

          <p className="leading-relaxed text-lg">
            As one of the few pet rescue stations in SaiGon, operating since
            2015, the Group has helped rescue over 4,000 cases of abandoned,
            stray, and abused dogs and cats, while finding new homes for
            hundreds of pets.
          </p>
        </div>
      </div>
      <div className="bg-[#F6F6F6] py-16">
        <div
          className={`flex flex-col items-center justify-center mb-12 ${
            isAnimating
              ? "animate__animated animate__backInUp animate__duration-4s"
              : ""
          }`}
        >
          <h2 className="font-bold text-4xl mb-3">OUR TEAM</h2>
          <Image
            src="/images/dogfoot.png"
            alt="Dogfoot icon"
            width={35}
            height={35}
            className="transform rotate-12"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {memberData.slice(0, 16).map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden group">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      View Profile
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#D51C63] font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {member.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
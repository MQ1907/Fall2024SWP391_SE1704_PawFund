"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hook"; // Import hooks
import { fetchPetsByStatus } from "../../lib/features/pet/petSlice"; // Đường dẫn đến file petSlice
import Link from "next/link";

const Adopt = () => {
  const router = useRouter();
  const handleLearnMore = (link: string) => {
    router.push(link);
  };
  const dispatch = useAppDispatch();
  const { pets, status, error } = useAppSelector((state) => state.pets);
  const [breedFilter, setBreedFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerPage = 6;

  const totalPages = Math.ceil(pets.length / petsPerPage); // Use pets.length
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

  const getFilteredPets = () => {
    return pets.filter((pet) => {
      const matchesBreed = breedFilter === "All" || pet.breed === breedFilter;
      const matchesGender = genderFilter === "All" || pet.gender === genderFilter;
      const matchesColor = colorFilter === "All" || pet.color === colorFilter;
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isCompleted = pet.deliveryStatus === "COMPLETED";

      return matchesBreed && matchesGender && matchesColor && matchesSearch && isCompleted;
    });
  };

  const filteredPets = getFilteredPets();
  const currentPets = filteredPets.slice(currentIndex, currentIndex + petsPerPage);

  useEffect(() => {
    dispatch(fetchPetsByStatus("Completed"));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pt-[148px]">
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/adopt1.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              ADOPTION
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">Adopt</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        <div className="col-span-2 bg-[#FFFFFF] ml-[200px]">
          <h1 className="text-[35px] font-medium text-3xl">ADOPTION PROCESS</h1>
          <hr className="w-[60px] border-[1px] text-[#cecece] mt-2" />
          <p className="mt-4 text-black text-lg italic font-medium">
            Before deciding to adopt a dog or cat, ask yourself if you are ready
            to take on the lifelong responsibility of a dog or cat, financially,
            physically and emotionally. Adoption requires a great deal of
            consent from you, your family and others involved. Please consider
            carefully before contacting HPA about adoption.
          </p>
          <br />
          <p className="text-black text-lg">Ready? Follow these steps:</p>
          <br />
          <div className=" flex flex-col gap-3 text">
            <div className="flex gap-2">
              <Image
                src="/images/numberone.png"
                alt="Icon 1"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Learn about the pet you want to adopt on the HPA website.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numbertwo.png"
                alt="Icon 2"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Contact the Child Volunteer to learn more about your child.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numberthree.png"
                alt="Icon 3"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Participate in the adoption interview.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numberfour.png"
                alt="Icon 4"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Prepare the facilities, sign the adoption papers and pay the
                deposit to take the baby home.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numberfive.png"
                alt="Icon 5"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Regularly update the baby situation, especially when there is an
                incident to receive timely advice.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Image
              src="/images/attention.png"
              alt="attention"
              width={22}
              height={22}
            />
            <p className="text-lg text-black">Note:</p>
          </div>

          <p className="text-[#6f6f6f] text-[16px] mt-2">
            - Only inbox 01 Volunteer for interview, DO NOT inbox all the list.
            In case the Volunteer has not responded within 1 day, please inbox
            the Page. <br />
            - The interview may have many private questions, so please be
            patient! <br />
            - Each baby money will be different depending on the baby condition
            when rescued as well as the medical services (vaccination,
            sterilization) performed. <br />
            - Money is used to pay for previous medical expenses for the baby,
            as well as to support the cost of caring for and raising other
            babies at the shared home. <br />- In case you cannot continue to
            raise the baby, you must return it to the Group, do not arbitrarily
            give it to someone else.
          </p>

          <br />
          <div className="flex gap-2">
            <Image
              src="/images/dogfoot.png"
              alt="pets"
              width={22}
              height={22}
              className="transform rotate-12"
            />

            <p className="text-lg">
              If you are only able to foster, please refer to the Volunteer
              section.
            </p>
          </div>
          <br />
          <div className="flex gap-2">
            <Image
              src="/images/dogfoot.png"
              alt="pets"
              width={22}
              height={22}
              className="transform rotate-12"
            />

            <p className="text-lg">
              Learn more about the Virtual Adoption program in the banner at the
              bottom of this page.
            </p>
          </div>

          <br />
        </div>
        <div className="bg-[#F6F6F6] mr-[150px] h-[200px] rounded-[10px] ">
          <div className="ml-[20px] ">
            <h1 className="text-[21px] font-bold p-2 ">ADOPTION CONDITIONS</h1>
            <div>
              <div className="flex gap-2 items-center">
                <div className="w-[22px] h-[22px]">
                  <Image
                    src="/images/dogfoot.png"
                    alt="pets"
                    width={22}
                    height={22}
                    className="transform rotate-12"
                  />
                </div>
                <p className="text-[16px] font-bold text-[#6F6F6F]">
                  Financial independence and stability.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-[22px] h-[22px]">
                  <Image
                    src="/images/dogfoot.png"
                    alt="pets"
                    width={22}
                    height={22}
                    className="transform rotate-12"
                  />
                </div>
                <p className="text-[16px] font-bold text-[#6F6F6F]">
                  Fixed accommodation, priority in Hanoi.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-[22px] h-[22px]">
                  <Image
                    src="/images/dogfoot.png"
                    alt="pets"
                    width={22}
                    height={22}
                    className="transform rotate-12"
                  />
                </div>
                <p className="text-[16px] font-bold text-[#6F6F6F]">
                  Commitment to vaccination and sterilization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="h-[200px] w-full  relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/rescure.jpg")',
          backgroundSize: "100% 100%",
        }}
      >
        <div className=" bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-3xl font-bold ml-[170px]">
              All Rescues
            </h1>
            <p className="text-white text-[17px] mt-2 ml-[170px]">
              Learn about all rescues, hospitalized, in foster care, deceased,
              adopted...
            </p>
          </div>
          <div>
            <a
              href="#"
              className="bg-[#d4376e] hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full mr-[170px]"
            >
              VIEW ALL
            </a>
          </div>
        </div>
      </div>

      {/* <FindPet /> */}
      <div>
        <div className="flex flex-col items-center justify-center pt-10 gap-3">
          <div className="font-semibold text-3xl">FIND PETS</div>
          <Image
            src="/images/dogfoot.png"
            alt="Pet search logo"
            width={30}
            height={30}
            className="transform rotate-12"
          />
        </div>

       
        <div className="w-[1100px] mx-auto p-4 mt-[40px]">
          <div className="flex gap-6 items-center">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select 
                className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Breed
              </label>
              <select 
                className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={breedFilter}
                onChange={(e) => setBreedFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Golden">Golden</option>
                <option value="Poodle">Poodle</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Husky">Husky</option>
                <option value="Corgi">Corgi</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Color
              </label>
              <select 
                className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Yellow">Yellow</option>
                <option value="Brown">Brown</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                className="block w-full border border-red-500 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
           <div className="grid grid-cols-3 gap-x-[15%] gap-y-[5%] p-6 h-full ml-[300px] my-[80px] w-[1000px]">
      {currentPets.length > 0 ? (
        currentPets.map((pet) => (
          <Link href={`/pet-detail/${pet._id}`} key={pet._id}>
            <div
              key={pet._id}
              className={`relative text-center mx-auto animate__animated transform transition-transform duration-300 hover:scale-110 ${pet.isAdopted ? 'bg-gray-300' : 'bg-white'} shadow-md rounded-lg p-4 transition duration-300 ease-in-out hover:shadow-lg`}            >
              <img
                src={pet.image}
                alt={pet.name}
                width={200}
                height={200}
                 className="rounded-md w-full h-56 object-cover"
              />
              {pet.isAdopted && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-black bg-opacity-70 text-white font-bold text-lg rounded-lg px-4 py-2 shadow-xl transition duration-300 ease-in-out uppercase flex items-center justify-center">
                    Adopted
                  </div>
                )}
              <div className="mt-2">
                <h3 className="text-[23px] font-bold">{pet.name}</h3>
              </div>
              <hr className="h-[2px] w-[50px] bg-[#adacac] my-3" />
              <div className="flex my-1">
                <p className="font-semibold">Gender: </p>
                <p className="px-1">{pet.gender}</p>
              </div>
              <hr className="border-t-[1px] border-dashed border-[#adacac]" />
              <div className="flex my-1">
                <p className="font-semibold">Vaccinated: </p>
                <p className="px-1">{pet.isVaccinated ? "Yes" : "No"}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No pets found.</p>
      )}
    </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-2 my-5">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`px-4 py-3 rounded-md ${
            currentPage === 1
              ? "bg-[#3B82F6] text-white cursor-not-allowed"
              : "bg-[#3B82F6] hover:bg-[#D51C63] text-white"
          }`}
        >
          <Image
            src="/images/arrowleft.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="w-[20px]"
          />
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className={`px-4 py-3 rounded-md ${
            currentPage === totalPages
              ? "bg-[#3B82F6] text-white cursor-not-allowed"
              : "bg-[#3B82F6] hover:bg-[#D51C63] text-white"
          }`}
        >
          <Image
            src="/images/arrowright.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="w-[20px]"
          />
        </button>
      </div>

      <div
        className="h-[200px] w-full  relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/adopt2.png")',
          backgroundSize: "100% 100%",
        }}
      >
        <div className="bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
          <div className="flex-col-reverse">
            <div>
              <h1 className="text-white text-2xl font-medium mt-2 ml-[120px] w-[600px] text-center">
                You are Not Qualified To Bring The Boss Home? Join the Virtual
                Adoption program.
              </h1>
            </div>
            <div className="ml-[300px] mt-10">
              <a
                href="#"
                className="bg-[#d4376e] hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full mr-[170px]"
              >
                FIND NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adopt;

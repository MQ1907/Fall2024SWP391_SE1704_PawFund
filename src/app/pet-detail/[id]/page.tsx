"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../lib/hook";
import { fetchPetById } from "../../../lib/features/pet/petSlice";

function PetDetail() {
  const [isAnimating, setIsAnimating] = useState(true);
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentPet, status, error } = useAppSelector((state) => state.pets);

  useEffect(() => {
    console.log('Pet ID:', id);
    if (id) {
      dispatch(fetchPetById(id));
    }
    const timer = setTimeout(() => setIsAnimating(false), 4000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  console.log('Current Pet:', currentPet); // Add this line
  console.log('Status:', status); // Add this line
  console.log('Error:', error); // Add this line

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!currentPet) {
    return <div>Pet not found</div>;
  }

  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative "
        style={{ backgroundImage: "url('/images/petdetail.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16 ">
          <div className="animate__animated animate__fadeInLeft">
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              PET DETAIL
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">Donate</a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-[20px] mx-[200px]">
        <div className="w-[40%] ml-[200px] ">
          <img
            src={currentPet.image}
            alt={currentPet.name}
            className="w-[100%] h-auto rounded-[5px] ml-[-200px]"
          />
        </div>

        <div className="w-[70%] ml-[-120px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-[34px] font-medium">{currentPet.name}</h1>
            <hr className="border-t-[1px] border-dashed border-[#adacac] " />
            <div className="flex my-1 ">
              <p className="font-semibold">Age: </p>
              <p className="px-1 ">{currentPet.age}</p>
            </div>
            <hr className="border-t-[1px] border-dashed border-[#adacac] " />
            <div className="flex my-1 ">
              <p className="font-semibold">PetCode: </p>
              <p className="px-1 ">{currentPet.petCode}</p>
            </div>
            <hr className="border-t-[1px] border-dashed border-[#adacac] " />
            <div className="flex my-1 ">
              <p className="font-semibold">Gender: </p>
              <p className="px-1 ">{currentPet.gender}</p>
            </div>
            <hr className="border-t-[1px] border-dashed border-[#adacac] " />
            <div className="flex my-1 ">
              <p className="font-semibold">Vaccinated: </p>
              <p className="px-1 ">{currentPet.isVacinted ? 'Yes' : 'No'}</p>
            </div>
            <hr className="border-t-[1px] border-dashed border-[#adacac] " />
            <div className="flex my-1 ">
              <p className="font-semibold">Color: </p>
              <p className="px-1 ">{currentPet.color}</p>
            </div>
            <div className="flex gap-4">
              <button className="relative border-2 border-gray-800 rounded-[5px] bg-transparent py-2.5 px-10 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-pink-500 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100">
                Adopt
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 ml-[200px]">
        <h1 className="text-[34px] font-medium">Information</h1>
        <hr className="border-1 border-gray-600 w-[50px]" />
        <p className="mt-6">{currentPet.description}</p>
      </div>
      <div className="mt-10 ml-[200px]">
        <h1 className="text-[34px] font-medium">Information</h1>
        <hr className="border-1 border-gray-600 w-[50px]" />
        <p className="mt-6">ajskhdsljhsdls</p>
      </div>
      <div
        className="h-[200px] w-full  relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center mt-3"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/donate2.jpg")',
          backgroundSize: "100% 100%",
        }}
      >
        <div className="bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
          <div className="flex flex-row animate__animated animate__bounce  animation-duration: 5s ">
            <div>
              <h1 className="text-white text-[34px] font-medium  ml-[100px] w-[600px] text-center">
                You want to help?
              </h1>
            </div>
            <div className="ml-[300px] mt-3">
              <a
                href="/donate"
                className="bg-[#d4376e] hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full mr-[170px]"
              >
                DONATE NOW
              </a>
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
      <div className="h-[775px] bg-[#F6F6F7] ">
        <div
          className={`flex flex-col items-center justify-center pt-10 gap-3 ${
            isAnimating
              ? "animate__animated animate__fadeInLeft animate__delay-3s animate__duration-4s"
              : ""
          }`}
        >
          <div className="font-semibold text-3xl">MORE PETS</div>
          <Image
            src="/images/dogfoot.png"
            alt=""
            width={30}
            height={30}
            className="transform rotate-12"
          />
        </div>

        {/* <div className="w-[1111px] h-[581px] bg-white mx-auto shadow-lg rounded-lg p-8 relative mt-5">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevClick}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full hover:bg-gray-400"
            >
              &#9664;
            </button>

            <div className="flex justify-center gap-14">
              {morePets.map((pet) => (
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
                  <p className="text-gray-600 font-semibold">
                    Giới tính: {pet.gender}
                  </p>                  <p                  <p className="text-gray-600 font-semibold">
                    Tiêm phòng: {pet.vaccination}
                  </p>
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
            <button
              onClick={() => {
                router.push("/adopt");
              }}
              className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#018AE0] mt-10"
            >
              ADOPT
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default PetDetail;
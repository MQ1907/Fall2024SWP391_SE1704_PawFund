"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const Donate = () => {
  const router = useRouter();
  // const handleDonate = (link: string) => {
  //   router.push(link);
  // };
  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative "
        style={{ backgroundImage: "url('/images/donate.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16 ">
          <div className="animate__animated animate__fadeInLeft">
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              DONATE
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
      <div className="grid grid-cols-3 gap-10 mt-10 animate__animated animate__zoomIn">
        <div className="col-span-2 bg-[#FFFFFF] ml-[200px]">
          <h1 className="text-[35px] font-medium text-3xl">I WANT TO DONATE</h1>
          <hr className="w-[60px] border-[1px] text-[#cecece] mt-2" />
          <p className="mt-4 text-black text-lg italic font-medium">
            All rescue activities of Hanoi Pet Adoption are completely based on
            donations from the community. The groups monthly expenses include
            rent, hospital fees, food, electricity, water, medicine and
            supplies, diapers, salaries to support volunteers in cleaning... The
            group really needs your help. you to be able to maintain the common
            house as well as the rescue team. Just a fixed amount of 50k - 100k
            monthly will help the group and children a lot!
          </p>
          <br />
          <p className=" text-[16px] font-medium text-black">
            The costs will be divided equally among the other children still in
            the hospital and a common home will be built. In addition, the Group
            also accepts donations in kind such as old clothes (for bedding),
            diapers, medical gloves, food, sand, etc.
          </p>
          <br />

          <br />
          <p className="text-[16px] font-medium text-black">
            *Note: the group does not use zalo and NEVER asks Manh Thuong Quan
            to provide card information or OTP code
          </p>

          <br />
        </div>
        <div>
          <Image
            src="/images/donatepic.jpg"
            alt="pets"
            width={230}
            height={230}
          />
        </div>
        <div className="flex items-end ml-[200px]">
          <button
            onClick={() => {
              router.push("/contact");
            }}
            className="bg-pink-500 hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full w-[200px]"
          >
            DONATE NOW
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center pt-10 mt-8 gap-3 bg-gray-400">
          <div className="font-semibold text-3xl">SUPPORTER COMMUNITY</div>
          <Image
            src="/images/dogfoot.png"
            alt="Pet search logo"
            width={30}
            height={30}
            className="transform rotate-12"
          />
        </div>
      </div>
    </div>
  );
};

export default Donate;

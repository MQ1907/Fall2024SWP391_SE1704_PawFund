"use client";
import Image from "next/image";
import React from "react";
import FindPet from "../findpet/page";
// import { useRouter } from "next/navigation";

const Adopt = () => {
  // const router = useRouter();
  // const handleHomePage = (link: string) => {
  //   router.push(link);
  // };
  return (
    <div>
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/adopt1.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">ADOPTION</h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">
               Adopt
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
      <div
        className="w-full bg-cover bg-center relative mt-5"
        style={{ backgroundImage: "url('/images/rescure.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
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
      {/* <div>
        <div className="text-[35px] font-bold items-center">FIND PET</div>
        <div className="flex gap-3">
          <div>
            <button
              type="button"
              className="text-white, text-[20px] bg-[#008ADF] w-[120px] h-[50px] rounded-lg"
             
            >
              Default
            </button>
          </div>
          <div>
            <button
              type="button"
              className="text-white, text-[20px] bg-[#008ADF] w-[120px] h-[50px] rounded-lg"
             
            >
              Default
            </button>
          </div>
          <div>
            <button
              type="button"
              className="text-white, text-[20px] bg-[#008ADF] w-[120px] h-[50px] rounded-lg"
             
            >
              Default
            </button>
          </div>
        </div>
      </div> */}
      <FindPet />
      <div
        className="w-full bg-cover bg-center relative mt-5"
        style={{ backgroundImage: "url('/images/adopt2.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
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

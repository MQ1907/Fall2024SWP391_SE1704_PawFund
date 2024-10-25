"use client";
import React from 'react';
import Newpet from '../newpet/page';
import Event from '../event/page';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const News = () => {
  const router = useRouter();

  return (
    <div className='pt-[148px]'>
      <div
        className="w-full bg-cover bg-center relative bg-red"
        style={{ backgroundImage: "url('/images/news.png')" }}
      >
        <div className="bg-black bg-opacity-20 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">News</h1>
            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">HomePage</a>
              <span className="mx-2">&gt;</span>
              <a href="/news">News</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-10 p-8 py-10">
        <div className="col-span-6 ml-[180px]">
          <Newpet />
        </div>
        <div className="col-span-4 ml-[150px]">
          <div className='h-auto bg-[#F6F6F6] w-[350px] rounded-lg shadow-lg relative overflow-hidden'>
            <div className="p-4 pb-20">
              <h1 className='text-center mt-2 text-2xl font-bold'>Category</h1>
              <hr className='border-t border-[#6F6F6F] h-[20px] mx-auto w-2/3 mt-2' />
              <div className='flex flex-col items-start space-y-2 w-full px-4 ml-8'>
                {['Volunteer activities', 'Rescue process', 'News and Events', 'Video'].map((item, index) => (
                  <button
                    key={index}
                    className='bg-white w-[220px] h-[44px] hover:bg-[#D61C62] rounded transition duration-300 text-left px-4'
                    onClick={() => router.push("/volunteerac")}
                  >
                    <span className='text-black hover:text-white'>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
              <h1 className='text-center mt-5 text-2xl font-bold'>Video about us</h1>
              <hr className='border-t border-[#6F6F6F] h-[20px] mx-auto w-2/3 mt-2' />
              <div className='flex justify-center mt-2 mb-4'>
                <iframe
                  width={320}
                  height={200}
                  src="https://www.youtube.com/embed/ZTw49Ww18UA"
                  title="Laugh Till You Cry With These Funny Animal Videos! 🤣"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 ">
              <Image
                src="/images/bgfooter.png"
                alt="Footer decoration"
                layout="fill"
                objectFit="cover"
                className="filter grayscale-[80%]"
              />
            </div>
          </div>
        </div>
      </div>     
      <Event />    
      <div
        className="h-[150px] w-full relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/support.jpg")',
          backgroundSize: "120% 80%",
        }}
      >
        <div className="flex items-center justify-center gap-52">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="text-4xl font-bold text-white">
              ARE YOU READY TO DONATE?
            </div>
          </div>
          <button
            onClick={() => router.push("/donate")}
            className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#F1CC63]"
          >
            DONATE NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;

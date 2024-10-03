"use client";
import React from 'react';
import Newpet from '../newpet/page';
import Event from '../event/page';
import Image from 'next/image';

const News = () => {
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
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/news">News</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-10 p-8 py-10">
        <div className="col-span-6  ml-[300px]">
          <Newpet />
        </div>
        <div className="col-span-4 ml-[200px]">
        <div className='h-auto bg-[#F6F6F6] w-60 '>
          <h1 className='text-center mt-2 text-2xl font-bold'>Category</h1>
          <hr className='border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2' />
          <button className='bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded'> 
            <p className='text-center text-black hover:text-white'>Volunteer activities</p> 
          </button>
          <h1 className='text-center mt-5 text-2xl font-bold'>Video about us</h1>
          <hr className='border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2' />
          <div className='ml-2'>
            <iframe width={220} height={200}  src="https://www.youtube.com/embed/ZTw49Ww18UA" title="Laugh Till You Cry With These Funny Animal Videos! 🤣" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          </div>
          <div className="h-[40px] relative">
        <Image src="/images/bgfooter.png" alt="" width={1440} height={117}   className="w-full h-full object-cover"/>
        </div>
        </div>
        </div>
      </div>
      <Event />
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/support.png')" }}
      >
        <div className="bg-black bg-opacity-20 w-full h-[210px] flex items-center justify-between px-8 py-16">
        <h1 className="text-2xl text-white ml-[350px]">Are you ready for help?</h1>
          <button className="mt-4 bg-[#018AE0] text-white w-[172px] h-[44px] rounded hover:bg-[#F1CC63] transition-colors  mr-[300px]">
            Support now
          </button>   
        </div>
      </div>
    </div>
  );
};

export default News;

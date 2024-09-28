"use client";
import React from 'react';
import Newpet from '../newpet/page';

const News = () => {
  return (
    <div className='pt-[148px]'>
      <div
        className="w-full bg-cover bg-center relative"
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

      <div className="grid grid-cols-2 gap-4 mt-10">
        <div className="col-span-2 bg-[#FFFFFF] ml-[200px] flex items-center justify-between space-x-4">
          <Newpet />
          <div className="bg-white rounded-lg shadow-md p-4">
            hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;

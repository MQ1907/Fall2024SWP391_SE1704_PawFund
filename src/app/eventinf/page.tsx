"use client";
import React from 'react';
import Image from "next/image";
import Event from '../event/page';
import { useRouter } from "next/navigation";

const Eventinf = () => {
    const router = useRouter();
    const Enventin = [
        {
            title: 'Phiên chợ từ thiện Mini & ngày hội nuôi cún',
            time: 'Thời gian diễn ra sự kiện: 26/11/2023 lúc 11:00 tại 102 Quảng An, Tây Hồ, Hà Nội',
            detail: '🐾🐶🐾 Đừng bỏ lỡ cơ hội tuyệt vời để đón nhận tình yêu và sự trung thành từ những người bạn bốn chân đáng yêu! 🐾🐱🐾'
        }
    ];

    return (
        <div className='mt-[148px]'>
            <div
                className="w-full bg-cover bg-center relative"
                style={{ backgroundImage: "url('/images/news.png')" }}
            >
                <div className="bg-black bg-opacity-20 w-full h-[210px] flex items-center justify-between px-8 py-16">
                    <div>
                        <h1 className="text-white text-[45px] font-bold ml-[170px]">
                            News
                        </h1>
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
            <div className="flex h-auto py-6 font-medium">
                <div className="w-[70%] flex justify-center">
                    {Enventin.map((event, index) => (
                        <div key={index} className="h-auto bg-white w-[800px] px-5 py-5 ml-[200px]">
                            <div className='ml-[8px]'>
                                <h1 className="text-[34px] font-medium">{event.title}</h1>
                                <p className="text-[#6F6F6F] font-medium">{event.time}</p>
                            </div>
                            <hr className="border-t border-[#6F6F6F] mx-auto w-[800px] mt-8" />
                            <div className='ml-[8px] mt-4'>
                                <p className="text-[#6F6F6F] font-medium">{event.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-[30%] ">
                    <div className="h-auto bg-[#F6F6F6] w-60 ">
                        <h1 className="text-center mt-2 text-2xl font-bold">Category</h1>
                        <hr className="border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2" />
                        <button className="bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded">
                            <p className="text-center text-black hover:text-white">
                                PawFund Adoption Fair
                            </p>
                        </button>
                        <button className="bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded">
                            <p className="text-center text-black hover:text-white">
                                Adopt a King
                            </p>
                        </button>
                        <button className="bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded">
                            <p className="text-center text-black hover:text-white">
                                FUNDRAISING EVENT - PawFund Adoption
                            </p>
                        </button>
                        <button className="bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded">
                            <p className="text-center text-black hover:text-white">
                                Running Paws
                            </p>
                        </button>
                        <div className="h-[40px] relative mt-6">
                            <Image
                                src="/images/bgfooter.png"
                                alt=""
                                width={1440}
                                height={117}
                                className="w-full h-full object-cover"
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
}

export default Eventinf;

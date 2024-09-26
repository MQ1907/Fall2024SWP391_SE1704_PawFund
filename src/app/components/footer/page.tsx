import React from "react";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="h-[490px]">
      <div className="h-[373px] bg-[#FFFFFF] flex justify-center items-center gap-40">
        <div className="flex flex-col items-center pb-28 ">
          <Image src="/images/logo1.png" alt="" width={150} height={150} />
          <ul className="flex gap-5">
            <li><Image src="/images/facebook.png" alt="" width={18} height={18} /></li>
            <li><Image src="/images/youtube.png" alt="" width={18} height={18} /></li>
            <li><Image src="/images/instagram.png" alt="" width={18} height={18} /></li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
        
            <div className="font-semibold">About us</div>
            <hr className="w-[56px] border border-black border-1"/>
            <div className="font-thin">Young group of Vietnamese and international <br/>volunteers working for the love of dogs and cats.</div>
           
            
            <div className="font-semibold">Contact Infor</div>
            <hr className="w-[56px] border border-black border-1"/>
            <div className="flex gap-3 mt-2">
            <Image src="/images/phonegrey.png" alt="" width={18} height={18} />
               
                <div className="font-thin text-[#018AE0]">0325835484</div>
            </div>
            <div className="flex gap-3">
            <Image src="/images/emailgrey.png" alt="" width={18} height={18} />
               
                <div className="font-thin  text-[#018AE0]">trilhmse173578@fpt.edu.vn</div>
            </div>
            <div className="flex gap-3">
            <Image src="/images/locationgrey.png" alt="" width={18} height={18} />
               
                <div className="font-thin  text-[#018AE0]">SaiGon - VietNam</div>
            </div>

        </div>
      </div>

      <div className="h-[117px] relative">
        <Image src="/images/bgfooter.png" alt="" width={1440} height={117}   className="w-full h-full object-cover"/>
        <div className="absolute inset-0 flex items-center justify-center gap-3 ">
            <div className="font-semibold">Copyright 2019 / Designed by</div>
            <div className="font-semibold text-[#018AE0]">PawFund Team</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

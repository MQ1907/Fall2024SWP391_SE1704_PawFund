'use client';
import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter(); 
  const handleClick = () => {
    router.push("/adopt");
  };
  const handleClick2 = () => {
    router.push("/");
  };
  const handleClick3 = () => {
    router.push("/donate");
  };
  const handleClick4 = () => {
    router.push("/volunteer");
  };
  return (
    <div className="h-[148px]   ">
      <div className="h-[42px] bg-[#FFCC00] flex items-center justify-between ">
        <ul className="flex  gap-10 pl-96 items-center">
          <li className="flex items-center gap-2">
            <Image src="/images/location.png" alt="" width={30} height={30} />
            <div className="text-white">SaiGon-VietNam</div>
          </li>
          <li className="flex items-center gap-2">
            <Image src="/images/mail.png" alt="" width={30} height={30} />
            <div className="text-white">trilhmse173578@fpt.edu.vn</div>
          </li>
          <li className="flex items-center gap-2">
            <Image src="/images/telephone.png" alt="" width={30} height={30} />
            <div className="text-white">(84+)5835484</div>
          </li>
        </ul>
        <ul className="flex gap-10 pr-60 items-center">
          <li>
            <Image src="/images/search.png" alt="" width={30} height={30}/>
          </li>
          <li>
          <Image src="/images/vietnam.png" alt="" width={30} height={30}/>
          </li>
          <li>
            <button className="rounded-md border border-black px-4 text-white hover:text-[#D94E66] hover:bg-white  " >Login</button>
          </li>
        </ul>
      </div>
      <div className="h-[106px] bg-[#F4F4F4]">
        <ul className="flex gap-[60px] items-center justify-center">
          <li>
            <Image src="/images/logo.png" alt="" width={106} height={106} />
          </li>
          <li className="text-[#D94E66] cursor-pointer " onClick={handleClick2}>HOMEPAGE</li>
          <li className="hover:text-[#D94E66] cursor-pointer" onClick={handleClick}>ADOPT</li>
          <li className="hover:text-[#D94E66] cursor-pointer" onClick={handleClick3}>DONATE</li>
          <li className="hover:text-[#D94E66] cursor-pointer" onClick={handleClick4}>VOLUNTEER</li>
          <li className="hover:text-[#D94E66] cursor-pointer">NEWS</li>
          <li className="hover:text-[#D94E66] cursor-pointer">CONTACT</li>
        </ul>
      </div>
    </div>
  );
};

export default Header;

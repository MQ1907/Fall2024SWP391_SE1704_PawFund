"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "animate.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      setAnimationClass("animate__fadeOut");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setAnimationClass("animate__fadeIn");
      }, 500); // Match the duration of the animation
    }
  };

  const toggleVisibility = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", toggleVisibility);

      return () => {
        window.removeEventListener("scroll", toggleVisibility);
      };
    }
  }, []);

  return (
    <div className="relative">
      <div className="bg-[#FFFFFF] flex flex-col md:flex-row justify-center items-center gap-10 md:gap-40 p-10 md:p-20 animate__animated animate__fadeIn">
        <div className="flex flex-col items-center pb-10 md:pb-28">
          <Image
            src="/images/logo1.png"
            alt=""
            width={150}
            height={150}
            className="animate__animated animate__zoomIn"
          />
          <ul className="flex gap-5 mt-4 animate__animated animate__fadeInUp">
            <li>
              <Image src="/images/facebook.png" alt="" width={18} height={18} />
            </li>
            <li>
              <Image src="/images/youtube.png" alt="" width={18} height={18} />
            </li>
            <li>
              <Image
                src="/images/instagram.png"
                alt=""
                width={18}
                height={18}
              />
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 animate__animated animate__fadeInRight text-center md:text-left">
          <div className="font-semibold">About us</div>
          <hr className="w-[56px] border border-black border-1 mx-auto md:mx-0" />
          <div className="font-thin">
            Young group of Vietnamese and international <br />
            volunteers working for the love of dogs and cats.
          </div>
          <div className="font-semibold mt-4">Contact Info</div>
          <hr className="w-[56px] border border-black border-1 mx-auto md:mx-0" />
          <div className="flex gap-3 mt-2 justify-center md:justify-start">
            <Image src="/images/phonegrey.png" alt="" width={18} height={18} />
            <div className="font-thin text-[#018AE0]">0325835484</div>
          </div>
          <div className="flex gap-3 justify-center md:justify-start">
            <Image src="/images/emailgrey.png" alt="" width={18} height={18} />
            <div className="font-thin text-[#018AE0]">
              trilhmse173578@fpt.edu.vn
            </div>
          </div>
          <div className="flex gap-3 justify-center md:justify-start">
            <Image
              src="/images/locationgrey.png"
              alt=""
              width={18}
              height={18}
            />
            <div className="font-thin text-[#018AE0]">SaiGon - VietNam</div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start gap-5">
          <div className="uppercase font-medium text-blue-500">Address :</div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.557269503132!2d106.83709737583875!3d10.845153657920543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521d28bd24323%3A0x6e003b0f1ab73e2f!2sOrigami%20T%C3%B2a%20S10.07!5e0!3m2!1svi!2s!4v1730872745420!5m2!1svi!2s"
            className="w-full h-[300px] border-0 rounded-lg shadow-lg"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="relative animate__animated animate__fadeInUp">
        <Image
          src="/images/bgfooter.png"
          alt=""
          width={1440}
          height={117}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 p-4">
          <div className="font-semibold">Copyright 2019 / Designed by</div>
          <div className="font-semibold text-[#018AE0]">PawFund Team</div>
        </div>
      </div>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-10 bg-[#FFCC00] font-bold text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#016bb5] transition duration-300 animate__animated ${animationClass}`}
        >
          <Image src="/images/up.png" alt="" width={50} height={50} />
        </button>
      )}
    </div>
  );
};

export default Footer;
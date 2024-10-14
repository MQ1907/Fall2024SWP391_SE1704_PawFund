"use client"
import React, { useEffect, useState } from "react";
import Carousel from "../components/carousel/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GoodBaby from "../goodpet/page";
import Video from "../videopage/page";
import "animate.css";
import NewsHome from "../newshome/page";

const Home = () => {
  const cardData = [
    {
      id: 1,
      image: "/images/nhannuoi.jpg",
      title: "DONATE",
      description:
        "Help keep an organization running by donating money or supplies",
      buttonText: "LEARN MORE",
      link: "/donate",
    },
    {
      id: 2,
      image: "/images/volunteer.jpeg",
      title: "VOLUNTEER",
      description: "Take action to change the lives of dogs and cats",
      buttonText: "LEARN MORE",
      link: "/volunteer",
    },
    {
      id: 3,
      image: "/images/adopt.jpg",
      title: "ADOPT",
      description:
        "Adopt, shelter, dont chase away, and love abandoned animals.",
      buttonText: "LEARN MORE",
      link: "/adopt",
    },
  ];

  const router = useRouter();
  const handleLearnMore = (link: string) => {
    router.push(link);
  };

  const [isAnimating] = useState(true); 
  const [rescues, setRescues] = useState(0);
  const [hasOwner, setHasOwner] = useState(0);
  const [waitingForOwner, setWaitingForOwner] = useState(0);
  const [notReady, setNotReady] = useState(0);

  const stats = [
    { value: 2508, setValue: setRescues },
    { value: 1059, setValue: setHasOwner },
    { value: 332, setValue: setWaitingForOwner },
    { value: 150, setValue: setNotReady },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('stats-section');
      if (section) {
        const { top, bottom } = section.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) {
          stats.forEach(({ value, setValue }) => {
            let count = 0;
            const increment = Math.ceil(value / 100); 
            const interval = setInterval(() => {
              if (count < value) {
                count += increment;
                if (count > value) count = value;
                setValue(count);
              } else {
                clearInterval(interval);
              }
            }, 20);
          });
          window.removeEventListener('scroll', handleScroll); 
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup
  }, []);

  return (
    <div className="pt-[148px]">
      <Carousel />
      <div className="h-[996px] w-full bg-[#FFFFFF]">
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-7">
            <div className="font-bold text-3xl animate__animated animate__fadeInDown">
              PET ADOPTION - SAIGON PET ADOPTION
            </div>
            <div className="animate__animated animate__fadeInLeft font-medium text-lg italic">
              We are a group of young Vietnamese volunteers and some foreigners,
              working together for the love of dogs <br /> and cats. Our motto
              is to never give up on any animal, no matter how sick or disabled
              it is, because every pet <br /> needs a chance to hope for a
              better future. We try to take the best care possible, partly
              compensating for the <br /> damage to rescued animals, whether
              they are stray, stray, abandoned or abused. In addition, we always
              try <br /> to find loving homes for them for life. And finally, we
              help raise awareness of the responsibility of pet owners <br />{" "}
              through social networks and volunteer activities.
            </div>
          </div>
          <Image className={`${isAnimating ? 'animate__animated animate__zoomIn animate__delay-1s' : ''}`} src="/images/dogadoptme.png" alt="" width={383} height={383} />
        </div>
        <div className="flex justify-center">
          <button onClick={() => {
              router.push("/aboutus");
            }} className="bg-blue-500 text-white py-2 px-20 rounded-3xl hover:bg-[#FFCC00] animate__animated animate__pulse animate__infinite">
            {" "}
            About Us{" "}
          </button>
        </div>

        <div className={`flex justify-center gap-10 p-6 mt-24 ${isAnimating ? 'animate__animated animate__fadeInUp animate__delay-1s' : ''}`}>
          {cardData.map((card, index) => (
            <div
              key={card.id}
              className={`bg-[#FFCC00] rounded-xl shadow-lg p-3 flex flex-col items-center w-[353px] h-[350px] relative animate__animated animate__fadeInUp animate__delay-${index}s`}
            >
              <div className="bg-[#F6F6F6] rounded-xl shadow-lg p-3 flex flex-col items-center w-[330px] h-[325px] absolute top-[-80px]">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={150}
                  height={150}
                  className="rounded-full mb-4"
                />
                <h3 className="font-bold text-xl mb-2">{card.title}</h3>
                <p className="text-center text-gray-700 mb-2">
                  {card.description}
                </p>
              </div>
              <button
                onClick={() => handleLearnMore(card.link)}
                className="bg-[#D61C62] text-white py-2 px-6 rounded-full hover:bg-[#018AE0] m-4 z-10 absolute bottom-5 font-semibold"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
      <GoodBaby />
      <Video />
      <div
        id="stats-section"
        className="h-[300px] w-full relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center animate__animated animate__fadeIn"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/image.png")',
          backgroundSize: "120% 80%",
        }}
      >
        <div className="flex items-center justify-center gap-52">
          <div className="flex flex-col items-center justify-center gap-5">
            <Image src="/images/paw.png" alt="" width={122} height={122} />
            <div className="text-4xl font-bold text-white">{rescues}</div>
            <div className="text-2xl font-semibold text-white">Recuse case</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <Image src="/images/house.png" alt="" width={122} height={122} />
            <div className="text-4xl font-bold text-white">{hasOwner}</div>
            <div className="text-2xl font-semibold text-white">Has owner</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <Image src="/images/train.png" alt="" width={122} height={122} />
            <div className="text-4xl font-bold text-white">{waitingForOwner}</div>
            <div className="text-2xl font-semibold text-white">Waiting for owner</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <Image src="/images/food.png" alt="" width={122} height={122} />
            <div className="text-4xl font-bold text-white">{notReady}</div>
            <div className="text-2xl font-semibold text-white">Not ready</div>
          </div>
        </div>
      </div>
      <NewsHome />
      <div
        className="h-[150px] w-full relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center "
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/support.jpg")',
          backgroundSize: "120% 80%",
        }}
      >
        <div className="flex items-center justify-center gap-52">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="text-4xl font-bold text-white animate__animated animate__bounceIn">
              ARE YOU READY TO DONATE ?
            </div>
          </div>
          <button
            onClick={() => {
              router.push("/donate");
            }}
            className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#018AE0] animate__animated animate__heartBeat animate__infinite"
          >
            DONATE NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
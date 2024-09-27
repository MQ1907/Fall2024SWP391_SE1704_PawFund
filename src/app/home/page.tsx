import React, { useState } from "react";
import Carousel from "../components/carousel/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GoodBaby from "../goodpet/page";
import Video from "../videopage/page";

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

  return (
    <div>
      <Carousel />
      <div className="h-[996px] w-full bg-[#FFFFFF]">
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-7">
            <div className="font-bold text-3xl">
              PET ADOPTION - SAIGON PET ADOPTION
            </div>
            <div className="font-medium text-lg italic">
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
          <Image src="/images/dogadoptme.png" alt="" width={383} height={383} />
        </div>
        <div className="flex justify-center">
          <button className="bg-blue-500 text-white py-2 px-20 rounded-3xl hover:bg-[#FFCC00]">
            {" "}
            About Us{" "}
          </button>
        </div>

        <div className="flex justify-center gap-10  p-6 mt-24">
          {cardData.map((card) => (
            <div
              key={card.id}
              className="bg-[#FFCC00] rounded-xl shadow-lg p-3 flex flex-col items-center w-[353px] h-[350px] relative"
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
      <Video/>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 

const Video = () => {
  const blogPosts = [
    {
      id: 1,
      image: "/images/dograin.jpg",
      title: "Poor Dog Because of the Poor Rain [Adorable Kittens And Dogs in Vietnam] Chú Chó Đáng Thương",
      date: "3/08/2020",
      description: "Looking forward to your enthusiastic support",
      link: "https://www.youtube.com/watch?v=UxZi65_zBoI",
    },
    {
      id: 2,
      image: "/images/collie.jpg",
      title: "Chú chó Collie lang thang lúc nửa đêm gặp được người tốt Nhận nuôi😂 | Yêu Lu Official",
      date: "18/01/2024",
      description: "Collie lang thang được Chủ mới nhận nuôi",
      link: "https://www.youtube.com/watch?v=Kk0FvM6kQZo", 
    },
    {
      id: 3,
      image: "/images/cam.jpg",
      title: "Rescue story: The amazing recovery of Cam",
      date: "8/09/2019",
      description: "Chúng mình đã tiếp nhận lại em do dưới Hải Phòng không đủ điều kiện để chữa trị. Giờ em đã lột xác hoàn toàn thành một em chó xinh đẹp...",
      link: "https://www.youtube.com/watch?v=Q8n1uUdaoEY", 
    },
    {
      id: 4,
      image: "/images/giaicuu.jpg",
      title: "Rescuing a puppy abused by her former owner",
      date: "16/09/2019",
      description: "Thật sự đây không phải lần đầu bé bị đánh hay bé cún đầu tiên bị người chủ này bạo hành.. ",
      link: "https://www.youtube.com/watch?v=nN3huAUR6_4", 
    },
  ];
  const [isAnimating] = useState(true);
  return (
    <div className="h-[887px] bg-[#F6F6F6]">
      <div className={`flex flex-col items-center justify-center pt-10 gap-3 ${isAnimating ? 'animate__animated animate__fadeInLeft animate__delay-2s animate__duration-4s' : ''}`}>
        <div className="font-semibold text-3xl">VIDEO</div>
        <Image
          src="/images/dogfoot.png"
          alt=""
          width={30}
          height={30}
          className="transform rotate-12"
        />
      </div>
      <div className="max-w-7xl mx-auto p-4  mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={post.link} target="_blank" rel="noopener noreferrer">
                <div className="relative cursor-pointer">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 text-white flex items-center justify-center h-full">
                    <Image src="/images/play.png" alt=" " width={50} height={50} />
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-500 mb-2">Date: {post.date}</p>
                <p className="text-gray-700">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-[#D61C62] text-white py-4 px-20 rounded-full hover:bg-[#018AE0]">
            READ MORE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;

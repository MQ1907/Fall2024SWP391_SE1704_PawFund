"use client";
import Image from "next/image";
import React, { useState } from "react";

const AboutUs = () => {
  const memberData = [

    {
      id: 1,
      name: "Pham The Long",
      role: "CEO",
      detail:"Trước khi sáng lập nên Hanoi Pet Adoption vào năm 2015, Quỳnh đã từng tham gia hoạt động cứu hộ chó mèo ở Hà Nội nhiều năm. Nhìn vóc dáng nhỏ bé và trẻ trung của Quỳnh, không ai nghĩ rằng bạn có được sức mạnh và quyết tâm to lớn để mang lại cuộc sống tốt đẹp hơn cho chó mèo, cũng như năng lượng tích cực để kết nối những người cùng chung chí hướng. Quỳnh luôn ấp ủ ước mơ xây dựng được nhà chung to đẹp nhất Việt Nam để có thể cưu mang nhiều bé chó mèo cơ nhỡ hơn..",
      image: "/images/avt1.jpg",
    },
    {
      id: 2,
      name: "Le Huynh Minh Tri",
      role: "CEO",
      detail:"Trước khi sáng lập nên Hanoi Pet Adoption vào năm 2015, Quỳnh đã từng tham gia hoạt động cứu hộ chó mèo ở Hà Nội nhiều năm. Nhìn vóc dáng nhỏ bé và trẻ trung của Quỳnh, không ai nghĩ rằng bạn có được sức mạnh và quyết tâm to lớn để mang lại cuộc sống tốt đẹp hơn cho chó mèo, cũng như năng lượng tích cực để kết nối những người cùng chung chí hướng. Quỳnh luôn ấp ủ ước mơ xây dựng được nhà chung to đẹp nhất Việt Nam để có thể cưu mang nhiều bé chó mèo cơ nhỡ hơn..",
      image: "/images/miti.jpg",
    },
    {
      id: 3,
      name: "Dinh Ba Minh Quan",
      role: "Marketing",
      detail:"Trước khi sáng lập nên Hanoi Pet Adoption vào năm 2015, Quỳnh đã từng tham gia hoạt động cứu hộ chó mèo ở Hà Nội nhiều năm. Nhìn vóc dáng nhỏ bé và trẻ trung của Quỳnh, không ai nghĩ rằng bạn có được sức mạnh và quyết tâm to lớn để mang lại cuộc sống tốt đẹp hơn cho chó mèo, cũng như năng lượng tích cực để kết nối những người cùng chung chí hướng. Quỳnh luôn ấp ủ ước mơ xây dựng được nhà chung to đẹp nhất Việt Nam để có thể cưu mang nhiều bé chó mèo cơ nhỡ hơn..",
      image: "/images/quanAP.jpg",
    },
    {
      id: 4,
      name: "Tran Minh Hieu",
      role: "Culi",
      detail:"Trước khi sáng lập nên Hanoi Pet Adoption vào năm 2015, Quỳnh đã từng tham gia hoạt động cứu hộ chó mèo ở Hà Nội nhiều năm. Nhìn vóc dáng nhỏ bé và trẻ trung của Quỳnh, không ai nghĩ rằng bạn có được sức mạnh và quyết tâm to lớn để mang lại cuộc sống tốt đẹp hơn cho chó mèo, cũng như năng lượng tích cực để kết nối những người cùng chung chí hướng. Quỳnh luôn ấp ủ ước mơ xây dựng được nhà chung to đẹp nhất Việt Nam để có thể cưu mang nhiều bé chó mèo cơ nhỡ hơn..",
      image: "/images/avt1.jpg",
    },
    {
      id: 5,
      name: "Bui Le Bao Phi",
      role: "CEO",
      detail:"Trước khi sáng lập nên Hanoi Pet Adoption vào năm 2015, Quỳnh đã từng tham gia hoạt động cứu hộ chó mèo ở Hà Nội nhiều năm. Nhìn vóc dáng nhỏ bé và trẻ trung của Quỳnh, không ai nghĩ rằng bạn có được sức mạnh và quyết tâm to lớn để mang lại cuộc sống tốt đẹp hơn cho chó mèo, cũng như năng lượng tích cực để kết nối những người cùng chung chí hướng. Quỳnh luôn ấp ủ ước mơ xây dựng được nhà chung to đẹp nhất Việt Nam để có thể cưu mang nhiều bé chó mèo cơ nhỡ hơn..",
      image: "/images/miti.jpg",
    },
    
  ]
  const [isAnimating] = useState(true);
  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/aboutuspic.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div className="animate__animated animate__fadeInLeft">
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              ABOUT US
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">About us</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1000px] justify-center ml-[250px] animate__animated animate__zoomIn">
        <h1 className="mt-[20px] text-[34px] font-medium">ABOUT US</h1>
        <hr className="w-[60px] border-[1px] bg-black"></hr>
        <br/>
        <p className="font-bold">
          Chúng tôi là một nhóm trẻ gồm tình nguyện viên Việt Nam và một số bạn
          nước ngoài, cùng hoạt động vì tình yêu chó mèo. Tôn chỉ hoạt động của
          chúng tôi là không từ bỏ nỗ lực với bất kỳ con vật nào, dù bé có ốm
          yếu hay tàn tật tới đâu, bởi mỗi thú cưng đều cần có cơ hội hi vọng
          vào một tương lai tốt đẹp. Chúng tôi cố gắng chăm sóc tốt nhất có thể,
          phần nào bù đắp lại những tổn thương cho các bé được cứu hộ về dù là
          hoang, lạc, bị bỏ rơi hay bạo hành. Ngoài ra, chúng tôi cũng luôn nỗ
          lực tìm mái ấm yêu thương các bé trọn đời . Và cuối cùng, chúng tôi
          giúp nâng cao nhận thức về trách nhiệm của chủ nuôi thông qua mạng xã
          hội và các hoạt động thiện nguyện.
        </p>
        <br/>
        <p className="font-bold">Là một trong những trạm cứu hộ thú cưng ít ỏi tại Hà Nội, hoạt động từ năm 2015 đến nay, Nhóm đã góp phần cứu giúp trên 4,000 ca chó mèo bị bỏ rơi, hoang lạc, bị bạo hành, đồng thời tìm mái ấm mới cho hàng trăm bé.

</p>
      </div>
      <div className="bg-[#F6F6F6] mt-6">
      <div className={`flex flex-col items-center justify-center pt-10 gap-3 ${isAnimating ? 'animate__animated animate__backInUp  animate__duration-4s' : ''}`}>
    <div className="font-semibold text-3xl">OUR TEAM</div>
    <Image src="/images/dogfoot.png" alt="" width={30} height={30} className="transform rotate-12" />
    </div>
    <div className=" flex justify-center">
          <div className="grid grid-cols-4 gap-6 p-6 w-[1100px]">
            {memberData.slice(0, 16).map((member, index) => (
              <div
                key={index}
                className="bg-[#F6F6F6n] rounded-lg shadow-md p-4"
              >
                <Image
                  src={member.image}
                  alt=""
                  width={200}
                  height={200}
                  className="w-[300px] h-[270px] object-fill  rounded-md  hover:scale-110 duration-500"
                />
                <div className="mt-4">
                  <h3 className="text-[21px] font-bold">{member.name}</h3>
                  <p className="text-[16px] font-medium text-blue-500"> {member.role}</p>
                  <p className="text-sm text-gray-700"> {member.detail}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
    {/* <div className="flex flex-wrap">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div> */}
      </div>
    </div>
  );
};

export default AboutUs;

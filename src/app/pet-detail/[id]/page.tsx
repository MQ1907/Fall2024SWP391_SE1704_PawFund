"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Modal, Tag } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../lib/hook";
import { fetchPetById } from "../../../lib/features/pet/petSlice";
import AdoptionRequest from "@/app/adoption-request/page";
import { fetchFeedbackByPetId } from "@/lib/features/feedback/feedbackSlice";
import { StarOutlined } from "@ant-design/icons";
import { fetchUserData } from "@/lib/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}
const PetDetail = () => {
  const [OpenAdoptionRequest, setCreateAdoptionRequest] = useState(false);
  const [loading, setLoading] = useState(false); // Khai báo trạng thái loading
  const [hasHydrated, setHasHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  interface Feedback {
    id: string;
    rating: number;
    description: string;
    userId: string;
    feedbackAt: string;
    user?: {
      name: string;
      avatar: string;
    };
  }
  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token"); // Check client-side before accessing localStorage
      setToken(storedToken);
      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const userId = decodedToken.id;
          console.log("userId", userId);

          // Gọi API để lấy thông tin người dùng
          const fetchUser = async () => {
            try {
              const response = await axios.get(
                `http://localhost:8000/users/${userId}`
              );
              console.log("User data:", response.data);
              setRole(response.data.role);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          };
          fetchUser();
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
  }, []);

  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const showAdoptPetModal = () => {
    setCreateAdoptionRequest(true); // Mở modal
  };

  const handleCancelCreateAdoptionRequest = () => {
    setCreateAdoptionRequest(false); // Đóng modal
  };

  const handleOkAdoptPet = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCreateAdoptionRequest(false); // Đóng modal sau khi xử lý xong
    }, 3000);
  };

  const [isAnimating, setIsAnimating] = useState(true);
  const params = useParams();
  const id = params.id as string;
  console.log(id);
  const dispatch = useAppDispatch();
  const { currentPet, status, error } = useAppSelector((state) => state.pets);

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
      dispatch(fetchFeedbackByPetId(id))
        .unwrap()
        .then(async (data) => {
          const feedbacksWithUserData = await Promise.all(
            data.map(async (feedback: Feedback) => {
              const userData = await dispatch(
                fetchUserData(feedback.userId)
              ).unwrap();
              return {
                ...feedback,
                user: {
                  name: userData.name,
                  avatar: userData.avatar,
                },
              };
            })
          );
          setFeedbacks(feedbacksWithUserData);
        });
    }

    const timer = setTimeout(() => setIsAnimating(false), 4000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!currentPet) {
    return <div>Pet not found</div>;
  }

    const rescueDate = new Date(currentPet.rescueDate);
  const formattedDate = `${rescueDate.getDate()}/${
    rescueDate.getMonth() + 1
  }/${rescueDate.getFullYear()}`;

  return (
    <div className="mt-[148px] ">
      <div
        className="w-full bg-cover bg-center relative "
        style={{ backgroundImage: "url('/images/petdetail.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16 ">
          <div className="animate__animated animate__fadeInLeft">
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              PET DETAIL
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">Donate</a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-10 mx-[200px] p-6  rounded-lg">
        <div className="flex gap-8">
          <div className="w-[40%]">
            <img
              src={currentPet.image}
              alt={currentPet.name}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="w-[60%]">
            <div className="flex flex-col gap-4">
              <h1 className="text-[34px] font-medium">{currentPet.name}</h1>
              <hr className="border-t-[1px] border-dashed border-gray-300" />
              <div className="flex my-1">
                <p className="font-semibold">Location Found:</p>
                <p className="px-1">{currentPet.locationFound}</p>
              </div>
              <hr className="border-t-[1px] border-dashed border-gray-300" />
              <div className="flex my-1">
                <p className="font-semibold">Gender:</p>
                <p className="px-1">{currentPet.gender}</p>
              </div>
              <hr className="border-t-[1px] border-dashed border-gray-300" />
              <div className="flex my-1">
                <p className="font-semibold">Breed:</p>
                <p className="px-1">{currentPet.breed}</p>
              </div>
              <hr className="border-t-[1px] border-dashed border-gray-300" />
              <div className="flex my-1">
                <p className="font-semibold">Rescue Day:</p>
                <p className="px-1">{formattedDate}</p>
              </div>
              <hr className="border-t-[1px] border-dashed border-gray-300" />
              <div className="flex my-1">
                <p className="font-semibold">Vaccinated:</p>
                <p className="px-1">{currentPet.isVacinted ? "Yes" : "No"}</p>
              </div>
              <hr className="border-t-[1px] border-dashed border-gray-300" />
              <div className="flex my-1">
                <p className="font-semibold">Color:</p>
                <p className="px-1">{currentPet.color}</p>
              </div>
              <div className="flex gap-4 mt-4">
              {currentPet.isAdopted === false && role ? (
                  <button
                    onClick={showAdoptPetModal}
                    className="relative border-2 border-gray-800 rounded-lg bg-transparent py-2.5 px-10 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-pink-500 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100"
                  >
                    Adopt
                  </button> ) : currentPet.isAdopted === true && role === "CUSTOMER" ? (
                  <Tag color="green" className="font-semibold uppercase">
                    This pet is already adopted.
                  </Tag> ) : null}

                <Modal
                  open={OpenAdoptionRequest}
                  title="YOU WANT TO ADOPT THIS PET?"
                  className="text-[20px]"
                  onOk={handleOkAdoptPet}
                  onCancel={handleCancelCreateAdoptionRequest}
                  footer={[
                    <Button
                      key="cancel"
                      onClick={handleCancelCreateAdoptionRequest}
                      className="relative border-2 border-gray-800 rounded-[5px] bg-transparent py-2.5 px-10 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-pink-500 before:transition-transform before:duration-300 before:content-[''] before:hover:scale-x-100"
                    >
                      Close
                    </Button>,
                  ]}
                >
                  <AdoptionRequest petId={currentPet._id} />
                </Modal>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-[34px] font-medium uppercase text-green-500 mb-4">
            Information
          </h1>
          <hr className="border-1 border-gray-300 w-full mb-4" />
          <p className="mt-6 font-semibold text-gray-700">
            Description: {currentPet.description}
          </p>
          <h1 className="text-[34px] font-medium uppercase text-orange-500 mb-4">
            FeedBack From Adopter
          </h1>
          <hr className="border-1 border-gray-300 w-full mb-4" />
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="mb-4">
                <div className="flex items-center mb-4">
                  <Avatar src={feedback.user?.avatar} size="large" />
                  <p className="font-semibold ml-2">{feedback.user?.name}</p>
                </div>
                <p className="font-semibold mb-4">
                  Comment: {feedback.description}
                </p>
                <p className="font-semibold mb-4">
                  Rating:
                  {Array.from({ length: feedback.rating }, (_, index) => (
                    <StarOutlined key={index} style={{ color: "#FFCC00" }} />
                  ))}
                </p>
                <p className="font-semibold">
                  Feedback Date:{" "}
                  {new Date(feedback.feedbackAt).toLocaleString()}
                </p>
                <hr className="border-t-[1px] border-dashed border-gray-300 mt-2" />
              </div>
            ))
          ) : (
            <p>No feedback available for this pet.</p>
          )}
        </div>
      </div>

      <div
        className="h-[200px] w-full  relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center mt-3"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/donate2.jpg")',
          backgroundSize: "100% 100%",
        }}
      >
        <div className="bg-opacity-50 w-full flex items-center justify-between px-8 py-16">
          <div className="flex flex-row animate__animated animate__bounce  animation-duration: 5s ">
            <div>
              <h1 className="text-white text-[34px] font-medium  ml-[100px] w-[600px] text-center">
                You want to help?
              </h1>
            </div>
            <div className="ml-[300px] mt-3">
              <a
                href="/donate"
                className="bg-[#d4376e] hover:bg-[#008ADF] text-white text-lg font-bold py-3 px-8 rounded-full mr-[170px]"
              >
                DONATE NOW
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        <div className="col-span-2 bg-[#FFFFFF] ml-[200px]">
          <h1 className="text-[35px] font-medium text-3xl">ADOPTION PROCESS</h1>
          <hr className="w-[60px] border-[1px] text-[#cecece] mt-2" />
          <p className="mt-4 text-black text-lg italic font-medium">
            Before deciding to adopt a dog or cat, ask yourself if you are ready
            to take on the lifelong responsibility of a dog or cat, financially,
            physically and emotionally. Adoption requires a great deal of
            consent from you, your family and others involved. Please consider
            carefully before contacting HPA about adoption.
          </p>
          <br />
          <p className="text-black text-lg">Ready? Follow these steps:</p>
          <br />
          <div className=" flex flex-col gap-3 text">
            <div className="flex gap-2">
              <Image
                src="/images/numberone.png"
                alt="Icon 1"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Learn about the pet you want to adopt on the HPA website.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numbertwo.png"
                alt="Icon 2"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Contact the Child Volunteer to learn more about your child.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numberthree.png"
                alt="Icon 3"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Participate in the adoption interview.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numberfour.png"
                alt="Icon 4"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Prepare the facilities, sign the adoption papers and pay the
                deposit to take the baby home.
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/images/numberfive.png"
                alt="Icon 5"
                width={22}
                height={22}
              />
              <p className="text-[#6f6f6f]">
                Regularly update the baby situation, especially when there is an
                incident to receive timely advice.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Image
              src="/images/attention.png"
              alt="attention"
              width={22}
              height={22}
            />
            <p className="text-lg text-black">Note:</p>
          </div>

          <p className="text-[#6f6f6f] text-[16px] mt-2">
            - Only inbox 01 Volunteer for interview, DO NOT inbox all the list.
            In case the Volunteer has not responded within 1 day, please inbox
            the Page. <br />
            - The interview may have many private questions, so please be
            patient! <br />
            - Each baby money will be different depending on the baby condition
            when rescued as well as the medical services (vaccination,
            sterilization) performed. <br />
            - Money is used to pay for previous medical expenses for the baby,
            as well as to support the cost of caring for and raising other
            babies at the shared home. <br />- In case you cannot continue to
            raise the baby, you must return it to the Group, do not arbitrarily
            give it to someone else.
          </p>

          <br />
          <div className="flex gap-2">
            <Image
              src="/images/dogfoot.png"
              alt="pets"
              width={22}
              height={22}
              className="transform rotate-12"
            />

            <p className="text-lg">
              If you are only able to foster, please refer to the Volunteer
              section.
            </p>
          </div>
          <br />
          <div className="flex gap-2">
            <Image
              src="/images/dogfoot.png"
              alt="pets"
              width={22}
              height={22}
              className="transform rotate-12"
            />

            <p className="text-lg">
              Learn more about the Virtual Adoption program in the banner at the
              bottom of this page.
            </p>
          </div>

          <br />
        </div>
        <div className="bg-[#F6F6F6] mr-[150px] h-[200px] rounded-[10px] ">
          <div className="ml-[20px] ">
            <h1 className="text-[21px] font-bold p-2 ">ADOPTION CONDITIONS</h1>
            <div>
              <div className="flex gap-2 items-center">
                <div className="w-[22px] h-[22px]">
                  <Image
                    src="/images/dogfoot.png"
                    alt="pets"
                    width={22}
                    height={22}
                    className="transform rotate-12"
                  />
                </div>
                <p className="text-[16px] font-bold text-[#6F6F6F]">
                  Financial independence and stability.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-[22px] h-[22px]">
                  <Image
                    src="/images/dogfoot.png"
                    alt="pets"
                    width={22}
                    height={22}
                    className="transform rotate-12"
                  />
                </div>
                <p className="text-[16px] font-bold text-[#6F6F6F]">
                  Fixed accommodation, priority in Hanoi.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-[22px] h-[22px]">
                  <Image
                    src="/images/dogfoot.png"
                    alt="pets"
                    width={22}
                    height={22}
                    className="transform rotate-12"
                  />
                </div>
                <p className="text-[16px] font-bold text-[#6F6F6F]">
                  Commitment to vaccination and sterilization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;

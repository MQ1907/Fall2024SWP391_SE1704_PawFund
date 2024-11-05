"use client";
import Image from "next/image";
import React from "react";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

const Contact = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_i7b87rd",
        "template_5v5296f",
        form.current,
        "lZl4PJXZrqK8HP8mC"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("Message sent");
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/contactpic.png')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              CONTACT
            </h1>

            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">Contact</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-10">
        <div className="flex flex-col gap-2 col-span-2 bg-white items-start ml-[200px] ">
          <h1 className="text-3xl font-bold text-gray-800">
            Contact information
          </h1>
          <hr className="w-[60px] font-medium border-[1px]"></hr>
          <br />
          <div className="flex gap-3">
            <Image src="/images/mail.png" alt="" width={20} height={20} />
            <p className="text-[16px] text-blue-400 hover:text-red-400 cursor-pointer">
              saigonpetadoption@gamil.com
            </p>
          </div>
          <div className="flex gap-3">
            <Image src="/images/phone.png" alt="" width={20} height={20} />
            <p className="text-[16px] text-blue-400  hover:text-red-400 cursor-pointer">
              (84+)5835484
            </p>
          </div>
          <div className="flex gap-3">
            <Image src="/images/location.png" alt="" width={20} height={20} />
            <p className="text-[16px]text-black cursor-pointer">
              Vinhomes GrandPark District 9
            </p>
          </div>
          <br />
          <div>
            <h1 className="text-[34px] ">DONATE ACCOUNT</h1>
            <br />
            <p className="text-[16px]">
              The costs will be divided equally among the other children still
              in the hospital and a common home will be built.
            </p>
          </div>
        </div>

        <div className="col-span-2 flex-row bg-white">
          {" "}
          <div className="flex justify-center items-center  mr-[200px] ">
            <div className="w-[450px] max-w-lg ">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Send Feedback
              </h2>

              <form ref={form} onSubmit={sendEmail}>
                <div className="flex space-x-4 mb-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700">Name</label>
                    <input
                      name="from_name"
                      type="text"
                      className="w-full px-4 py-2 border border-pink-600 rounded-lg focus:outline-none focus:border-pink-800"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700">Email</label>
                    <input
                      name="user_email"
                      type="email"
                      className="w-full px-4 py-2 border border-pink-600 rounded-lg focus:outline-none focus:border-pink-800"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    name="user_title"
                    type="text"
                    className="w-full px-4 py-2 border border-pink-600 rounded-lg focus:outline-none focus:border-pink-800"
                    placeholder="Enter title"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Content </label>
                  <textarea
                    name="user_content"
                    className="w-full px-4 py-2 border border-pink-600 rounded-lg focus:outline-none focus:border-pink-800"
                    placeholder=""
                    rows="5"
                  ></textarea>
                </div>

                <div className="mb-4">
                  {/* Placeholder for ReCAPTCHA */}
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-gray-600">I'm not a robot</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
                >
                  Send Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

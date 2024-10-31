"use client";
import React from 'react';
import Image from "next/image";
import Event from '../event/page';
import { useRouter } from "next/navigation";

const Eventinf = () => {
    const router = useRouter();
    const Enventin = [
        {
            title: 'PawFund',
            detail: '🐾🐶🐾 Welcome to PawFund! We are a charity dedicated to providing new homes for abandoned pets and building a loving, caring community for animals. At PawFund, you can explore pet adoption opportunities and participate in meaningful activities to help pets in need. Join us in spreading love and creating a better life for our little friends! 🐾🐱🐾',
            title2: 'Event',
            detail2: 'PawFund regularly hosts charity events and adoption days, giving you the opportunity to meet and get to know adorable pets, as well as support animal shelters. Join our events to help build a more compassionate community!'
        }
    ];

    return (
        <div className="mt-36 min-h-screen bg-gray-50">
            <div
                className="w-full h-[250px] bg-cover bg-center relative"
                style={{ backgroundImage: "url('/images/news.png')" }}
            >
                <div className="absolute inset-0 bg-black/40">
                    <div className="container mx-auto px-6 h-full flex items-center">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold text-white">
                                News
                            </h1>
                            <nav className="bg-[#D51C63] text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 shadow-lg hover:bg-[#C01857] transition-colors">
                                <a href="/" className="hover:text-gray-200 transition-colors">
                                    HomePage
                                </a>
                                <span>&gt;</span>
                                <a href="/news" className="hover:text-gray-200 transition-colors">News</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                {Enventin.map((event, index) => (
                    <div key={index} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                        <div className="space-y-12">
                            <div className="text-center">
                                <h1 className="text-5xl font-bold text-gray-800 mb-8">
                                    {event.title}
                                </h1>
                                <div className="h-px bg-gray-300 w-1/3 mx-auto my-8"></div>
                                <p className="mt-6 text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    {event.detail}
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <h2 className="text-5xl font-bold text-gray-800 mb-8">
                                    {event.title2}
                                </h2>
                                <div className="h-px bg-gray-300 w-1/3 mx-auto my-8"></div>
                                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    {event.detail2}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Event />

            <div
                className="relative bg-fixed bg-center bg-cover py-16"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url("/images/support.jpg")',
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold text-white">
                            ARE YOU READY TO DONATE?
                        </h2>
                        <button
                            onClick={() => router.push("/donate")}
                            className="bg-pink-600 text-white px-12 py-4 rounded-full font-semibold 
                                     hover:bg-[#F1CC63] transform hover:scale-105 transition-all duration-300 
                                     shadow-lg hover:shadow-xl"
                        >
                            DONATE NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Eventinf;

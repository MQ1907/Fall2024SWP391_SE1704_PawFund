"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VerifyEmail = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/auth/verify-email?token=${token}`
        );
        setMessage(response.data);
      } catch {
        setMessage("Invalid or expired token");
      }
    };

    verifyEmail();
  }, []);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = function () {
      const player = new window.YT.Player("player", {
        videoId: "bvrqfCKN8zc",
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: "bvrqfCKN8zc",
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            const playerElement = document.getElementById("player");
            if (playerElement) {
              playerElement.style.display = "block";
            }
            event.target.playVideo();
          },
        },
      });
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <div
        id="player"
        className="absolute top-0 left-0 right-0 w-full h-full scale-[1.5]"
        style={{ display: "none" }}
      ></div>
      <div
        className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
        style={{ zIndex: 5, pointerEvents: "none" }}
      ></div>
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center max-w-md w-full z-10 flex flex-col items-center justify-center gap-5">
        <img src="/images/check.png" alt="success logo" width={60}height={60} />
        <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase">
          {message}
        </h1>
        <p className="text-[#32BEA6]">
          Please back to PawFund and Login. Have Fun!
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
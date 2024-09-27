import React from "react";
import Image from "next/image";
const Video = () => {
  return (
    <div className="h-[887px]">
      <div className="flex flex-col items-center justify-center pt-10 gap-3">
        <div className="font-semibold text-3xl">VIDEO</div>
        <Image
          src="/images/dogfoot.png"
          alt=""
          width={30}
          height={30}
          className="transform rotate-12"
        />
      </div>
    </div>
  );
};

export default Video;

"use client"; // Add this line to mark the component as a Client Component

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Renews from "../renews/page";

const Infnew = () => {
  const router = useRouter();
  return (
    <div className="mt-[148px]">
      <div
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/news.png')" }}
      >
        <div className="bg-black bg-opacity-20 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              News
            </h1>
            <div className="bg-[#D51C63] text-white text-[16px] py-2 px-2 rounded-md inline-flex items-center ml-[170px]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/news">News</a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-auto py-6 font-medium">
        <div className="w-[70%] flex justify-center">
          <div className="h-auto bg-white w-[1000px] px-5 py-5">
            <h1 className="text-[34px] font-medium ">
              Chú chó Corgi sinh ra với 1 mắt và 2 mũi sống sót kỳ diệu
            </h1>
            <hr className="w-[900px] bg-black mt-2"></hr>
            <p className="mt-2">
              Dị tật bẩm sinh di truyền đã khiến chú chó Corgi này sinh ra với
              ngoại hình khác biệt. Ngoài những đặc điểm trên mặt như chỉ có 1
              mắt hay 2 mũi thì chú chó còn có 2 đốt sống hợp nhất. Do đó, bác
              sĩ thú y đã đề xuất sẽ an tử để kết thúc cuộc đời không như mong
              muốn cho nó. Tuy nhiên, lúc đó Jarmo Korhonen, đến từ Phần Lan, đã
              rất yêu quý chú chó Corgi đặc biệt này nên anh đã mua nó và mang
              về chăm sóc cùng các chú Corgi khác của mình. Anh đặt tên chú chó
              là Nekku bên cạnh các anh em là Niisku-Neiti và Karkki.
            </p>
            <Image
              src="/images/dogoneeye.png"
              alt="Corgi"
              width={200}
              height={200}
              className="w-full h-auto mt-2"
            />
            <p className="mt-2">
              Nekku đến nay đã 8 tuổi và vẫn đang tận hưởng cuộc sống hạnh phúc.
            </p>
            <p className="mt-2">
              Jarmo là một nhà nghiên cứu 38 tuổi, anh chia sẻ rằng có nhiều
              người gọi Nekku là Beretta (tên một loại súng) vì chiếc mũi của nó
              trông giống như một khẩu súng ngắn hai nòng.
            </p>
            <Image
              src="/images/corgi.jpg"
              alt="Corgi"
              width={200}
              height={200}
              className="w-full h-auto mt-2"
            />
            <p className="mt-2">
              Nếu không có Jarmo, Nekku có lẽ đã không sống sót.
            </p>
            <div className="bg-[#F6F6F6] w-[700px] h-auto mt-5 py-4 px-3 rounded-lg text-black font-medium">
              <p className="mt-2">
                Bố và mẹ của Nekku đều có giống rất tốt, chúng được chọn lựa để
                tham gia các buổi biểu diễn và được lên kế hoạch để sinh ra
                những chú chó con mạnh khoẻ, nhưng có điều gì đó không đúng với
                Nekku.
              </p>
              <p className="mt-2">
                Lông dài, xù là một lỗi di truyền của chó Corgi, thậm chí Nekku
                còn có 2 mũi và 1 mắt, cùng với đốt sống hợp nhất trên lưng. Nhà
                lai tạo và bác sĩ thú y đều khẳng định nó không sống được bao
                lâu và sẽ gặp nhiều khó khăn trong tương lai.
              </p>
              <p className="mt-2">
                Vì vậy họ đề xuất phương án an tử nhưng tôi không muốn Nekku kết
                thúc cuộc đời như vậy.
              </p>
              <div className="flex items-center">
                <hr className="w-[50px] bg-black mt-2"></hr>
                <p className="mt-2 ml-2">Jarmo kể lại.</p>
              </div>
            </div>
            <Image
              src="/images/humandog.png"
              alt="Corgi"
              width={200}
              height={200}
              className="w-full h-auto mt-5"
            />
            <p className="mt-2">
              Cuộc sống hiện tại của Nekku cho thấy bất cứ sinh vật nào cũng có
              nhu cầu được sống kể cả khi chúng gặp phải bất hạnh. Vì vậy, nếu
              có thể, bạn hãy giúp đỡ động vật nhiều hơn để tặng cho chúng cuộc
              sống trọn vẹn hơn nữa.
            </p>
          </div>
        </div>

        <div className="w-[30%] ">
          <div className="h-auto bg-[#F6F6F6] w-60 ">
            <h1 className="text-center mt-2 text-2xl font-bold">Category</h1>
            <hr className="border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2" />
            <button className="bg-white w-[200px] h-[44px] mt-2 hover:bg-[#D61C62] ml-4 rounded">
              <p className="text-center text-black hover:text-white">
                Volunteer activities
              </p>
            </button>
            <h1 className="text-center mt-5 text-2xl font-bold">
              Video about us
            </h1>
            <hr className="border-t border-[#6F6F6F] h-[20px] mx-auto w-1/3 mt-2" />
            <div className="ml-2">
              <iframe
                width={220}
                height={200}
                src="https://www.youtube.com/embed/ZTw49Ww18UA"
                title="Laugh Till You Cry With These Funny Animal Videos! 🤣"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="h-[40px] relative">
              <Image
                src="/images/bgfooter.png"
                alt=""
                width={1440}
                height={117}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <Renews/>
      <div
          className="h-[150px] w-full  relative bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.33)), url("/images/support.jpg")',
            backgroundSize: "120% 80%",
          }}
        >
          <div className="flex items-center justify-center gap-52">
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="text-4xl font-bold text-white">
                ARE YOU READY TO DONATE ?
              </div>
            </div>
            <button
              onClick={() => {
                router.push("/donate");
              }}
              className="bg-pink-600 text-white py-3 px-20 rounded-full font-semibold hover:bg-[#F1CC63] "
            >
              DONATE NOW
            </button>
          </div>
        </div>
    </div>
  );
};

export default Infnew;

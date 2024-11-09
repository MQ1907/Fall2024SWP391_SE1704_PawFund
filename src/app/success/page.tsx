"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";

const PaymentSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    message.success('Thank you for your donation!');
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [router]);

  return (
    <div className="mt-[148px] p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <img 
          src="/images/check.png" 
          alt="Success" 
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your donation. Your transaction has been completed successfully.
        </p>
        <p className="text-sm text-gray-500">
          You will be redirected to the homepage in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

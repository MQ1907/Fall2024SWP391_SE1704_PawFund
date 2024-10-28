"use client";

import { useRouter } from 'next/navigation';
import { Result, Button } from 'antd';

const PaymentSuccess = () =>  {
  const router = useRouter();

  return (
    <div className="mt-[148px] p-8">
      <Result
        status="success"
        title="Thank you for your donation!"
        subTitle="Your contribution will be used to take care of our pets."
        extra={[
          <Button 
            type="primary" 
            key="home"
            onClick={() => router.push('/')}
            className="bg-[#D51C63]"
          >
            Back to Home
          </Button>,
          <Button 
            key="donate"
            onClick={() => router.push('/donate')}
          >
            Donate More
          </Button>,
        ]}
      />
    </div>
  );
}
export default PaymentSuccess;

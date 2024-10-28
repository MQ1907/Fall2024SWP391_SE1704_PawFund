"use client";
import { useRouter } from 'next/navigation';
import { Result, Button } from 'antd';

const PaymentCancel = () => {
  const router = useRouter();

  return (
    <div className="mt-[148px] p-8">
      <Result
        status="error"
        title="Transaction Cancelled"
        subTitle="You have cancelled the donation transaction. You can try again or come back later."
        extra={[
          <Button 
            type="primary" 
            key="try-again"
            onClick={() => router.push('/donate')}
            className="bg-[#D51C63]"
          >
            Try Again
          </Button>,
          <Button 
            key="home"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>,
        ]}
      />
    </div>
  );
}
export default PaymentCancel;

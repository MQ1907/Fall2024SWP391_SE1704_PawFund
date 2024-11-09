import { NextResponse } from "next/server";
import PayOS from "@payos/node";

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID || "",
  process.env.PAYOS_API_KEY || "",
  process.env.PAYOS_CHECKSUM_KEY || ""
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Payment request body:', body);
    
    const orderCode = Math.floor(Math.random() * 1000000000);
    const expiredAt = Math.floor(Date.now() / 1000) + 15 * 60; // 15 phút

    // Tạo returnUrl với đầy đủ thông tin
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?userId=${body.userId}&amount=${body.amount}&description=${encodeURIComponent(body.description)}`;

    const paymentData = {
      orderCode: orderCode,
      amount: Number(body.amount),
      description: body.description,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
      returnUrl: returnUrl,
      expiredAt: expiredAt,
      signature: "",
      items: [
        {
          name: "Donate",
          quantity: 1,
          price: Number(body.amount),
        },
      ],
    };

    console.log('PayOS payment data:', paymentData);
    const paymentLink = await payOS.createPaymentLink(paymentData);

    // Gọi API backend để tạo transaction với status PENDING
    await fetch('http://localhost:8000/payment/create-payos-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: body.userId,
        amount: Number(body.amount),
        description: body.description,
        paymentId: orderCode.toString(),
        status: 'COMPLETED',
        type: 'DONATION',
        paymentMethod: 'PayOS'
      }),
    });

    return NextResponse.json({
      error: 0,
      message: "Success",
      data: {
        checkoutUrl: paymentLink.checkoutUrl,
        orderId: orderCode.toString(),
        amount: body.amount,
        userId: body.userId
      },
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      {
        error: -1,
        message: error.message || "Payment creation failed",
        data: null,
      },
      { status: 500 }
    );
  }
}

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

    const orderCode = Math.floor(Math.random() * 1000000000);

    const expiredAt = Math.floor(Date.now() / 1000) + 1 * 60;

    // Tạo payment data
    const paymentData = {
      orderCode: orderCode,
      amount: Number(body.amount),
      description: "DONATE TO PAWFUND",
      cancelUrl: body.cancelUrl,
      returnUrl: body.returnUrl,
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

    console.log("PayOS Request Data:", paymentData);

    const paymentLink = await payOS.createPaymentLink(paymentData);
    console.log("PayOS Response:", paymentLink);

    return NextResponse.json({
      error: 0,
      message: "Success",
      data: {
        checkoutUrl: paymentLink.checkoutUrl,
        orderId: orderCode.toString(),
        amount: body.amount,
      },
    });
  } catch (error: any) {
    console.error("PayOS Error:", error);
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

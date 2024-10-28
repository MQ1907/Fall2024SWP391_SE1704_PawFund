"use client";

import React from "react";
import Header from "@/app/components/header/page";
import Footer from "@/app/components/footer/page";
import ClientLayout from "@/app/ClientLayout";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <Header />
      {children}
      <Footer />
    </ClientLayout>
  );
}

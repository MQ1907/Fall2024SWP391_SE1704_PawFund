"use client";

import React from "react";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import ClientLayout from "../ClientLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <div>
      <div>
        <Header />
      </div>
      <div >
        <div>{children}</div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
    </ClientLayout>
  );
}

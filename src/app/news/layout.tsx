"use client";

import React from "react";
import Header from "../components/header/page";
import Footer from "../components/footer/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <div>{children}</div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

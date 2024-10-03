"use client";

import ClientLayout from './ClientLayout';
import Footer from "./components/footer/page";
import Header from "./components/header/page";
import Home from "./home/page";

export default function Main() {
  return (
    <ClientLayout>
      <div className="h-screen bg-white font-Poppins">
        <Header />
        <Home />
        <Footer />
      </div>
    </ClientLayout>
  );
}

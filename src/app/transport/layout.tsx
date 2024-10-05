"use client";

import React from "react";

import ShelterStaffLayout from "../ShelterStaffLayout";

import Header2 from "../components/header2/page";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ShelterStaffLayout>
      <div>
      <div>
        <Header2/>
      </div>
      <div >
        <div>{children}</div>
      </div>
     
    </div>
    </ShelterStaffLayout>
  );
}

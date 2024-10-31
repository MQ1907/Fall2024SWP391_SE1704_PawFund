"use client";

import React from "react";

import ShelterStaffLayout from "../ShelterStaffLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ShelterStaffLayout>
    
        <div>
          <div>{children}</div>
        </div>
     
    </ShelterStaffLayout>
  );
}

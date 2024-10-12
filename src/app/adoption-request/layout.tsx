"use client";

import React from "react";
import ClientLayout from "../ClientLayout";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
        <div>
    
    <div>
      <div>{children}</div>
    </div>
  
  </div>
    </ClientLayout>
  );
}

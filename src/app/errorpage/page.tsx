"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

const ErrorPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };
  const handleGoToSignIn = () => {
    router.push("/signin");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", color: "#D94E66" }}>Access Denied</h1>
      <p style={{ fontSize: "1.5rem" }}>You are not allowed to access this page.</p>
      <div className="flex gap-5">
        <Button type="primary" onClick={handleGoBack} style={{ marginTop: "20px" }}>
          Back to Home
        </Button>
        <Button type="primary" onClick={handleGoToSignIn} style={{ marginTop: "20px" }}>
          Go to Sign In
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
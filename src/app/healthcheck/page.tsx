"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

function HealthCheck() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;

        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            setRole(response.data.role);

            if (response.data.role !== "SHELTER_STAFF") {
              router.push("/errorpage");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            router.push("/error");
          }
        };

        fetchUser();
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/error");
      }
    } else {
      router.push("/error");
    }
  }, [router]);

  return (
    <div className='mt-[148px]'>HealthCheck</div>
  );
}

export default HealthCheck;
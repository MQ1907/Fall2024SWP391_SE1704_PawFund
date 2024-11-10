"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "@/lib/hook";
import { RootState } from "@/lib/store";

const PetManagement = dynamic(() => import("../pet-management/page"));
const AdoptableManagement = dynamic(
  () => import("../adoptable-management/page")
);
const CreatePet = dynamic(() => import("../create-pet/page"));
const HealcheckManagement = dynamic(
  () => import("../healthcheck-management/page")
);

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const ShelterStaff = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;

        const fetchUserRole = async () => {
          try {
            const cachedRole = localStorage.getItem(`userRole_${userId}`);
            if (cachedRole) {
              setRole(cachedRole);
              if (cachedRole !== "SHELTER_STAFF") {
                router.push("/errorpage");
              }
            } else {
              const response = await axios.get(
                `http://localhost:8000/users/${userId}`
              );
              const userRole = response.data.role;
              setRole(userRole);
              localStorage.setItem(`userRole_${userId}`, userRole);

              if (!userRole || userRole !== "SHELTER_STAFF") {
                router.push("/errorpage");
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            router.push("/errorpage");
          }
        };

        fetchUserRole();
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/errorpage");
      }
    } else {
      router.push("/errorpage");
    }
  }, [router, token]);

  const [currentView, setCurrentView] = useState<string | null>(null);

  const renderCreatePet = useCallback(
    () => (
      <div>
        <CreatePet />
      </div>
    ),
    []
  );

  const renderPetManagement = useCallback(
    () => (
      <div>
        <PetManagement />
      </div>
    ),
    []
  );

  const renderHealthCheck = useCallback(
    () => (
      <div>
        <h1>HEALCHECK MANAGEMENT</h1>
        <HealcheckManagement />
      </div>
    ),
    []
  );

  const renderAdoptableManagement = useCallback(
    () => (
      <div>
        <h1>ADOPTABLE MANAGEMENT</h1>
        <AdoptableManagement />
      </div>
    ),
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {currentView === "createPet" && renderCreatePet()}
      {currentView === "healcheckManagement" && renderHealthCheck()}
      {currentView === "petManagement" && renderPetManagement()}
      {currentView === "healthCheck" && renderHealthCheck()}
      {currentView === "adoptableManagement" && renderAdoptableManagement()}
    </div>
  );
};

export default ShelterStaff;

"use client";

import React, { useEffect, useState } from 'react';
import PetManagement from '../pet-management/page';
import AdoptableManagement from '../adoptable-management/page';
import CreatePet from '../create-pet/page';
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from '@/lib/hook';
import { RootState } from '@/lib/store';
import HealcheckManagement from '../healthcheck-management/page';
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
    const fetchUserRole = async () => {
      if (!token) {
        router.push("/errorpage");
        return;
      }
  
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;
  
        const response = await axios.get(
          `http://localhost:8000/users/${userId}`
        );
        const userRole = response.data.role;
        setRole(userRole);
  
        if (!userRole || userRole !== "SHELTER_STAFF") {
          router.push("/errorpage");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/error");
      }
    };
  
    fetchUserRole();
  }, [router, token]);
  const [currentView, setCurrentView] = useState();

  const renderCreatePet = () => (
    <div>
      <CreatePet/>
    </div>
  );

  const renderPetManagement = () => (
    <div>
      
      <PetManagement/>
    </div>
  );

  const renderHealthCheck = () => (
    <div>
    <h1>HEALCHECK MANAGEMENT</h1>
     <HealcheckManagement/>
    </div>
  );
 
  const renderAdoptableManagement = () => (
    <div>
      <h1>ADOPTABLE MANAGEMENT</h1>
      <AdoptableManagement/>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
     
      {/* <div className="flex justify-between mb-8">
        <button
          onClick={() => setCurrentView('createPet')}
          className={`px-4 py-2 ${currentView === 'createPet' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          REQUEST CREATE PET
        </button>
        <button
          onClick={() => setCurrentView('petManagement')}
          className={`px-4 py-2 ${currentView === 'petManagement' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          PET MANAGEMENT
        </button>
        <button
          onClick={() => setCurrentView('healthCheck')}
          className={`px-4 py-2 ${currentView === 'healthCheck' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          HEALTH-CHECK
        </button>
        <button
          onClick={() => setCurrentView('adoptableManagement')}
          className={`px-4 py-2 ${currentView === 'adoptableManagement' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          ADOPTABLE MANAGEMENT
        </button>
      </div> */}
      {currentView === 'createPet' && renderCreatePet()}
      {currentView === 'healcheckManagement' && renderHealthCheck()}
      {currentView === 'petManagement' && renderPetManagement()}
      {currentView === 'healthCheck' && renderHealthCheck()}
      {currentView === 'adoptableManagement' && renderAdoptableManagement()}
    </div>
  );
}

export default ShelterStaff;
"use client";

import React, { useState } from 'react';
import PetManagement from '../pet-management/page';
import AdoptableManagement from '../adoptable-management/page';
import CreatePet from '../create-pet/page';


const ShelterStaff = () => {
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
      <h2 className="text-2xl font-semibold mb-4">Health Check</h2>
      <p>Health Check functionality will be implemented here.</p>
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
      {currentView === 'petManagement' && renderPetManagement()}
      {currentView === 'healthCheck' && renderHealthCheck()}
      {currentView === 'adoptableManagement' && renderAdoptableManagement()}
    </div>
  );
}

export default ShelterStaff;

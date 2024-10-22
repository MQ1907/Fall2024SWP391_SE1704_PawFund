"use client";

import React, { useState } from "react";
import ClientLayout from "../ClientLayout";
import PetManagement from '../pet-management/page';
import AdoptableManagement from '../adoptable-management/page';

import Link from "next/link";
import HealthCheck from "../healthcheck/page";
import CreatePet from "../create-pet/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return children;
      case 'petManagement':
        return <PetManagement />;
        case 'healthCheck':
        return <HealthCheck />;
      case 'adoptableManagement':
        return <AdoptableManagement />;
      case 'createPet':
        return <CreatePet />;
      default:
        return children;
    }
  };

  const menuItemClass = "flex items-center text-gray-100 hover:bg-blue-700 px-4 py-3 rounded-lg transition-colors duration-200 w-full";

  return (
    <ClientLayout>
      <div className="flex bg-gray-100 min-h-screen">
        <aside className="w-64 bg-gradient-to-b from-gray-800 to-blue-400 min-h-screen shadow-lg">
          <div className="py-6 px-6 text-white">
            <h2 className="text-2xl font-bold">ShelterStaff Dashboard</h2>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <Link href="/" className={menuItemClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span className="ml-3">Home</span>
                </Link>
              </li>
              <li>
                <button onClick={() => setCurrentView('petManagement')} className={menuItemClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span className="ml-3">Pet Management</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('healthCheck')} className={menuItemClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-3">HealthCheck Management</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('adoptableManagement')} className={menuItemClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span className="ml-3">Adoptable Management</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('createPet')} className={menuItemClass}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="ml-3">Create Pet Request</span>
                </button>
              </li>
              {/* <li className="px-6 py-3">
                <button
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg w-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span className="ml-3">Logout</span>
                </button>
              </li> */}
            </ul>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8 bg-white shadow-lg m-4 rounded-lg">
            {renderContent()}
          </main>
        </div>
      </div>
    </ClientLayout>
  );
}

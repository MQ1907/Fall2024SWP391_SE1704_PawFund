

"use client";

import React from "react";
import Link from "next/link";
import ClientLayout from "../ClientLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <div className="flex bg-gray-100 min-h-screen">

        <aside className="w-64 bg-gray-800 min-h-screen">
          <div className="py-4 px-6 text-white">
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          </div>
          <nav className="mt-6">
            <ul>
              <li className="px-6 py-3">
                <Link href="/admin" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"></path></svg>
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li className="px-6 py-3">
                <Link href="/user" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span className="ml-3">User Management</span>
                </Link>
              </li>
              <li className="px-6 py-3">
                <button className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg w-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </ClientLayout>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import ClientLayout from "../ClientLayout";
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ClientLayout>
      <div className="flex bg-gray-100 min-h-screen">
        <aside className="w-64 bg-gray-800 min-h-screen">
          <div className="py-4 px-6 text-white">
            <h2 className="text-2xl font-semibold">Task</h2>
          </div>
          <nav className="mt-6">
            <ul>
              <li className="px-6 py-3">
                <Link href="/" className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 ${pathname === '/' ? 'bg-gray-700 text-white' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l1-1m0 0l7-7 7 7m-10 9v-6h6v6m-4 0h4"></path>
                  </svg>
                  <span className="ml-3">Home</span>
                </Link>
              </li>
              <li className="px-6 py-3">
                <Link href="/task-event" className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 ${pathname.startsWith('/task-event') ? 'bg-gray-700 text-white' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-3">Tasks & Events</span>
                </Link>
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

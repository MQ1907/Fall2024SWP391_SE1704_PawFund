"use client";

import React, { useState } from "react";
import Link from "next/link";
import ClientLayout from "../ClientLayout";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isEventOpen, setIsEventOpen] = useState(false);
  const pathname = usePathname();

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
                <Link
                  href="/"
                  className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    pathname === "/" ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l1-1m0 0l7-7 7 7m-10 9v-6h6v6m-4 0h4"
                    ></path>
                  </svg>
                  <span className="ml-3">Home</span>
                </Link>
              </li>
              <li className="px-6 py-3">
                <Link
                  href="/admin"
                  className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    pathname === "/admin" ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7h18M3 12h18M3 17h18"
                    ></path>
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li className="px-6 py-3">
                <Link
                  href="/user"
                  className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    pathname === "/user" ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <span className="ml-3">User Management</span>
                </Link>
              </li>
              <li className="px-6 py-3">
                <button
                  onClick={() => setIsEventOpen(!isEventOpen)}
                  className={`flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    pathname.startsWith("/events") ||
                    pathname.startsWith("/create-event")
                      ? "bg-gray-700 text-white"
                      : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="ml-3">Event</span>
                  <svg
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                      isEventOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {isEventOpen && (
                  <ul className="pl-4 mt-2">
                    <li className="py-2">
                      <Link
                        href="/events"
                        className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                          pathname === "/events" ? "bg-gray-700 text-white" : ""
                        }`}
                      >
                        <span className="ml-3">View Events</span>
                      </Link>
                    </li>
                    <li className="py-2">
                      <Link
                        href="/create-event"
                        className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                          pathname === "/create-event"
                            ? "bg-gray-700 text-white"
                            : ""
                        }`}
                      >
                        <span className="ml-3">Create Event</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </ClientLayout>
  );
}

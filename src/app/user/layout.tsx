"use client";
import AdminHeader from '../components/adminHeader/page';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminHeader>{children}</AdminHeader>;
}

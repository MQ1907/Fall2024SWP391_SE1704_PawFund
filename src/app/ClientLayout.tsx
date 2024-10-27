'use client';

import { AntdRegistry } from "@ant-design/nextjs-registry";
import StoreProvider from './StoreProvider';
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AntdRegistry>
        <StoreProvider>
          {children}
        </StoreProvider>
      </AntdRegistry>
    </SessionProvider>
  );
}

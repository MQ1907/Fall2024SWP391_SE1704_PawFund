'use client';

import { AntdRegistry } from "@ant-design/nextjs-registry";
import StoreProvider from './StoreProvider'; // Import StoreProvider

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <StoreProvider>
        {children}
      </StoreProvider>
    </AntdRegistry>
  );
}

import { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/shared/Sidebar';
import LoginProvider from '@/core/context/LoginProvider';
import { Layout } from 'lucide-react';
import LayoutWrapper from '@/core/wrapper/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Modern dashboard with beautiful animations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900">
        <LoginProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
        </LoginProvider>
      </body>
    </html>
  );
}
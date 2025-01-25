"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login"; 

  return (
    <div className="flex h-screen overflow-hidden ">
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default LayoutWrapper;

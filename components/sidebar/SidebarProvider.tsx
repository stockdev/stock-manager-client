'use client';
import React, { createContext, useContext, useState } from 'react';

interface SidebarContextProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeNav: string;
  setActiveNav: (name: string) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: true,
  toggleSidebar: () => {},
  activeNav: 'Dashboard',
  setActiveNav: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('Dashboard');

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, activeNav, setActiveNav }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

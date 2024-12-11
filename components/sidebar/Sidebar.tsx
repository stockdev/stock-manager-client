'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <motion.section
      className="border-r border-backcontrast min-h-full fixed shadow-xl"
      variants={{
        open: { width: '20%', transition: { duration: 0.5 } },
        closed: { width: '7%', transition: { duration: 0.5 } },
      }}
      animate={isOpen ? 'open' : 'closed'}
    >
      <SidebarHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <SidebarMenu activeNav={activeNav} setActiveNav={setActiveNav} isOpen={isOpen} />
    </motion.section>
  );
};

export default Sidebar;

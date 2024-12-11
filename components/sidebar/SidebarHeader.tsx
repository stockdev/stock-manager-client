'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from './SidebarProvider';

const SidebarHeader: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div
      className={`relative p-4 text-center flex items-center ${
        isOpen ? 'justify-start' : 'justify-center'
      }`}
    >
      <Image src={logo} alt="logo" width={50} height={50} />
      <motion.div
        className="absolute -right-4 top-1/3 bg-background rounded-full w-7 h-7 border-backcontrast border flex items-center text-palletgray justify-center hover:text-white hover:bg-backcontrast"
        onClick={toggleSidebar}
        variants={{
          open: { rotate: 180, transition: { duration: 0.3 } },
          closed: { rotate: 0, transition: { duration: 0.3 } },
        }}
        animate={isOpen ? 'open' : 'closed'}
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
      </motion.div>
    </div>
  );
};

export default SidebarHeader;

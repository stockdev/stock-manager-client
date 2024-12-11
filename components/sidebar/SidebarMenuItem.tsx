import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  name: string;
  icon: IconDefinition;
  route: string;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  activeNav: string;
  handleNavigation: (name: string, route: string) => void;
  isOpen: boolean;
  index: number;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  activeNav,
  handleNavigation,
  isOpen,
  index,
}) => (
  <motion.li
    onClick={() => handleNavigation(item.name, item.route)}
    className={`p-2 rounded-lg relative overflow-hidden cursor-pointer ${
      activeNav === item.name
        ? 'text-secondary shadow-md shadow-active/50 hover:bg-navItemActiveHover active:bg-navItemActiveClick'
        : 'hover:bg-navItemNonActiveHover active:bg-navItemNonActiveClick'
    }`}
    variants={{
      hidden: { x: -50, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: { delay: index * 0.1, duration: 0.3 },
      },
    }}
    initial="hidden"
    animate="visible"
  >
    {activeNav === item.name && (
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-navItemActiveClick"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
      />
    )}
    <div
      className={`relative flex ${
        isOpen ? 'flex-row pl-3 pr-2 py-1' : 'flex-col p-2'
      } gap-3 items-center`}
    >
      <FontAwesomeIcon icon={item.icon as any} className="w-4 h-4" />
      <span className={`${isOpen ? 'text-sm' : 'text-xs'}`}>{item.name}</span>
    </div>
  </motion.li>
);

export default SidebarMenuItem;

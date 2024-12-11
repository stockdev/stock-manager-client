import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { useRouter } from 'next/navigation';
import {
  faGauge,
  faFileAlt,
  faMapMarkerAlt,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface SidebarMenuProps {
  activeNav: string;
  setActiveNav: (name: string) => void;
  isOpen: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeNav, setActiveNav, isOpen }) => {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: faGauge, route: '/' },
    { name: 'Article', icon: faFileAlt, route: '/article' },
    { name: 'Location', icon: faMapMarkerAlt, route: '/location' },
    { name: 'Transaction', icon: faExchangeAlt, route: '/transaction' },
  ];

  const handleNavigation = (name: string, route: string) => {
    setActiveNav(name);
    router.push(route);
  };

  return (
    <div className={`${isOpen ? 'mt-2 p-4' : 'mt-2 p-2'}`}>
      <ul className="flex flex-col gap-3">
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={item.name}
            item={item}
            activeNav={activeNav}
            handleNavigation={handleNavigation}
            isOpen={isOpen}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;

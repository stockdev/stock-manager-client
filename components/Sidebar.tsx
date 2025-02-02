"use client";
import React, { useContext, useState } from "react";
import {
  LayoutDashboard,
  
  LogOut,
  BoxesIcon,
  FileText,
  MapPin,
  WalletCards,
  Users,
  ChevronLeft,
  Bell,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, link: "/" },
  { name: "Article", icon: FileText, link: "/article" },
  { name: "Locations", icon: MapPin, link: "/locations" },
  { name: "Transactions", icon: WalletCards, link: "/transactions" },
  { name: "Team", icon: Users, link: "/team" },
  { name: "Notifications", icon: Bell, link: "/notifications" },
  // { name: "Settings", icon: Settings, link: "/settings" },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const {user, logOut} = useContext(LoginContext) as LoginContextType;

  const handleNavigation = (link: string) => {
    router.push(link);
  };

  const sidebarVariants = {
    expanded: { width: "20rem" },
    collapsed: { width: "5rem" },
  };

  const menuItemVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    collapsed: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className="h-screen bg-zinc-900 relative flex flex-col shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(0,0,0,0))]" />

      <div className="relative flex items-center p-6 border-b border-white/5">
        <div className="flex items-center justify-between w-full">
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BoxesIcon className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg">
                    StockFlow
                  </span>
                  <span className="text-xs text-zinc-400">
                    Inventory Management
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 text-zinc-400  transition-transform ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="relative flex-1 px-3 py-6">
        <motion.ul
          className="space-y-1"
          initial="expanded"
          animate={isExpanded ? "expanded" : "collapsed"}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.link;
            return (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(item.link)}
                  className={`w-full flex items-center ${
                    isExpanded ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-blue-400" : ""}`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        variants={menuItemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="ml-3 font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <div className="relative p-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          } p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-white/5`}
        >
          <div
            className={`flex items-center ${!isExpanded && "justify-center"}`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BoxesIcon className="w-5 h-5 text-white" />
                  </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-zinc-900" />
            </motion.div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  variants={menuItemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-3"
                >
                  <p className="text-sm font-medium text-white">{user.fullName}</p>
                  <p className="text-xs text-zinc-400">Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                variants={menuItemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => logOut()}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-zinc-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

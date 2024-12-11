"use client";
import React from "react";
import { motion } from "framer-motion";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import { useSidebar } from "./SidebarProvider";
import SidebarUserProfile from "./SidebarUserProfile";

const Sidebar = () => {
  const { isOpen } = useSidebar();

  return (
    <motion.section
      className="border-r border-backcontrast fixed top-0 left-0 h-screen shadow-xl"
      variants={{
        open: { width: "20%", transition: { duration: 0.5 } },
        closed: { width: "7%", transition: { duration: 0.5 } },
      }}
      animate={isOpen ? "open" : "closed"}
    >
      <SidebarHeader />
      <SidebarMenu />
      <SidebarUserProfile/>
      
    </motion.section>
  );
};

export default Sidebar;

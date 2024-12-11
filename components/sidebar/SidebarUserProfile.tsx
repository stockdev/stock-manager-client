import React from "react";
import { motion } from "framer-motion";
import { useSidebar } from "./SidebarProvider";

const SidebarUserProfile: React.FC = () => {
  const { isOpen } = useSidebar();

  return (
    <motion.div
      className={`flex items-center ${
        isOpen ? "justify-start" : "justify-center"
      }  gap-4 p-4 border-t border-gray-800 absolute bottom-0 w-full `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-full items-center overflow-hidden border-2 border-yellow-500">
        <img
          src="/images/avatar.png"
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>
      {isOpen && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <span className="text-white font-semibold">Flore Denis</span>
          <span className="text-gray-400 text-sm">Admin</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SidebarUserProfile;

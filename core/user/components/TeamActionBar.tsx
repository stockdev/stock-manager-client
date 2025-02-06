"use client";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SearchBar } from "@/shared/SearchBar";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";

interface TeamActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function TeamActionBar({ searchTerm, setSearchTerm }: TeamActionBarProps) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const canCreate = user?.userRole !== "UTILIZATOR";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4 mb-6"
    >
      <SearchBar
        searchTerm={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      {canCreate && (
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.dispatchEvent(new Event("openCreateUserModal"));
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center gap-2 text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add User
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

"use client";
import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { SearchBar } from "@/shared/SearchBar";

interface NotificationActionBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const NotificationActionBar: React.FC<NotificationActionBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const handleDeleteAll = async () => {
    toast.custom((t) => (
      <div onClick={() => toast.dismiss(t)}>
        Delete All triggered!
      </div>
    ));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notifications..."
        />
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
        <button
          onClick={handleDeleteAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 border border-red-700 rounded-lg hover:bg-red-700 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Delete All</span>
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Notification Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">All Types</option>
                  {["INFORMATION", "WARNING", "ERROR"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">All Users</option>
                  {/* Exemplu de opțiuni – acestea ar trebui să provină din datele reale */}
                  <option value="1">User 1</option>
                  <option value="2">User 2</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

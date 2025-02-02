"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Mail, Phone, Shield, ChevronLeft, ChevronRight, X, Edit, Trash2 } from 'lucide-react';

enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MODERATOR = 'MODERATOR',
  HELPER = 'HELPER'
}

interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  userRole: UserRole;
}

const mockUsers: User[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    fullName: "John Doe",
    phone: "+1234567890",
    userRole: UserRole.ADMINISTRATOR
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    fullName: "Jane Smith",
    phone: "+1987654321",
    userRole: UserRole.MODERATOR
  },
  // Add more mock users as needed
];

const ITEMS_PER_PAGE = 8;

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return 'from-blue-500/20 to-blue-600/20 text-blue-400';
    case UserRole.MODERATOR:
      return 'from-purple-500/20 to-purple-600/20 text-purple-400';
    case UserRole.HELPER:
      return 'from-emerald-500/20 to-emerald-600/20 text-emerald-400';
  }
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          User Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-2"
        >
          Manage system users and their roles
        </motion.p>
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-zinc-200 placeholder-zinc-500"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add User
        </motion.button>
      </motion.div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {paginatedUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 relative group"
          >
            {/* Role Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(user.userRole)}`}>
              {user.userRole}
            </div>

            {/* User Info */}
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-white mb-2">{user.fullName}</h3>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {user.userRole}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsUpdateModalOpen(true);
                }}
                className="flex-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
              >
                <Edit className="w-4 h-4 inline-block mr-1" />
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteDialogOpen(true);
                }}
                className="flex-1 px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4 inline-block mr-1" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create/Update Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || isUpdateModalOpen) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsUpdateModalOpen(false);
                }}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {isCreateModalOpen ? 'Create New User' : 'Update User'}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    defaultValue={selectedUser?.fullName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    defaultValue={selectedUser?.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    defaultValue={selectedUser?.phone}
                  />
                </div>
                {isCreateModalOpen && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    defaultValue={selectedUser?.userRole}
                  >
                    <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                    <option value={UserRole.MODERATOR}>Moderator</option>
                    <option value={UserRole.HELPER}>Helper</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  {isCreateModalOpen ? 'Create User' : 'Update User'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete the user{' '}
                <span className="text-red-400 font-semibold">{selectedUser?.fullName}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('Deleting user:', selectedUser?.id);
                    setIsDeleteDialogOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
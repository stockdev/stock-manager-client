"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import UserService from "@/core/user/service/UserService";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Dialog } from "@/shared/Dialog";
import { UserCard } from "./UserCard";
import UpdateUserModal from "./UpdateUserModal";

const ITEMS_PER_PAGE = 12;

export function TeamUserGrid({ searchTerm }: { searchTerm: string }) {
  const { user: currentUser } = useContext(LoginContext) as LoginContextType;
  const userService = new UserService();

  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers(currentUser.jwtToken);
      setUsers(Array.isArray(data.list) ? data.list : []);
    } catch (err) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to fetch users."
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  useEffect(() => {
    fetchUsers();
    const handleUsersUpdated = () => fetchUsers();
    window.addEventListener("usersUpdated", handleUsersUpdated);
    return () => window.removeEventListener("usersUpdated", handleUsersUpdated);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleConfirmDelete = async () => {
    if (!selectedUser || !currentUser?.jwtToken) return;
    try {
      const response = await userService.deleteUser(
        selectedUser.email,
        currentUser.jwtToken
      );
      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Success"
          message={response}
          onClose={() => toast.dismiss(t)}
        />
      ));
      window.dispatchEvent(new Event("usersUpdated"));
    } catch (err) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to delete user."
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => {
              setSelectedUser(user);
              setIsUpdateModalOpen(true);
            }}
            onDelete={() => {
              setSelectedUser(user);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}

        {/* Paginare */}

        <AnimatePresence>
          {isUpdateModalOpen && selectedUser && (
            <UpdateUserModal
              userData={selectedUser}
              onClose={() => setIsUpdateModalOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isDeleteDialogOpen && selectedUser && (
            <Dialog
              message={`Are you sure you want to delete the user "${selectedUser.fullName}"? This action cannot be undone.`}
              onConfirm={handleConfirmDelete}
              onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}

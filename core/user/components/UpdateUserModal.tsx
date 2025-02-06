"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import UserService from "@/core/user/service/UserService";
import { UpdateUserRequest } from "@/core/user/dto/UpdateUserRequest";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { User } from "@/core/user/model/User";
import { UserRole } from "@/core/user/dto/UserRole";

interface UpdateUserModalProps {
  userData: User;
  onClose: () => void;
}

export default function UpdateUserModal({ userData, onClose }: UpdateUserModalProps) {
  const { user: currentUser } = useContext(LoginContext) as LoginContextType;
  const userService = new UserService();

  const [formData, setFormData] = useState<UpdateUserRequest>({
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    password: "",
    userRole: userData.userRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.jwtToken) return;
    try {
      const response = await userService.updateUser(userData.email, formData, currentUser.jwtToken);
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={typeof response === "string" ? response : "User updated successfully"}
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        window.dispatchEvent(new Event("usersUpdated"));
        onClose();
      }
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to update user"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Dacă actualizezi rolul, transformi valoarea în UserRole; pentru celelalte câmpuri, folosește valoarea primită
      [name]: name === "userRole" ? (value as UserRole) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Role</label>
            <select
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
            >
              <option value={UserRole.UTILIZATOR}>Utilizator</option>
              <option value={UserRole.MANAGER}>Manager</option>
              {/* Adaugă opțiunea ADMIN dacă dorești */}
            </select>
          </div>
          {/* Dacă dorești să permiți actualizarea parolei, poți adăuga și un câmp pentru parolă */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
          >
            Update User
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import UserService from "@/core/user/service/UserService";
import { CreateUserRequest } from "@/core/user/dto/CreateUserRequest";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { UserRole } from "../dto/UserRole";

export default function CreateUserModal({ onClose }: { onClose: () => void }) {
  const { user: currentUser } = useContext(LoginContext) as LoginContextType;
  const userService = new UserService();

  const [formData, setFormData] = useState<CreateUserRequest>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    userRole: UserRole.UTILIZATOR,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userService.register(
        formData,
        currentUser.jwtToken
      );
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={
            typeof response === "string"
              ? response
              : `User with email ${response.email} has been created.`
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        window.dispatchEvent(new Event("usersUpdated"));
        onClose();
      }
    } catch (err) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to create user."
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Role
            </label>
            <select
              name="userRole"
              value={formData.userRole}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userRole: e.target.value as UserRole,
                })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
            >
              <option value={UserRole.UTILIZATOR}>Utilizator</option>
              <option value={UserRole.MANAGER}>Manager</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
          >
            Create User
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

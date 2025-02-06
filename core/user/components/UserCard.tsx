"use client";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Edit, Trash2 } from "lucide-react";
import { User } from "@/core/user/model/User";
import { UserRole } from "@/core/user/dto/UserRole";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";

const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400";
    case UserRole.MANAGER:
      return "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400";
    case UserRole.UTILIZATOR:
      return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400";
    default:
      return "";
  }
};

const canEditUser = (
  currentRole: UserRole,
  targetRole: UserRole,
  currentUserEmail: string,
  targetUserEmail: string
): boolean => {
  if (currentUserEmail === targetUserEmail) return true;
  if (currentRole === UserRole.ADMIN) return targetRole !== UserRole.ADMIN;
  if (currentRole === UserRole.MANAGER) return targetRole === UserRole.UTILIZATOR;
  return false;
};

const canDeleteUser = (
  currentRole: UserRole,
  targetRole: UserRole,
  currentUserEmail: string,
  targetUserEmail: string
): boolean => {
  if (currentUserEmail === targetUserEmail) return false;
  if (currentRole === UserRole.ADMIN) return targetRole !== UserRole.ADMIN;
  if (currentRole === UserRole.MANAGER) return targetRole === UserRole.UTILIZATOR;
  return false;
};

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const { user: currentUser } = useContext(LoginContext) as LoginContextType;

  const showEdit = canEditUser(currentUser.userRole as UserRole, user.userRole, currentUser.email, user.email);
  const showDelete = canDeleteUser(currentUser.userRole as UserRole, user.userRole, currentUser.email, user.email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 relative group"
    >
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.userRole)}`}>
        {user.userRole}
      </div>
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
        </div>
      </div>
      {(showEdit || showDelete) && (
        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {showEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
            >
              <Edit className="w-4 h-4 inline-block mr-1" />
              Edit
            </button>
          )}
          {showDelete && (
            <button
              onClick={onDelete}
              className="flex-1 px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4 inline-block mr-1" />
              Delete
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

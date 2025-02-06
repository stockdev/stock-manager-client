"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LoadingOverlay from "@/shared/LoadingOverlay";
import { ToastMessage } from "@/core/toast/ToastMessage";
import {
  Bell,
  Info,
  AlertTriangle,
  AlertOctagon,
  Search,
  ArrowUpDown,
  User,
  Filter,
  X,
} from "lucide-react";

import { NotificationType } from "@/core/notification/dto/NotificationType";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Notification } from "@/core/notification/Notification";
import { PageHeader } from "@/shared/PageHeader";

const ITEMS_PER_PAGE = 10;

// Helper pentru a obține stilurile notificării
const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case NotificationType.INFORMATION:
      return {
        icon: <Info className="w-4 h-4" />,
        colors: "bg-blue-500/20 text-blue-400",
      };
    case NotificationType.WARNING:
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        colors: "bg-yellow-500/20 text-yellow-400",
      };
    case NotificationType.ERROR:
      return {
        icon: <AlertOctagon className="w-4 h-4" />,
        colors: "bg-red-500/20 text-red-400",
      };
    default:
      return {
        icon: <Bell className="w-4 h-4" />,
        colors: "bg-zinc-500/20 text-zinc-400",
      };
  }
};

const NotificationPage = () => {
  const { user: currentUser } = useContext(LoginContext) as LoginContextType;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<NotificationType | "">("");
  const [selectedUser, setSelectedUser] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Notification | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  // Sample data - înlocuiește cu date reale
  const sampleNotifications: Notification[] = [
    {
      id: 1,
      notificationType: NotificationType.INFORMATION,
      message: "Updated product stock quantity from 10 to 15",
      user: null,
    },
    {
      id: 2,
      notificationType: NotificationType.WARNING,
      message: "Attempted to delete product SKU-123",
      user: null,
    },
    {
      id: 3,
      notificationType: NotificationType.ERROR,
      message: "Failed to update user permissions",
      user: null,
    },
  ];

  const fetchNotifications = async () => {
    try {
      setNotifications(sampleNotifications);
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={error.message || "Failed to fetch notifications."}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filtrare
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.user?.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.user?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      !selectedType || notification.notificationType === selectedType;

    return matchesSearch && matchesType;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    // if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginare
  const totalPages = Math.ceil(sortedNotifications.length / ITEMS_PER_PAGE);
  const currentNotifications = sortedNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key: keyof Notification) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const uniqueUsers = Array.from(
    new Set(notifications.map((n) => n.user))
  ).filter((user): user is NonNullable<typeof user> => user !== null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {loading && <LoadingOverlay isVisible />}

      <PageHeader
        title="System Audit Log"
        subtitle="Track all system changes and user activities"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Notification Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value as NotificationType | "")
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">All Types</option>
                    {Object.values(NotificationType).map((type) => (
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
                    {uniqueUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("message")}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    Message
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {currentNotifications.map((notification) => {
                const { icon, colors } = getNotificationStyles(
                  notification.notificationType
                );

                return (
                  <motion.tr
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}
                      >
                        {icon}
                        {notification.notificationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {notification.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-zinc-300">
                            {notification.user?.fullName}
                          </div>
                          <div className="text-zinc-500">
                            {notification.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {currentNotifications.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
            <Bell className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">
            No notifications found
          </h3>
          <p className="text-zinc-400">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationPage;

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Bell, Info, AlertTriangle, AlertOctagon, User } from "lucide-react";
import { toast } from "sonner";
import NotificationService from "@/core/notification/service/NotificationService";
import LoadingOverlay from "@/shared/LoadingOverlay";
import { NotificationType } from "@/core/notification/dto/NotificationType";

interface NotificationTableProps {
  searchTerm: string;
}

export const NotificationTable: React.FC<NotificationTableProps> = ({ searchTerm }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });

  const notificationService = new NotificationService();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAllNotifications();
      if (typeof data !== "string") {
        setNotifications(data.list);
      } else {
        toast.custom((t) => (
          <div onClick={() => toast.dismiss(t)}>Error: {data}</div>
        ));
      }
    } catch (error: any) {
      toast.custom((t) => (
        <div onClick={() => toast.dismiss(t)}>
          {error.message || "Failed to fetch notifications."}
        </div>
      ));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filtrare simplă pe baza mesajului – se poate extinde pentru a integra filtrele din ActionBar
  const filteredNotifications = notifications.filter((notification) =>
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

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

  return (
    <div className="mt-6">
      {loading && <LoadingOverlay isVisible />}
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
                  <button onClick={() => handleSort("message")} className="flex items-center gap-2 hover:text-zinc-200">
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
              {sortedNotifications.map((notification) => {
                const { icon, colors } = getNotificationStyles(notification.notificationType);
                return (
                  <motion.tr
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
                        {icon} {notification.notificationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{notification.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-zinc-300">{notification.user?.fullName}</div>
                          <div className="text-zinc-500">{notification.user?.email}</div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
      {sortedNotifications.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
            <span>🔔</span>
          </div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">No notifications found</h3>
          <p className="text-zinc-400">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
};

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Info,
  AlertTriangle,
  AlertOctagon,
  User,
  Text,
} from "lucide-react";
import { toast } from "sonner";
import NotificationService from "@/core/notification/service/NotificationService";
import LoadingOverlay from "@/shared/LoadingOverlay";
import { NotificationType } from "@/core/notification/dto/NotificationType";
import { Pagination } from "@/shared/Pagination";
import NotificationResponse from "../dto/NotificationResponse";
import NotificationResponseList from "../dto/NotificationResponseList";
import { UserRole } from "@/core/user/dto/UserRole";

interface NotificationTableProps {
  searchTerm: string;
  selectedType: string;
}

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
export const NotificationTable: React.FC<NotificationTableProps> = ({
  searchTerm,
  selectedType,
}) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const notificationService = new NotificationService();

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getAllNotifications(
        currentPage - 1,
        pageSize,
        searchTerm,
        selectedType
      );

      if (response) {
        const data = response as NotificationResponseList;
        setNotifications(data.list);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalElements);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch notifications");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchNotifications();
  }, [searchTerm, selectedType]);

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, pageSize]);

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
      <LoadingOverlay isVisible={false} />

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
                  <span className="flex items-center gap-2 hover:text-zinc-200">
                    <Info className="w-4 h-4" />
                    Type
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span className="flex items-center gap-2 hover:text-zinc-200">
                    <Text className="w-4 h-4" />
                    Message
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span className="flex items-center gap-2 hover:text-zinc-200">
                    <User className="w-4 h-4" />
                    User
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {notifications.map((notification, index) => {
                const { icon, colors } = getNotificationStyles(
                  notification.notificationType
                );
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}
                      >
                        {icon} {notification.notificationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {notification.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col  gap-2">
                        <div className="text-sm">
                          <div className="font-medium text-zinc-300">
                            {notification.user?.fullName}
                          </div>
                          <div className="text-zinc-500">
                            {notification.user?.email}
                          </div>
                        </div>
                        <div
                          className={`text-xs rounded-full px-1 py-1 flex w-[25%] items-center justify-center    ${getRoleColor(
                            notification.user.userRole
                          )}`}
                        >
                          {notification.user.userRole}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100, 500]}
            totalItems={totalItems}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </motion.div>

      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
            <span>🔔</span>
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

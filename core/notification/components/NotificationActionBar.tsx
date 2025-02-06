import React from "react";
import { Filter, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { SearchBar } from "@/shared/SearchBar";
import NotificationService from "@/core/notification/service/NotificationService";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Dialog } from "@/shared/Dialog";

interface NotificationActionBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
}

export const NotificationActionBar: React.FC<NotificationActionBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = React.useState(false);
  const { user } = React.useContext(LoginContext) as LoginContextType;
  const notificationService = new NotificationService();

  const handleDeleteAll = async () => {
    try {
      const response = await notificationService.deleteAllNotifications(user.jwtToken);
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={
            typeof response === "string"
              ? response
              : "Notifications deleted successfully"
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={error.message || "An error occurred while deleting notifications."}
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDeleteAllDialogOpen(true)}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete All
        </motion.button>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteAllDialogOpen && (
          <Dialog
            message="Are you sure you want to delete all notifications? This action cannot be undone."
            onConfirm={handleDeleteAll}
            onCancel={() => setIsDeleteAllDialogOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

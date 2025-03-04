"use client";
import React, { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { SearchBar } from "@/shared/SearchBar";
import { ImportModal } from "@/shared/ImportForm";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { CreateEquipmentModal } from "./CreateEquipmentModal";
import { Dialog } from "@/shared/Dialog";
import UtilajService from "../service/UtilajService";

interface EquipmentActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function EquipmentActionBar({
  searchTerm,
  setSearchTerm,
}: EquipmentActionBarProps) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const utilajService = new UtilajService();
  const isAdmin = user?.userRole === "ADMIN";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File | null) => setSelectedFile(file);

  const handleCancelImport = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };

  const handleImport = async () => {
    if (!selectedFile || !user?.jwtToken) return;
    try {
      const response = await utilajService.importUtilajeFromExcel(
        selectedFile,
        user.jwtToken
      );
      if (typeof response === "string") {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Import Error"
            message={response}
            onClose={() => toast.dismiss(t)}
          />
        ));
      } else {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Import Success"
            message={`File "${selectedFile.name}" imported successfully!`}
            onClose={() => toast.dismiss(t)}
          />
        ));
        window.dispatchEvent(new Event("equipmentUpdated"));
      }
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to import file"
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsImportModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteAll = async () => {
    if (!user?.jwtToken) return;
    try {
     
      const response = await utilajService.deleteAllUtilaje(user.jwtToken);
      if (typeof response === "string" && response !== "Utilaj not found") {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success"
            message="All equipment deleted successfully"
            onClose={() => toast.dismiss(t)}
          />
        ));
        window.dispatchEvent(new Event("equipmentUpdated"));
      } else {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Error"
            message={response}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={error.message || "Failed to delete all equipment"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeleteAllDialogOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4 mb-6"
    >
      <SearchBar
        searchTerm={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search equipment..."
      />
      {isAdmin && (
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </motion.button>
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
      )}

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateEquipmentModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteAllDialogOpen && (
          <Dialog
            message="Are you sure you want to delete all equipment? This action cannot be undone."
            onConfirm={handleDeleteAll}
            onCancel={() => setIsDeleteAllDialogOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isImportModalOpen && (
          <ImportModal
            isOpen={isImportModalOpen}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onCancel={handleCancelImport}
            onImport={handleImport}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

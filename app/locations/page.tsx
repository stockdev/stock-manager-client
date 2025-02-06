"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  ArrowUpDown,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { ImportModal } from "@/components/ImportForm";
import LoadingOverlay from "@/components/LoadingOverlay";

import LocationService from "@/core/locations/service/LocationService";

import { ImportResponse } from "@/core/articles/dto/ImportResponse";
import CreateLocationRequest from "@/core/locations/dto/CreateLocationRequest";
import UpdateLocationRequest from "@/core/locations/dto/UpdateLocationRequest";
import Location from "@/core/locations/model/Location";

export default function LocationPage() {
  const { user } = useContext(LoginContext) as LoginContextType;
  const locationService = new LocationService();

  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [createForm, setCreateForm] = useState<CreateLocationRequest>({
    code: "",
  });
  const [updateForm, setUpdateForm] = useState<UpdateLocationRequest>({
    code: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Location | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const pageSizeOptions = [50, 100, 150, 250, 500];

  const isAdmin = user?.userRole === "ADMIN";

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationService.getAllLocations();
      if (typeof response !== "string") {
        setLocations(response.list || []);
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
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to fetch locations"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  // ========== Sorting, Filtering & Pagination ==========
  const filteredLocations = locations.filter((loc) =>
    loc.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: keyof Location) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
    setCurrentPage(1);
  };

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedLocations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentLocations = sortedLocations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // ========== Import Excel ==========
  const onFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const onCancelImport = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };

  const onImport = async () => {
    if (!selectedFile || !user || !user.jwtToken) return;
    setIsImporting(true);
    try {
      const response = await locationService.importLocationsFromExcel(
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
        const importResult = response as ImportResponse;
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Import Success"
            message={`File "${selectedFile.name}" imported successfully! Imported: ${importResult.importedCount}, Skipped: ${importResult.skippedRows.length}.`}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
      setIsImportModalOpen(false);
      setSelectedFile(null);
      fetchLocations();
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
      setIsImporting(false);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // ========== Delete All Locations ==========
  const handleDeleteAllConfirmed = async () => {
    if (!user || !user.jwtToken) return;
    setIsDeletingAll(true);
    try {
      const response = await locationService.deleteAllLocations(user.jwtToken);
      if (typeof response === "string") {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success"
            message="All locations deleted successfully"
            onClose={() => toast.dismiss(t)}
          />
        ));
        fetchLocations();
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
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to delete all locations"
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeletingAll(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  // ========== Create Location ==========
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.jwtToken) return;
    try {
      const response = await locationService.createLocation(
        createForm,
        user.jwtToken
      );
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={
            typeof response === "string"
              ? response
              : `Location "${response.code}" created successfully!`
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        setIsCreateModalOpen(false);
        setCreateForm({ code: "" });
        fetchLocations();
      }
    } catch {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to create location"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  // ========== Update Location ==========
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !user?.jwtToken) return;
    try {
      const response = await locationService.updateLocation(
        selectedLocation.code,
        updateForm,
        user.jwtToken
      );
      if (typeof response !== "string") {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success"
            message="Location updated successfully"
            onClose={() => toast.dismiss(t)}
          />
        ));
        setIsUpdateModalOpen(false);
        setUpdateForm({ code: "" });
        fetchLocations();
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
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to update location"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  // ========== Delete Single Location ==========
  const handleDelete = async () => {
    if (!selectedLocation || !user?.jwtToken) return;
    try {
      const response = await locationService.deleteLocationByCode(
        selectedLocation.code,
        user.jwtToken
      );
      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Success"
          message={response}
          onClose={() => toast.dismiss(t)}
        />
      ));
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
      fetchLocations();
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={(error as Error).message || "Failed to delete location"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const openUpdateModal = (loc: Location) => {
    setSelectedLocation(loc);
    setUpdateForm({ code: loc.code });
    setIsUpdateModalOpen(true);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <LoadingOverlay isVisible={isDeletingAll || isImporting} />

      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Locations Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-2"
        >
          Manage your inventory locations
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
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-zinc-200 placeholder-zinc-500"
          />
        </div>

        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isDeletingAll || isImporting}
              onClick={() => setIsCreateModalOpen(true)}
              className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                isDeletingAll || isImporting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-600 hover:to-purple-600"
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Location
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isDeletingAll || isImporting}
              onClick={() => setIsImportModalOpen(true)}
              className={`px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                isDeletingAll || isImporting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-emerald-500/30"
              }`}
            >
              <Upload className="w-4 h-4" />
              Import Excel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isDeletingAll || isImporting}
              onClick={() => setIsDeleteAllDialogOpen(true)}
              className={`px-4 py-2 bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                isDeletingAll || isImporting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-500/30"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </motion.button>
          </div>
        )}
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
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                   Id
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("code")}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    Code
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>

                {isAdmin && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {currentLocations.map((loc) => (
                <motion.tr
                  key={loc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                  className="group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {loc.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {loc.code}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openUpdateModal(loc)}
                          disabled={isDeletingAll || isImporting}
                          className={`px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors ${
                            isDeletingAll || isImporting
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLocation(loc);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={isDeletingAll || isImporting}
                          className={`px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors ${
                            isDeletingAll || isImporting
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Items per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              disabled={isDeletingAll || isImporting}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-zinc-400">
              Showing {startIndex + 1}-
              {Math.min(endIndex, sortedLocations.length)} of{" "}
              {sortedLocations.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isDeletingAll || isImporting}
              className={`p-1 rounded-lg ${
                currentPage === 1 || isDeletingAll || isImporting
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    disabled={isDeletingAll || isImporting}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    } ${
                      isDeletingAll || isImporting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages || isDeletingAll || isImporting
              }
              className={`p-1 rounded-lg ${
                currentPage === totalPages || isDeletingAll || isImporting
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                Create New Location
              </h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.code}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, code: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
               
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isDeletingAll || isImporting}
                    className={`w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-colors ${
                      isDeletingAll || isImporting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-blue-600 hover:to-purple-600"
                    }`}
                  >
                    Create Location
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Update Location</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      required
                      value={updateForm.code}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, code: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                 
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isDeletingAll || isImporting}
                    className={`w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-colors ${
                      isDeletingAll || isImporting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-blue-600 hover:to-purple-600"
                    }`}
                  >
                    Update Location
                  </motion.button>
                </div>
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
                Are you sure you want to delete the location with code{" "}
                <span className="text-red-400 font-semibold">
                  {selectedLocation?.code}
                </span>
                ? This action cannot be undone.
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
                  onClick={handleDelete}
                  disabled={isDeletingAll || isImporting}
                  className={`flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors ${
                    isDeletingAll || isImporting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete All Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteAllDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Confirm Delete All</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete all locations? This action
                cannot be undone.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDeleteAllDialogOpen(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAllConfirmed}
                  disabled={isDeletingAll || isImporting}
                  className={`flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors ${
                    isDeletingAll || isImporting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Delete All
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Excel Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
        onCancel={onCancelImport}
        onImport={onImport}
        isDragging={isDragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
    </div>
  );
}

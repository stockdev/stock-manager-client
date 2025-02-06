"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import LocationService from "@/core/locations/service/LocationService";
import Location from "@/core/locations/model/Location";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Dialog } from "@/shared/Dialog";
import UpdateLocationModal from "./UpdateLocationModal";
import { Pagination } from "@/shared/Pagination";

interface LocationsTableProps {
  searchTerm: string;
}

export function LocationsTable({ searchTerm }: LocationsTableProps) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const locationService = new LocationService();

  const [locations, setLocations] = useState<Location[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Location | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const pageSizeOptions = [50, 100, 150, 250, 500];

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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

  useEffect(() => {
    fetchLocations();
    const handleLocationsUpdated = () => fetchLocations();
    window.addEventListener("locationsUpdated", handleLocationsUpdated);
    return () =>
      window.removeEventListener("locationsUpdated", handleLocationsUpdated);
  }, []);

  const filteredLocations = locations.filter((loc) =>
    loc.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

  const handleConfirmDelete = async () => {
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
      window.dispatchEvent(new Event("locationsUpdated"));
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={(error as Error).message || "Failed to delete location"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4"></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("id")}
                  className="flex items-center gap-2 hover:text-zinc-200"
                >
                  ID
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center gap-2 hover:text-zinc-200"
                >
                  CODE
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              {user?.userRole === "ADMIN" && (
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {currentLocations.map((loc) => (
              <tr key={loc.id} className="group">
                <td className="px-6 py-4 whitespace-nowrap">{loc.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loc.code}</td>
                {user?.userRole === "ADMIN" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsUpdateModalOpen(true);
                        }}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={sortedLocations.length}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <AnimatePresence>
        {isUpdateModalOpen && selectedLocation && (
          <UpdateLocationModal
            location={selectedLocation}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteDialogOpen && selectedLocation && (
          <Dialog
            message={`Are you sure you want to delete the location with code "${selectedLocation.code}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSelectedLocation(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

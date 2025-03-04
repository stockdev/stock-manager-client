"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Dialog } from "@/shared/Dialog";
import { Pagination } from "@/shared/Pagination";
import UtilajService from "../service/UtilajService";
import UtilajResponseDTO from "../dto/UtilajResponseDTO";
import { UpdateEquipmentModal } from "./UpdateEquipmentModal";

interface EquipmentTableProps {
  searchTerm: string;
}

export function EquipmentTable({ searchTerm }: EquipmentTableProps) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const utilajService = new UtilajService();

  const [utilaje, setUtilaje] = useState<UtilajResponseDTO[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSizeOptions = [10, 25, 50, 100, 500];

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedUtilaj, setSelectedUtilaj] = useState<UtilajResponseDTO | null>(
    null
  );

  const fetchUtilaje = async () => {
    try {

      const response = await utilajService.getAllUtilaje(
        currentPage - 1,
        pageSize,
        searchTerm
      );
      if (typeof response !== "string") {
   
        setUtilaje(response.list || []);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalElements || 0);
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
          message={error.message || "Failed to fetch equipment"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  useEffect(() => {
    setCurrentPage(1); 
    fetchUtilaje();
  }, [searchTerm, pageSize]);

  useEffect(() => {
    fetchUtilaje();
  }, [currentPage]);

  useEffect(() => {
    const handleEquipmentUpdated = () => fetchUtilaje();
    window.addEventListener("equipmentUpdated", handleEquipmentUpdated);
    return () =>
      window.removeEventListener("equipmentUpdated", handleEquipmentUpdated);
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedUtilaj || !user?.jwtToken) return;
    try {
      const response = await utilajService.deleteUtilajByCode(
        selectedUtilaj.code,
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
      window.dispatchEvent(new Event("equipmentUpdated"));
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={error.message || "Failed to delete equipment"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUtilaj(null);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
             
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">
                CODE
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">
                NAME
              </th>
           
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {utilaje.map((utilaj, index) => (
              <tr key={index} className="group">
                <td className="px-6 py-4 whitespace-nowrap">{utilaj.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{utilaj.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedUtilaj(utilaj);
                        setIsUpdateModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUtilaj(utilaj);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="px-3 py-1 bg-red-500/10 text-red-400 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginare */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
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

      <AnimatePresence>
        {isUpdateModalOpen && selectedUtilaj && (
          <UpdateEquipmentModal
            utilaj={selectedUtilaj}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteDialogOpen && selectedUtilaj && (
          <Dialog
            message={`Are you sure you want to delete equipment with code "${selectedUtilaj.code}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSelectedUtilaj(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

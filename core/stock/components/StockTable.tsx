"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import StockService from "@/core/stock/service/StockService";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Dialog } from "@/shared/Dialog";
import UpdateStockModal from "./UpdateStockModal";
import { Pagination } from "@/shared/Pagination";

const ITEMS_PER_PAGE = 10;

export function StockTable({ searchTerm }: { searchTerm: string }) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const stockService = new StockService();

  const [stocks, setStocks] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [pageSize, setPageSize] = useState(50);
  const pageSizeOptions = [50, 100, 150, 250, 500];

  const fetchStocks = async () => {
    try {
      const response = await stockService.getAllStocks();
      if (typeof response !== "string") {
        setStocks(response.list || []);
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
          message="An error occurred while fetching stocks."
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  useEffect(() => {
    fetchStocks();
    const handleStocksUpdated = () => fetchStocks();
    window.addEventListener("stocksUpdated", handleStocksUpdated);
    return () =>
      window.removeEventListener("stocksUpdated", handleStocksUpdated);
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.article.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.location.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal: any, bVal: any;
    switch (sortConfig.key) {
      case "orderNumber":
        aVal = a.orderNumber;
        bVal = b.orderNumber;
        break;
      case "transactionDate":
        aVal = a.transactionDate;
        bVal = b.transactionDate;
        break;
      case "articleCode":
        aVal = a.article.code;
        bVal = b.article.code;
        break;
      case "locationCode":
        aVal = a.location.code;
        bVal = b.location.code;
        break;
      case "stockType":
        aVal = a.stockType;
        bVal = b.stockType;
        break;
      case "quantity":
        aVal = a.quantity;
        bVal = b.quantity;
        break;
      case "necessary":
        aVal = a.necessary;
        bVal = b.necessary;
        break;
      case "Id":
        aVal = a.id;
        bVal = b.id;
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStocks = filteredStocks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleConfirmDelete = async () => {
    if (!selectedStock || !user?.jwtToken) return;
    try {
      const response = await stockService.deleteStockTransaction(
        selectedStock.id,
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
      window.dispatchEvent(new Event("stocksUpdated"));
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={
            (error as Error).message || "Failed to delete stock transaction"
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedStock(null);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {(
                [
                  "Id",
                  "Transaction Date",
                  "Article Code",
                  "Location Code",
                  "Stock Type",
                  "F-RP-P",
                  "Quantity",
                  "Necessary",
                  "Order Number",
                ] as string[]
              ).map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort(header)}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    {header}
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {currentStocks.map((stock) => (
              <motion.tr
                key={stock.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {new Date(stock.transactionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.article.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.location.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      stock.stockType === "IN"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {stock.stockType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.subStockType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.necessary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {stock.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedStock(stock);
                        setIsUpdateModalOpen(true);
                      }}
                      className="p-1 hover:bg-blue-500/10 rounded"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStock(stock);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="p-1 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={sortedStocks.length}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <AnimatePresence>
        {isUpdateModalOpen && selectedStock && (
          <UpdateStockModal
            stock={selectedStock}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteDialogOpen && selectedStock && (
          <Dialog
            message={`Are you sure you want to delete the article with code "${selectedStock.article.code}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSelectedStock(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

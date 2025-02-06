"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ArrowUpDown,
  X,
  Edit,
  Trash2,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";

import StockService from "@/core/stock/service/StockService";
import { CreateStockRequest } from "@/core/stock/dto/CreateStockRequest";
import { UpdateStockRequest } from "@/core/stock/dto/UpdateStockRequest";
import { Stock } from "@/core/stock/model/Stock";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { StockType } from "@/core/stock/enums/StockType";
import { SubStockType } from "@/core/stock/enums/SubStockType";
import LoadingOverlay from "@/components/LoadingOverlay";
import { ToastMessage } from "@/core/toast/ToastMessage";

const ITEMS_PER_PAGE = 10;

export default function StockPage() {
  const { user } = useContext(LoginContext) as LoginContextType;
  const stockService = new StockService();

  // State-uri pentru date și modale
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const [formData, setFormData] = useState<Partial<{
    articleCode: string;
    locationCode: string;
    orderNumber: string;
    quantity: number;
    necessary: number;
    stockType: StockType;
    subStockType: SubStockType;
  }>>({});

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  // Funcția pentru preluarea tranzacțiilor
  const fetchStocks = async () => {
    setIsLoading(true);
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
    } catch (err: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="An error occurred while fetching stocks."
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedStocks = [...stocks].sort((a, b) => {
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

  const filteredStocks = sortedStocks.filter(
    (stock) =>
      stock.article.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.location.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStocks = filteredStocks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Funcția pentru importul fișierului Excel
  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      try {
        const result = await stockService.importStocksFromExcel(
          file,
          user.jwtToken
        );
        if (typeof result !== "string") {
          toast.custom((t) => (
            <ToastMessage
              type="success"
              title="Import Success"
              message={`File "${file.name}" imported successfully!`}
              onClose={() => toast.dismiss(t)}
            />
          ));
          fetchStocks();
        } else {
          toast.custom((t) => (
            <ToastMessage
              type="error"
              title="Import Error"
              message={result}
              onClose={() => toast.dismiss(t)}
            />
          ));
        }
      } catch (err) {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Error"
            message="An error occurred while importing the file."
            onClose={() => toast.dismiss(t)}
          />
        ));
      } finally {
        setIsImporting(false);
      }
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setFormData({});
    setSelectedStock(null);
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (stock: Stock) => {
    setSelectedStock(stock);
    setFormData({
      articleCode: stock.article.code,
      locationCode: stock.location.code,
      orderNumber: stock.orderNumber,
      quantity: stock.quantity,
      necessary: stock.necessary,
      stockType: stock.stockType,
      subStockType: stock.subStockType,
    });
    setIsUpdateModalOpen(true);
  };

  // Afișează opțiunile pentru SubStockType în funcție de StockType selectat
  const allowedSubStockTypes = (() => {
    if (formData.stockType === StockType.IN) {
      return Object.values(SubStockType).filter((s) => s !== SubStockType.P);
    } else if (formData.stockType === StockType.OUT) {
      return Object.values(SubStockType).filter((s) => s === SubStockType.P);
    } else {
      return Object.values(SubStockType);
    }
  })();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.articleCode ||
      !formData.locationCode ||
      !formData.stockType ||
      !formData.subStockType ||
      !formData.orderNumber ||
      formData.quantity === undefined ||
      formData.necessary === undefined
    ) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Validation Error"
          message="All fields are required"
          onClose={() => toast.dismiss(t)}
        />
      ));
      return;
    }

    if (isCreateModalOpen) {
      const createRequest: CreateStockRequest = {
        articleCode: formData.articleCode,
        locationCode: formData.locationCode,
        stockType: formData.stockType as StockType,
        subStockType: formData.subStockType as SubStockType,
        orderNumber: formData.orderNumber,
        quantity: Number(formData.quantity),
        necessary: Number(formData.necessary),
      };

      try {
        const result = await stockService.createStockTransaction(
          createRequest,
          user.jwtToken
        );
        if (typeof result === "string") {
          toast.custom((t) => (
            <ToastMessage
              type="error"
              title="Error"
              message={result}
              onClose={() => toast.dismiss(t)}
            />
          ));
        } else {
          toast.custom((t) => (
            <ToastMessage
              type="success"
              title="Success"
              message="Stock transaction created successfully"
              onClose={() => toast.dismiss(t)}
            />
          ));
          fetchStocks();
          setIsCreateModalOpen(false);
          setFormData({});
        }
      } catch (error) {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Error"
            message="Failed to create stock transaction"
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } else if (isUpdateModalOpen && selectedStock) {
      const updateRequest: UpdateStockRequest = {
        articleCode: formData.articleCode,
        locationCode: formData.locationCode,
        stockType: formData.stockType as StockType,
        subStockType: formData.subStockType as SubStockType,
        orderNumber: formData.orderNumber,
        quantity: Number(formData.quantity),
        necessary: Number(formData.necessary),
      };

      try {
        const result = await stockService.updateStockTransaction(
          selectedStock.id,
          updateRequest,
          user.jwtToken
        );
        if (typeof result === "string") {
          toast.custom((t) => (
            <ToastMessage
              type="error"
              title="Error"
              message={result}
              onClose={() => toast.dismiss(t)}
            />
          ));
        } else {
          toast.custom((t) => (
            <ToastMessage
              type="success"
              title="Success"
              message="Stock transaction updated successfully"
              onClose={() => toast.dismiss(t)}
            />
          ));
          fetchStocks();
          setIsUpdateModalOpen(false);
          setSelectedStock(null);
          setFormData({});
        }
      } catch (error) {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Error"
            message="Failed to update stock transaction"
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    }
  };

  // Funcția pentru ștergerea unei tranzacții
  const handleDelete = async () => {
    if (selectedStock) {
      setIsDeleting(true);
      try {
        const result = await stockService.deleteStockTransaction(
          selectedStock.id,
          user.jwtToken
        );
        if (typeof result !== "string" || result === "Stock not found") {
          toast.custom((t) => (
            <ToastMessage
              type="success"
              title="Success"
              message="Stock transaction deleted successfully"
              onClose={() => toast.dismiss(t)}
            />
          ));
          fetchStocks();
          setIsDeleteDialogOpen(false);
          setSelectedStock(null);
        } else {
          toast.custom((t) => (
            <ToastMessage
              type="error"
              title="Error"
              message={result}
              onClose={() => toast.dismiss(t)}
            />
          ));
        }
      } catch (err) {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Error"
            message="An error occurred while deleting the stock transaction."
            onClose={() => toast.dismiss(t)}
          />
        ));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Funcția pentru ștergerea tuturor tranzacțiilor
  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const result = await stockService.deleteAllStocks(user.jwtToken);
      if (typeof result !== "string" || result === "") {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success"
            message="All stock transactions have been deleted successfully"
            onClose={() => toast.dismiss(t)}
          />
        ));
        fetchStocks();
        setIsDeleteAllDialogOpen(false);
      } else {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Error"
            message={result}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (err) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="An error occurred while deleting all stock transactions."
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <LoadingOverlay isVisible={isImporting || isDeleting || isDeletingAll} />

      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Stock Transactions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-2"
        >
          Manage stock movements and inventory transactions
        </motion.p>
      </div>

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
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-zinc-200 placeholder-zinc-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Transaction
          </motion.button>
          <label className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer">
            <FileUp className="w-4 h-4" />
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("Id")} className="flex items-center gap-2 hover:text-zinc-200">
                      Id
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("transactionDate")} className="flex items-center gap-2 hover:text-zinc-200">
                      Date
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("articleCode")} className="flex items-center gap-2 hover:text-zinc-200">
                      Article Code
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("locationCode")} className="flex items-center gap-2 hover:text-zinc-200">
                      Location Code
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("stockType")} className="flex items-center gap-2 hover:text-zinc-200">
                      Stock Type
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("quantity")} className="flex items-center gap-2 hover:text-zinc-200">
                      Quantity
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("necessary")} className="flex items-center gap-2 hover:text-zinc-200">
                      Necessary
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("orderNumber")} className="flex items-center gap-2 hover:text-zinc-200">
                      Order
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
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
                          stock.stockType === StockType.IN
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {stock.stockType}
                      </span>
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
                          onClick={() => openUpdateModal(stock)}
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
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal pentru Create / Update */}
      <AnimatePresence>
        {(isCreateModalOpen || isUpdateModalOpen) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsUpdateModalOpen(false);
                  setSelectedStock(null);
                }}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {isCreateModalOpen
                  ? "New Stock Transaction"
                  : "Update Transaction"}
              </h2>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Article Code
                    </label>
                    <input
                      type="text"
                      name="articleCode"
                      value={formData.articleCode || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Location Code
                    </label>
                    <input
                      type="text"
                      name="locationCode"
                      value={formData.locationCode || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Stock Type
                    </label>
                    <select
                      name="stockType"
                      value={formData.stockType || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Select Type</option>
                      {Object.keys(StockType).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Sub Type
                    </label>
                    <select
                      name="subStockType"
                      value={formData.subStockType || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Select Sub Type</option>
                      {Object.keys(SubStockType).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Order Number
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Necessary Amount
                  </label>
                  <input
                    type="number"
                    name="necessary"
                    value={formData.necessary || ""}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  {isCreateModalOpen ? "Create Transaction" : "Update Transaction"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal pentru confirmarea ștergerii unei tranzacții */}
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
                Are you sure you want to delete the transaction with order number{" "}
                <span className="text-red-400 font-semibold">
                  {selectedStock?.orderNumber}
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
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal pentru confirmarea ștergerii tuturor tranzacțiilor */}
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
                Are you sure you want to delete all stock transactions? This action cannot be undone.
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
                  onClick={handleDeleteAll}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete All
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

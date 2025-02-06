"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import StockService from "@/core/stock/service/StockService";
import { CreateStockRequest } from "@/core/stock/dto/CreateStockRequest";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { StockType } from "@/core/stock/enums/StockType";
import { SubStockType } from "@/core/stock/enums/SubStockType";

export default function CreateStockModal({ onClose }: { onClose: () => void }) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const stockService = new StockService();
  const [formData, setFormData] = useState<CreateStockRequest>({
    articleCode: "",
    locationCode: "",
    orderNumber: "",
    quantity: 0,
    necessary: 0,
    stockType: StockType.IN,
    subStockType: SubStockType.P, 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.jwtToken) return;
    try {
      const response = await stockService.createStockTransaction(formData, user.jwtToken);
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={
            typeof response === "string"
              ? response
              : "Stock transaction created successfully"
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        window.dispatchEvent(new Event("stocksUpdated"));
        onClose();
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
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "necessary" ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">New Stock Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Article Code</label>
              <input
                type="text"
                name="articleCode"
                required
                value={formData.articleCode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Location Code</label>
              <input
                type="text"
                name="locationCode"
                required
                value={formData.locationCode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Order Number</label>
              <input
                type="text"
                name="orderNumber"
                required
                value={formData.orderNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Necessary Amount</label>
            <input
              type="number"
              name="necessary"
              required
              value={formData.necessary}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Stock Type</label>
              <select
                name="stockType"
                value={formData.stockType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
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
              <label className="block text-sm font-medium text-zinc-400 mb-1">Sub Type</label>
              <select
                name="subStockType"
                value={formData.subStockType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
          >
            Create Transaction
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

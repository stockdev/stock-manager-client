"use client";
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export interface DialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
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
        <button onClick={onCancel} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="text-zinc-400 mb-6">{message}</p>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

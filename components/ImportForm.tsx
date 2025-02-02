// components/ImportModal.tsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet, X } from "lucide-react";

export interface ImportModalProps {
  isOpen: boolean;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onCancel: () => void;
  onImport: () => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  selectedFile,
  onFileSelect,
  onCancel,
  onImport,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Import Excel File</h2>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <FileSpreadsheet className="w-8 h-8" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <button
                    onClick={() => onFileSelect(null)}
                    className="text-sm text-zinc-400 hover:text-zinc-300"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-12 h-12 text-zinc-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-300">
                      Drag and drop your Excel file here, or
                    </p>
                    <label className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
                      Browse files
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onFileSelect(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-zinc-500">Supports: .xlsx, .xls</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4">
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
                onClick={onImport}
                disabled={!selectedFile}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  selectedFile
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Import
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

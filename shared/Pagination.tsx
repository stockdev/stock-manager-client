// Pagination.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  totalItems,
}) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <div className="px-6 py-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Items per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-zinc-400">
          Showing {startIndex + 1}-{endIndex} of {totalItems}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-lg hover:bg-zinc-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === page ? "bg-blue-500 text-white" : "hover:bg-zinc-800 text-zinc-400"
            }`}
          >
            {page}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-lg hover:bg-zinc-800"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Separator
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1); // Separator
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Separator
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Separator
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${
            currentPage === 1
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {getPageNumbers().map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === -1 ? (
              <span className="px-3 py-2 text-zinc-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                {pageNum}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${
            currentPage === totalPages
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
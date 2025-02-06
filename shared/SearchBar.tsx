"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-zinc-200 placeholder-zinc-500"
      />
    </div>
  );
};

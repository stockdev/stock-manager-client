"use client";
import React, { useState } from "react";
import { PageHeader } from "@/shared/PageHeader";
import { StockActionBar } from "@/core/stock/components/StockActionBar";
import { StockTable } from "@/core/stock/components/StockTable";

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <PageHeader 
        title="Stock Transactions" 
        subtitle="Manage stock movements and inventory transactions" 
      />
      <StockActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StockTable searchTerm={searchTerm} />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/shared/PageHeader";
import { Search, X, Printer } from "lucide-react";
import { MagazieTotalResponse } from "@/core/articles/components/MagazieTotalResponse";

// Example interface for location stock data
interface LocationStock {
  locationCode: string;
  stock: number;
  consumption: number; // or string if you need "550 kg" etc.
  utilaj: string;
  obs: string;
}

// Combine total response with array of locations (mock example)
interface ArticleDataWithLocations extends MagazieTotalResponse {
  locations: LocationStock[];
}

const MagazinePage = () => {
  // Mock Data
  const mockArticleData: ArticleDataWithLocations = {
    articleName: "Steel Pipe 50mm",
    articleCode: "SP-50-001",
    stockIn: 1250,
    stockOut: 850,
    finalStock: 400,
    stockProduction: 200,
    // Mock Location Data
    locations: [
      { locationCode: "B5-3", stock: 150, consumption: 10, utilaj: "BOXMAT", obs: "" },
      { locationCode: "A7-2", stock: 120, consumption: 15, utilaj: "BOXMAT", obs: "" },
      { locationCode: "B16-1", stock: 80, consumption: 5, utilaj: "BOXMAT", obs: "Check quality" },
    ],
  };

  // State
  const [articleCode, setArticleCode] = useState("");
  const [articleData, setArticleData] = useState<ArticleDataWithLocations | null>(null);
  const [loading, setLoading] = useState(false);

  // For row selection in the locations table
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Handlers
  const handleSearch = () => {
    if (!articleCode.trim()) return;
    setLoading(true);

    // Simulate an API call
    setTimeout(() => {
      setArticleData(mockArticleData); // In reality, you'd fetch from server
      setLoading(false);
    }, 1000);
  };

  const clearFilter = () => {
    setArticleCode("");
    setArticleData(null);
    setSelectedRows(new Set()); // clear selections
  };

  const handlePrint = () => {
    if (!articleData) return;

    // If you want to open a new window and print only selected rows:
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for printing.");
      return;
    }

    // Filter down to the selected locations
    const selectedLocationData = articleData.locations.filter((loc) =>
      selectedRows.has(loc.locationCode)
    );

    // If nothing is selected, default to printing *all* rows
    const rowsToPrint = selectedLocationData.length > 0
      ? selectedLocationData
      : articleData.locations;

    // Generate minimal HTML
    printWindow.document.write(`
      <html>
        <head>
          <title>Print – ${articleData.articleCode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Magazine Report – ${articleData.articleName}</h2>
          <p>Article Code: ${articleData.articleCode}</p>
          <p>Final Stock: ${articleData.finalStock}</p>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Stock</th>
                <th>Total</th>
                <th>Consumption</th>
                <th>Utilaj</th>
                <th>Observations</th>
              </tr>
            </thead>
            <tbody>
              ${rowsToPrint
                .map(
                  (loc) => `
                    <tr>
                      <td>${loc.locationCode}</td>
                      <td>${loc.stock}</td>
                      <td>${articleData.finalStock}</td>
                      <td>${loc.consumption}</td>
                      <td>${loc.utilaj}</td>
                      <td>${loc.obs}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          <p style="margin-top:1rem;">Printed on: ${new Date().toLocaleDateString()}</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Toggle selection for each row in the table
  const toggleRowSelection = (locationCode: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(locationCode)) {
      newSelectedRows.delete(locationCode);
    } else {
      newSelectedRows.add(locationCode);
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* Page Header */}
      <PageHeader 
        title="Magazine Management" 
        subtitle="Manage your magazine items" 
      />

      {/* Search Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <input
                id="articleCode"
                type="text"
                placeholder="Enter article code..."
                value={articleCode}
                onChange={(e) => setArticleCode(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white pl-10"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                size={18}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Search</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilter}
              className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <X size={18} />
              <span>Clear</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              disabled={!articleData}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <Printer size={18} />
              <span>Print</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Cards + Table */}
      {articleData && (
        <>
          {/* Card-like summary of main stock info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col min-w-[140px] bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-xs text-zinc-400 mb-1">Article Name</span>
                <span className="text-sm font-medium">{articleData.articleName}</span>
              </div>

              <div className="flex flex-col min-w-[140px] bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-xs text-zinc-400 mb-1">Article Code</span>
                <span className="text-sm font-medium">{articleData.articleCode}</span>
              </div>

              <div className="flex flex-col min-w-[140px] bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-xs text-zinc-400 mb-1">Stock In</span>
                <span className="text-sm font-medium text-green-400">
                  {articleData.stockIn}
                </span>
              </div>

              <div className="flex flex-col min-w-[140px] bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-xs text-zinc-400 mb-1">Stock Out</span>
                <span className="text-sm font-medium text-red-400">
                  {articleData.stockOut}
                </span>
              </div>

              <div className="flex flex-col min-w-[140px] bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-xs text-zinc-400 mb-1">Production</span>
                <span className="text-sm font-medium text-blue-400">
                  {articleData.stockProduction}
                </span>
              </div>

              <div className="flex flex-col min-w-[140px] bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-xs text-zinc-400 mb-1">Final Stock</span>
                <span className="text-sm font-medium text-yellow-400">
                  {articleData.finalStock}
                </span>
              </div>
            </div>
          </div>

          {/* Table of locations */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-3 py-2 w-[50px]">Select</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Consumption</th>
                  <th className="px-3 py-2">Utilaj</th>
                  <th className="px-3 py-2">OBS</th>
                </tr>
              </thead>
              <tbody>
                {articleData.locations.map((loc) => (
                  <tr key={loc.locationCode} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(loc.locationCode)}
                        onChange={() => toggleRowSelection(loc.locationCode)}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 bg-zinc-800 border-zinc-600"
                      />
                    </td>
                    <td className="px-3 py-2">{loc.locationCode}</td>
                    <td className="px-3 py-2">{loc.stock}</td>
                    <td className="px-3 py-2">{articleData.finalStock}</td>
                    <td className="px-3 py-2">{loc.consumption}</td>
                    <td className="px-3 py-2">{loc.utilaj}</td>
                    <td className="px-3 py-2">{loc.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MagazinePage;

"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import ArticleService from "@/core/articles/service/ArticleService";
import Article from "@/core/articles/model/Article";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import { Dialog } from "@/shared/Dialog";
import { UpdateArticleModal } from "./UpdateArticleModal";
import { Pagination } from "@/shared/Pagination";

interface ArticlesTableProps {
  searchTerm: string;
}

export function ArticlesTable({ searchTerm }: ArticlesTableProps) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const articleService = new ArticleService();

  const [articles, setArticles] = useState<Article[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const pageSizeOptions = [50, 100, 150, 250, 500];

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchArticles = async () => {
    try {
      const response = await articleService.getAllArticles();
      if (typeof response !== "string") {
        setArticles(response.list || []);
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
          message="Failed to fetch articles"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  useEffect(() => {
    fetchArticles();
    const handleArticlesUpdated = () => fetchArticles();
    window.addEventListener("articlesUpdated", handleArticlesUpdated);
    return () =>
      window.removeEventListener("articlesUpdated", handleArticlesUpdated);
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedArticles.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentArticles = sortedArticles.slice(startIndex, endIndex);

  const handleSort = (key: keyof Article) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArticle || !user?.jwtToken) return;
    try {
      const response = await articleService.deleteArticleByCode(
        selectedArticle.code,
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
      window.dispatchEvent(new Event("articlesUpdated"));
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={(error as Error).message || "Failed to delete article"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {(["id", "code", "name"] as (keyof Article)[]).map((key) => (
                <th
                  key={key}
                  className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase"
                >
                  <button
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    {key.toUpperCase()}
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
            {currentArticles.map((article) => (
              <tr key={article.id} className="group">
                <td className="px-6 py-4 whitespace-nowrap">{article.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{article.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{article.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedArticle(article);
                        setIsUpdateModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedArticle(article);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="px-3 py-1 bg-red-500/10 text-red-400 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={sortedArticles.length}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <AnimatePresence>
        {isUpdateModalOpen && selectedArticle && (
          <UpdateArticleModal
            article={selectedArticle}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteDialogOpen && selectedArticle && (
          <Dialog
            message={`Are you sure you want to delete the article with code "${selectedArticle.code}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSelectedArticle(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

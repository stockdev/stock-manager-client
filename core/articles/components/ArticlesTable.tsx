"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSizeOptions = [10, 25, 50, 100, 500];

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Funcția de fetch a articolelor; trimite parametrii necesari către API
  const fetchArticles = async () => {
    try {
      console.log("Fetching articles with:", {
        currentPage,
        pageSize,
        searchTerm,
      });
      const response = await articleService.getAllArticles(
        currentPage - 1,
        pageSize,
        searchTerm
      );
      console.log("Response:", response);
      if (typeof response !== "string") {
        setArticles(response.list || []);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements);
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
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={(error as Error).message || "Failed to fetch articles"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchArticles();
  }, [searchTerm, pageSize]);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

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

  useEffect(() => {
    const handleArticlesUpdated = () => fetchArticles();
    window.addEventListener("articlesUpdated", handleArticlesUpdated);
    return () =>
      window.removeEventListener("articlesUpdated", handleArticlesUpdated);
  }, []);

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
                  <span className="flex items-center gap-2 hover:text-zinc-200">
                    {key.toUpperCase()}
                  </span>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {articles.map((article) => (
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
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
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

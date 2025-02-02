// pages/ArticlePage.tsx
"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  ArrowUpDown,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { LoginContext } from "@/core/context/LoginProvider";
import ArticleService from "@/core/articles/service/ArticleService";
import LoginContextType from "@/core/context/LoginContextType";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { ImportModal } from "@/components/ImportForm";
import Article from "@/core/articles/model/Article";
import { CreateArticleRequest } from "@/core/articles/dto/CreateArticleRequest";
import { UpdateArticleRequest } from "@/core/articles/dto/UpdateArticleRequest";




export default function ArticlePage() {
  const { user } = useContext(LoginContext) as LoginContextType;
  const articleService = new ArticleService();

  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [createForm, setCreateForm] = useState<CreateArticleRequest>({
    name: "",
    code: "",
  });
  const [updateForm, setUpdateForm] = useState<UpdateArticleRequest>({
    name: "",
    code: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Stări pentru importul fișierului
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isAdmin = user?.userRole === "ADMIN";

  useEffect(() => {
    fetchArticles();
  }, []);

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

  const handleSort = (key: keyof Article) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Funcțiile pentru import folosind ImportModal
  const onFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const onCancelImport = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };

  const onImport = async () => {
    if (!selectedFile || !user || !user.jwtToken) return;

    try {
      // Apelează logica ta de import (exemplu: articleService.importArticles)
      console.log("Importing file:", selectedFile.name);
      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Success"
          message={`File "${selectedFile.name}" imported successfully!`}
          onClose={() => toast.dismiss(t)}
        />
      ));
      setIsImportModalOpen(false);
      setSelectedFile(null);
      fetchArticles(); // Actualizează lista de articole după import
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to import file"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteAllConfirmed = async () => {
    if (!user || !user.jwtToken) return;
    try {
      const response = await articleService.deleteAllArticles(user.jwtToken);
      if (typeof response === "string" && response !== "Article not found") {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success"
            message="All articles deleted successfully"
            onClose={() => toast.dismiss(t)}
          />
        ));
        fetchArticles();
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
          message="Failed to delete all articles"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
    setIsDeleteAllDialogOpen(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.jwtToken) return;

    try {
      const response = await articleService.createArticle(
        createForm,
        user.jwtToken
      );
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={
            typeof response === "string"
              ? response
              : `Article "${response.name}" created successfully!`
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        setIsCreateModalOpen(false);
        setCreateForm({ name: "", code: "" });
        fetchArticles();
      }
    } catch {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to create article"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    try {
      const response = await articleService.updateArticle(
        selectedArticle.id,
        updateForm,
        user.jwtToken
      );
      if (typeof response !== "string") {
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success"
            message="Article updated successfully"
            onClose={() => toast.dismiss(t)}
          />
        ));
        setIsUpdateModalOpen(false);
        setUpdateForm({ name: "", code: "" });
        fetchArticles();
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
          message="Failed to update article"
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;

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
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
      fetchArticles();
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message={(error as Error).message || "Failed to delete article"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const openUpdateModal = (article: Article) => {
    setSelectedArticle(article);
    setUpdateForm({ name: article.name, code: article.code });
    setIsUpdateModalOpen(true);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Articles Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-2"
        >
          Manage your inventory articles
        </motion.p>
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-zinc-200 placeholder-zinc-500"
          />
        </div>
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Article
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Import Excel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDeleteAllDialogOpen(true)}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    Id
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("code")}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    Code
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-zinc-200"
                  >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {sortedArticles.map((article) => (
                <motion.tr
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                  className="group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {article.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {article.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {article.name}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openUpdateModal(article)}
                          className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArticle(article);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Create New Article</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.code}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, code: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    Create Article
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Update Article</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      required
                      value={updateForm.code}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, code: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={updateForm.name}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    Update Article
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog for un articol */}
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete the article with code{" "}
                <span className="text-red-400 font-semibold">
                  {selectedArticle?.code}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete All Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteAllDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Confirm Delete All</h2>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete all articles? This action cannot
                be undone.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDeleteAllDialogOpen(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAllConfirmed}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete All
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImportModal
        isOpen={isImportModalOpen}
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
        onCancel={onCancelImport}
        onImport={onImport}
        isDragging={isDragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
    </div>
  );
}

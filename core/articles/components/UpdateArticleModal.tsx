// UpdateArticleModal.tsx
"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import ArticleService from "@/core/articles/service/ArticleService";
import { UpdateArticleRequest } from "@/core/articles/dto/UpdateArticleRequest";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";
import Article from "@/core/articles/model/Article";

export function UpdateArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const articleService = new ArticleService();
  const [updateForm, setUpdateForm] = useState<UpdateArticleRequest>({ name: article.name, code: article.code });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.jwtToken) return;
    try {
      const response = await articleService.updateArticle(article.id, updateForm, user.jwtToken);
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={typeof response === "string" ? response : "Article updated successfully"}
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        window.dispatchEvent(new Event("articlesUpdated"));
        onClose();
      }
    } catch {
      toast.custom((t) => (
        <ToastMessage type="error" title="Error" message="Failed to update article" onClose={() => toast.dismiss(t)} />
      ));
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Update Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Code</label>
            <input
              type="text"
              required
              value={updateForm.code}
              onChange={(e) => setUpdateForm({ ...updateForm, code: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
            <input
              type="text"
              required
              value={updateForm.name}
              onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
            />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            Update Article
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

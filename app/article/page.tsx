"use client";
import React, { useState } from "react";
import { PageHeader } from "@/shared/PageHeader";
import { ArticleActionBar } from "@/core/articles/components/ArticleActionBar";
import { ArticlesTable } from "@/core/articles/components/ArticlesTable";

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <PageHeader 
        title="Articles Management" 
        subtitle="Manage your inventory articles" 
      />
      <ArticleActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ArticlesTable searchTerm={searchTerm} />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { PageHeader } from "@/shared/PageHeader";
import { TeamUserGrid } from "@/core/user/components/TeamUserGrid";
import { TeamActionBar } from "@/core/user/components/TeamActionBar";

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <PageHeader
        title="User Management" 
        subtitle="Manage system users and their roles" 
      />
      <TeamActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TeamUserGrid searchTerm={searchTerm} />
    </div>
  );
}

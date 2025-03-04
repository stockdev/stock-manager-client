"use client";
import React, { useState } from "react";
import { PageHeader } from "@/shared/PageHeader";
import { EquipmentActionBar } from "@/core/utilaje/components/EquipmentActionBar";
import { EquipmentTable } from "@/core/utilaje/components/EquipmentTable";


export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <PageHeader 
        title="Equipment Management" 
        subtitle="Manage your equipment inventory" 
      />
      <EquipmentActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <EquipmentTable searchTerm={searchTerm} />
    </div>
  );
}

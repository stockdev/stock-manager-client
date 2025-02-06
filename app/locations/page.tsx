"use client";
import React, { useState } from "react";
import { PageHeader } from "@/shared/PageHeader";
import { LocationActionBar } from "@/core/locations/components/LocationActionBar";
import { LocationsTable } from "@/core/locations/components/LocationTable";

export default function LocationPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <PageHeader 
        title="Locations Management" 
        subtitle="Manage your inventory locations" 
      />
      <LocationActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <LocationsTable searchTerm={searchTerm} />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { PageHeader } from "@/shared/PageHeader";
import { NotificationTable } from "@/core/notification/components/NotificationTable";
import { NotificationActionBar } from "@/core/notification/components/NotificationActionBar";

export default function NotificationPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <PageHeader 
        title="Notifications Management" 
        subtitle="Manage your system notifications" 
      />
      <NotificationActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <NotificationTable searchTerm={searchTerm} />
    </div>
  );
}

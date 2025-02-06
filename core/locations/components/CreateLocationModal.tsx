"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import LocationService from "@/core/locations/service/LocationService";
import CreateLocationRequest from "@/core/locations/dto/CreateLocationRequest";
import { ToastMessage } from "@/core/toast/ToastMessage";
import { LoginContext } from "@/core/context/LoginProvider";
import LoginContextType from "@/core/context/LoginContextType";

export default function CreateLocationModal({ onClose }: { onClose: () => void }) {
  const { user } = useContext(LoginContext) as LoginContextType;
  const locationService = new LocationService();
  const [createForm, setCreateForm] = useState<CreateLocationRequest>({ code: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.jwtToken) return;
    try {
      const response = await locationService.createLocation(createForm, user.jwtToken);
      toast.custom((t) => (
        <ToastMessage
          type={typeof response === "string" ? "error" : "success"}
          title={typeof response === "string" ? "Error" : "Success"}
          message={
            typeof response === "string"
              ? response
              : `Location "${response.code}" created successfully!`
          }
          onClose={() => toast.dismiss(t)}
        />
      ));
      if (typeof response !== "string") {
        // Notificăm restul aplicației că s-au actualizat locațiile
        window.dispatchEvent(new Event("locationsUpdated"));
        onClose();
      }
    } catch (error) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to create location"
          onClose={() => toast.dismiss(t)}
        />
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
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Create New Location</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Code</label>
            <input
              type="text"
              required
              value={createForm.code}
              onChange={(e) => setCreateForm({ code: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
          >
            Create Location
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

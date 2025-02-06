"use client";
import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-400 mt-2"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};
 
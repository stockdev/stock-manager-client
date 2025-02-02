"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Package,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const stockMovements = [
  { name: 'Jan', entry: 400, exit: 240 },
  { name: 'Feb', entry: 300, exit: 139 },
  { name: 'Mar', entry: 200, exit: 980 },
  { name: 'Apr', entry: 278, exit: 390 },
  { name: 'May', entry: 189, exit: 480 },
  { name: 'Jun', entry: 239, exit: 380 },
];

const locationDistribution = [
  { name: 'Warehouse A', value: 400 },
  { name: 'Warehouse B', value: 300 },
  { name: 'Warehouse C', value: 200 },
  { name: 'Warehouse D', value: 100 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 mt-2"
        >
          Real-time insights into your inventory management
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total Stock Value</p>
              <h3 className="text-2xl font-bold mt-1">$124,892</h3>
              <div className="flex items-center mt-2 text-emerald-400 text-sm">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>12.5% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Active Locations</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
              <div className="flex items-center mt-2 text-emerald-400 text-sm">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>4 new this month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Low Stock Items</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
              <div className="flex items-center mt-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>Needs attention</span>
              </div>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Monthly Transactions</p>
              <h3 className="text-2xl font-bold mt-1">847</h3>
              <div className="flex items-center mt-2 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>23.5% increase</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Stock Movements</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMovements}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181B',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="entry" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exit" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Stock by Location</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {locationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181B',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {locationDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-zinc-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
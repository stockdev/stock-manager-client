'use client';

import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import UserService from '@/core/user/service/UserService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { LoginContext } from '@/core/context/LoginProvider';
import LoginContextType from '@/core/context/LoginContextType';

export default function Login() {
  const { setUserCookie } = useContext(LoginContext) as LoginContextType;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userService = new UserService();
      const loginResponse = await userService.login({ email, password });
      setUserCookie(loginResponse);
      toast.success('Welcome back! Login successful.', {
        position: 'top-center',
        autoClose: 3000,
      });
      router.push('/');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to login', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400"
          >
            Sign in to your account
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2 text-white font-medium"
            >
              {loading ? 'Signing In...' : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

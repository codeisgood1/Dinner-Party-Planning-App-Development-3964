import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // First check for admin session in localStorage (from our direct login)
      const adminSession = localStorage.getItem('admin-session');
      if (adminSession) {
        const adminUser = JSON.parse(adminSession);
        if (adminUser && adminUser.isAdmin) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }

      // Fall back to checking Supabase if direct admin session not found
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if Supabase is properly configured
      if (!supabase.from) {
        console.warn('Supabase not configured properly');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admins_xyz123')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error || !adminData || adminData.role !== 'super_admin') {
        console.log('Admin access denied:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-cream-50"
    >
      <Outlet />
    </motion.div>
  );
};

export default AdminLayout;
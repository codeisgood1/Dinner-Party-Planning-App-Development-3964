import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiMenu, FiX, FiHome, FiUsers, FiCalendar, FiSettings, FiBarChart2, FiShield, FiLogOut } = FiIcons;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // First check for admin session in localStorage
      const adminSession = localStorage.getItem('admin-session');
      if (adminSession) {
        try {
          const adminUser = JSON.parse(adminSession);
          if (adminUser && adminUser.isAdmin) {
            setIsAdmin(true);
            setAdminRole(adminUser.role || 'admin');
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing admin session', e);
        }
      }

      // If no valid admin session found, check Supabase
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
        .from('admins_3tqfm7')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error || !adminData) {
        console.log('Admin access denied:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
        setAdminRole(adminData.role);
        
        // Store admin session
        const adminUser = {
          ...user,
          isAdmin: true,
          role: adminData.role
        };
        localStorage.setItem('admin-session', JSON.stringify(adminUser));
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('admin-session');
      toast.success('Logged out from admin panel');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path) => {
    return location.pathname === path ? 'bg-coral-100 text-coral-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-coral-500 flex items-center justify-center">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-xs text-gray-500">
                  {adminRole === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow p-5 overflow-y-auto">
            <nav className="space-y-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-4 py-3 rounded-lg transition ${isActive('/admin/dashboard')}`}
              >
                <SafeIcon icon={FiHome} className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={`flex items-center px-4 py-3 rounded-lg transition ${isActive('/admin/users')}`}
              >
                <SafeIcon icon={FiUsers} className="w-5 h-5 mr-3" />
                User Management
              </Link>
              <Link
                to="/admin/events"
                className={`flex items-center px-4 py-3 rounded-lg transition ${isActive('/admin/events')}`}
              >
                <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-3" />
                Event Management
              </Link>
              <Link
                to="/admin/reports"
                className={`flex items-center px-4 py-3 rounded-lg transition ${isActive('/admin/reports')}`}
              >
                <SafeIcon icon={FiBarChart2} className="w-5 h-5 mr-3" />
                Analytics & Reports
              </Link>
              {adminRole === 'super_admin' && (
                <Link
                  to="/admin/settings"
                  className={`flex items-center px-4 py-3 rounded-lg transition ${isActive('/admin/settings')}`}
                >
                  <SafeIcon icon={FiSettings} className="w-5 h-5 mr-3" />
                  System Settings
                </Link>
              )}
            </nav>
          </div>

          <div className="p-5 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <span className="text-coral-800 font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 md:hidden z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600"
        >
          <SafeIcon icon={sidebarOpen ? FiX : FiMenu} className="w-6 h-6" />
        </button>
      </div>

      {/* Main content */}
      <motion.div
        className="flex-1 md:ml-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="min-h-screen p-4 sm:p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
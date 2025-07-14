import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';

const { 
  FiLock, 
  FiMail, 
  FiShield, 
  FiAlertTriangle,
  FiUser
} = FiIcons;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For demo purposes, we'll use a hardcoded credential check
      if (email === 'admin@dinnerdoodle.com' && password === 'admin123') {
        // Store admin session in localStorage
        const adminUser = {
          id: 'admin-1',
          email: email,
          name: 'Admin User',
          isAdmin: true,
          role: 'admin'
        };
        localStorage.setItem('admin-session', JSON.stringify(adminUser));
        toast.success('Welcome to Admin Panel!');
        navigate('/admin/dashboard');
        return;
      }

      // Try Supabase auth if hardcoded credentials don't match
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: adminData, error: adminError } = await supabase
        .from('admins_3tqfm7')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        throw new Error('Access denied: Not an admin user');
      }

      // Store admin session
      const adminUser = {
        ...data.user,
        isAdmin: true,
        role: adminData.role
      };
      localStorage.setItem('admin-session', JSON.stringify(adminUser));

      toast.success('Welcome to Admin Panel!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials or access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the administration dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                required
              />
              <SafeIcon icon={FiMail} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                required
              />
              <SafeIcon icon={FiLock} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-cream-50 p-4 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-coral-500 mr-2" />
              <div className="text-sm">
                <p className="font-medium">Demo Credentials:</p>
                <p>Email: admin@dinnerdoodle.com</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral-500 text-white py-2 rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-coral-600 hover:text-coral-700 text-sm">
            Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Add the missing default export
export default AdminLogin;
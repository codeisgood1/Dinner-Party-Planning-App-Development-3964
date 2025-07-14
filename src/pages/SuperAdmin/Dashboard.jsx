import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUsers, FiCalendar, FiTrendingUp, FiActivity, FiUserX, FiSearch, FiRefreshCw } = FiIcons;

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    totalGuests: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // Check if Supabase is properly configured
      if (!supabase.from) {
        console.warn('Supabase not configured properly');
        navigate('/');
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admins_xyz123')
        .select('role')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (error || !adminData || adminData.role !== 'super_admin') {
        toast.error('Access denied');
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Check if Supabase is properly configured
      if (!supabase.from) {
        // Use mock data if Supabase isn't configured
        setStats({
          totalUsers: 186,
          activeUsers: 85,
          totalEvents: 65,
          totalGuests: 320
        });
        setRecentUsers([
          {
            id: '1',
            users: {
              email: 'demo@example.com',
              created_at: new Date().toISOString()
            },
            total_events: 3,
            total_guests: 15,
            account_status: 'active'
          }
        ]);
        setGrowthData([
          {
            date: '2024-01-01',
            daily_active_users: 50,
            new_users: 10,
            total_events: 30
          },
          {
            date: '2024-01-02',
            daily_active_users: 55,
            new_users: 12,
            total_events: 35
          },
          {
            date: '2024-01-03',
            daily_active_users: 60,
            new_users: 15,
            total_events: 40
          }
        ]);
        setLoading(false);
        return;
      }

      // Fetch real data if Supabase is configured
      const { data: metrics } = await supabase
        .from('platform_metrics_xyz123')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      const { data: users } = await supabase
        .from('user_metrics_xyz123')
        .select(`
          *,
          users:user_id (
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: growth } = await supabase
        .from('platform_metrics_xyz123')
        .select('date, daily_active_users, new_users, total_events')
        .order('date', { ascending: true })
        .limit(30);

      setStats({
        totalUsers: metrics?.total_users || 0,
        activeUsers: metrics?.daily_active_users || 0,
        totalEvents: metrics?.total_events || 0,
        totalGuests: metrics?.total_guests || 0
      });
      setRecentUsers(users || []);
      setGrowthData(growth || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      if (!supabase.from) {
        toast.error('Search not available - Supabase not configured');
        return;
      }

      const { data: users, error } = await supabase
        .from('user_metrics_xyz123')
        .select(`
          *,
          users:user_id (
            email,
            created_at
          )
        `)
        .ilike('users.email', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setRecentUsers(users);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;

    try {
      if (!supabase.from) {
        toast.error('Action not available - Supabase not configured');
        return;
      }

      const { error } = await supabase
        .from('user_metrics_xyz123')
        .update({ account_status: 'suspended' })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('User suspended successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const getGrowthChartOptions = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Active Users', 'New Users', 'Events']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: growthData.map(d => d.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Active Users',
        type: 'line',
        data: growthData.map(d => d.daily_active_users),
        smooth: true,
        lineStyle: {
          color: '#FF6B6B'
        }
      },
      {
        name: 'New Users',
        type: 'bar',
        data: growthData.map(d => d.new_users),
        itemStyle: {
          color: '#4ECDC4'
        }
      },
      {
        name: 'Events',
        type: 'line',
        data: growthData.map(d => d.total_events),
        smooth: true,
        lineStyle: {
          color: '#FFE66D'
        }
      }
    ]
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage platform metrics and users</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="w-5 h-5 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-coral-100 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-coral-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-sage-100 rounded-lg">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-sage-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-golden-100 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-golden-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-peach-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-peach-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Guests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalGuests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Growth</h2>
        <ReactECharts
          option={getGrowthChartOptions()}
          style={{ height: '400px' }}
          className="w-full"
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <form onSubmit={handleUserSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by email..."
              className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-coral-500 text-white rounded-r-lg hover:bg-coral-600 transition-colors"
            >
              <SafeIcon icon={FiSearch} className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-coral-100 flex items-center justify-center">
                          <span className="text-coral-600 font-medium">
                            {user.users?.email?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.users?.email || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">
                          Joined {user.users?.created_at ? new Date(user.users.created_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.total_events}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.total_guests}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.account_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.account_status === 'active' ? (
                      <button
                        onClick={() => handleSuspendUser(user.user_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <SafeIcon icon={FiUserX} className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSuspendUser(user.user_id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <SafeIcon icon={FiUsers} className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
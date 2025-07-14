import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUsers, FiCalendar, FiTrendingUp, FiActivity, FiRefreshCw, FiAlertCircle } = FiIcons;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    totalGuests: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [adminRole, setAdminRole] = useState('');

  useEffect(() => {
    checkAdminRole();
    fetchDashboardData();
  }, []);

  const checkAdminRole = async () => {
    try {
      if (!supabase.from) {
        setAdminRole('admin');
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admins_3tqfm7')
        .select('role')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (error || !adminData) {
        setAdminRole('admin');
      } else {
        setAdminRole(adminData.role);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setAdminRole('admin');
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
            user_id: 'user1',
            email: 'demo@example.com',
            created_at: new Date().toISOString(),
            total_events: 3,
            total_guests: 15,
            account_status: 'active'
          }
        ]);
        generateMockGrowthData();
        setLoading(false);
        return;
      }

      // Fetch platform metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('platform_metrics_3tqfm7')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') {
        console.error('Error fetching metrics:', metricsError);
      }

      // Fetch recent users with activity data
      const { data: userData, error: userError } = await supabase
        .from('user_activity_3tqfm7')
        .select(`
          *,
          user:user_id (
            email,
            created_at
          )
        `)
        .order('last_login_at', { ascending: false })
        .limit(10);

      if (userError) {
        console.error('Error fetching users:', userError);
      }

      // Fetch growth data for the chart
      const { data: growthData, error: growthError } = await supabase
        .from('platform_metrics_3tqfm7')
        .select('date, daily_active_users, new_users, total_events')
        .order('date', { ascending: true })
        .limit(30);

      if (growthError) {
        console.error('Error fetching growth data:', growthError);
        generateMockGrowthData();
      } else if (growthData && growthData.length > 0) {
        setGrowthData(growthData);
      } else {
        generateMockGrowthData();
      }

      if (metricsData) {
        setStats({
          totalUsers: metricsData.total_users || 0,
          activeUsers: metricsData.daily_active_users || 0,
          totalEvents: metricsData.total_events || 0,
          totalGuests: metricsData.total_guests || 0
        });
      } else {
        // Use mock data if no metrics are available
        setStats({
          totalUsers: 186,
          activeUsers: 85,
          totalEvents: 65,
          totalGuests: 320
        });
      }

      if (userData && userData.length > 0) {
        setRecentUsers(userData);
      } else {
        // Use mock data if no user data is available
        setRecentUsers([
          {
            id: '1',
            user_id: 'user1',
            user: { email: 'demo@example.com', created_at: new Date().toISOString() },
            last_login_at: new Date().toISOString(),
            account_status: 'active',
            login_count: 5
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set mock data in case of error
      setStats({
        totalUsers: 186,
        activeUsers: 85,
        totalEvents: 65,
        totalGuests: 320
      });
      generateMockGrowthData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockGrowthData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      data.push({
        date: dateStr,
        daily_active_users: Math.floor(Math.random() * 30) + 50,
        new_users: Math.floor(Math.random() * 10) + 5,
        total_events: Math.floor(Math.random() * 20) + 30
      });
    }
    setGrowthData(data);
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
      data: growthData.map(d => d.date.substring(5)), // Format as MM-DD
      axisLabel: {
        interval: 6 // Show every 7th label
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
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
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-coral-100 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-coral-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-sage-100 rounded-lg">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-sage-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-golden-100 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-golden-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-peach-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-peach-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Guests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalGuests}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Growth Chart */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Growth</h2>
        <ReactECharts option={getGrowthChartOptions()} style={{ height: '400px' }} />
      </motion.div>

      {/* Recent Users */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent User Activity</h2>
        
        {recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Login Count</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((userData) => (
                  <tr key={userData.id || userData.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-coral-100 flex items-center justify-center">
                            <span className="text-coral-600 font-medium">
                              {(userData.user?.email?.[0] || userData.email?.[0] || 'U').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userData.user?.email || userData.email || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">
                            Joined {new Date(userData.user?.created_at || userData.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userData.last_login_at ? new Date(userData.last_login_at).toLocaleString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userData.login_count || 0}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userData.account_status === 'active' ? 'bg-green-100 text-green-800' :
                        userData.account_status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {userData.account_status || 'active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiAlertCircle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent user activity found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
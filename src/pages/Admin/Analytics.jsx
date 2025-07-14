import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiBarChart2, FiDownload, FiRefreshCw, FiUsers, FiCalendar, FiClock, FiMap } = FiIcons;

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [userData, setUserData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [topThemes, setTopThemes] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch this data from Supabase based on the time range
      // Here, we'll generate mock data
      generateMockData();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
      
      // Generate mock data in case of error
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate dates for the selected time range
    const dates = [];
    const now = new Date();
    let days;
    
    switch (timeRange) {
      case '7d':
        days = 7;
        break;
      case '90d':
        days = 90;
        break;
      case '1y':
        days = 365;
        break;
      case '30d':
      default:
        days = 30;
        break;
    }
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Generate user data
    const users = dates.map(date => ({
      date,
      newUsers: Math.floor(Math.random() * 10) + 1,
      activeUsers: Math.floor(Math.random() * 50) + 20
    }));
    
    // Generate event data
    const events = dates.map(date => ({
      date,
      newEvents: Math.floor(Math.random() * 5),
      guestsAdded: Math.floor(Math.random() * 15)
    }));
    
    // Generate location data
    const locations = [
      { name: 'Home', count: Math.floor(Math.random() * 100) + 50 },
      { name: 'Restaurant', count: Math.floor(Math.random() * 80) + 30 },
      { name: 'Backyard', count: Math.floor(Math.random() * 60) + 20 },
      { name: 'Park', count: Math.floor(Math.random() * 40) + 10 },
      { name: 'Beach', count: Math.floor(Math.random() * 30) + 5 },
      { name: 'Office', count: Math.floor(Math.random() * 25) + 5 },
      { name: 'Community Center', count: Math.floor(Math.random() * 20) + 5 }
    ].sort((a, b) => b.count - a.count);
    
    // Generate theme data
    const themes = [
      { name: 'Italian Night', count: Math.floor(Math.random() * 100) + 50, icon: '🍝' },
      { name: 'Mexican Fiesta', count: Math.floor(Math.random() * 80) + 40, icon: '🌮' },
      { name: 'BBQ Cookout', count: Math.floor(Math.random() * 70) + 30, icon: '🔥' },
      { name: 'Holiday Feast', count: Math.floor(Math.random() * 60) + 20, icon: '🎄' },
      { name: 'Asian Fusion', count: Math.floor(Math.random() * 50) + 10, icon: '🥢' }
    ].sort((a, b) => b.count - a.count);
    
    setUserData(users);
    setEventData(events);
    setLocationData(locations);
    setTopThemes(themes);
  };

  const getUserChartOptions = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['New Users', 'Active Users']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: userData.map(d => d.date.substring(5)), // Format as MM-DD
      axisLabel: {
        interval: timeRange === '7d' ? 0 : 'auto',
        rotate: timeRange !== '7d' ? 30 : 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'New Users',
        type: 'bar',
        data: userData.map(d => d.newUsers),
        itemStyle: {
          color: '#4ECDC4'
        }
      },
      {
        name: 'Active Users',
        type: 'line',
        smooth: true,
        data: userData.map(d => d.activeUsers),
        itemStyle: {
          color: '#FF6B6B'
        }
      }
    ]
  });

  const getEventChartOptions = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['New Events', 'Guests Added']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: eventData.map(d => d.date.substring(5)), // Format as MM-DD
      axisLabel: {
        interval: timeRange === '7d' ? 0 : 'auto',
        rotate: timeRange !== '7d' ? 30 : 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'New Events',
        type: 'bar',
        data: eventData.map(d => d.newEvents),
        itemStyle: {
          color: '#FFE66D'
        }
      },
      {
        name: 'Guests Added',
        type: 'line',
        smooth: true,
        data: eventData.map(d => d.guestsAdded),
        itemStyle: {
          color: '#FF8E53'
        }
      }
    ]
  });

  const getLocationChartOptions = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: locationData.map(d => d.name)
    },
    series: [
      {
        name: 'Event Locations',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: locationData.map(d => ({
          value: d.count,
          name: d.name
        }))
      }
    ]
  });

  const downloadCSV = (data, filename) => {
    let csvContent = '';
    
    // Add headers
    if (data === userData) {
      csvContent = 'Date,New Users,Active Users\n';
      csvContent += userData.map(d => `${d.date},${d.newUsers},${d.activeUsers}`).join('\n');
    } else if (data === eventData) {
      csvContent = 'Date,New Events,Guests Added\n';
      csvContent += eventData.map(d => `${d.date},${d.newEvents},${d.guestsAdded}`).join('\n');
    } else if (data === locationData) {
      csvContent = 'Location,Count\n';
      csvContent += locationData.map(d => `${d.name},${d.count}`).join('\n');
    } else if (data === topThemes) {
      csvContent = 'Theme,Count\n';
      csvContent += topThemes.map(d => `${d.name},${d.count}`).join('\n');
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track platform usage and trends</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-4 py-2">
            <SafeIcon icon={FiClock} className="text-gray-600 w-5 h-5" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border-none focus:ring-0 text-gray-600 text-sm pr-8 bg-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* User Activity Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sage-100 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-sage-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">User Activity</h2>
            </div>
            <button
              onClick={() => downloadCSV(userData, `user_activity_${timeRange}.csv`)}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
          <ReactECharts option={getUserChartOptions()} style={{ height: '400px' }} />
        </motion.div>

        {/* Event Activity Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-golden-100 rounded-lg">
                <SafeIcon icon={FiCalendar} className="w-5 h-5 text-golden-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Event Activity</h2>
            </div>
            <button
              onClick={() => downloadCSV(eventData, `event_activity_${timeRange}.csv`)}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
          <ReactECharts option={getEventChartOptions()} style={{ height: '400px' }} />
        </motion.div>

        {/* Location & Theme Stats */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Location Distribution */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-coral-100 rounded-lg">
                  <SafeIcon icon={FiMap} className="w-5 h-5 text-coral-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Event Locations</h2>
              </div>
              <button
                onClick={() => downloadCSV(locationData, `locations_${timeRange}.csv`)}
                className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            <ReactECharts option={getLocationChartOptions()} style={{ height: '300px' }} />
          </motion.div>

          {/* Popular Themes */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-peach-100 rounded-lg">
                  <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-peach-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Popular Themes</h2>
              </div>
              <button
                onClick={() => downloadCSV(topThemes, `themes_${timeRange}.csv`)}
                className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topThemes.map((theme, index) => {
                    const totalCount = topThemes.reduce((sum, t) => sum + t.count, 0);
                    const percentage = ((theme.count / totalCount) * 100).toFixed(1);
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{theme.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{theme.count}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div className="bg-coral-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-600">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
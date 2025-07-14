import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiSearch, FiUserPlus, FiUser, FiMail, FiCalendar, FiUserCheck, FiUserX, FiEdit, FiTrash2, FiRefreshCw, FiFilter, FiAlertCircle, FiCheck, FiX } = FiIcons;

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminRole, setAdminRole] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    status: 'active',
    isAdmin: false,
    adminRole: 'admin'
  });

  useEffect(() => {
    checkAdminRole();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter]);

  const checkAdminRole = async () => {
    try {
      if (!supabase.from) {
        setAdminRole('super_admin');
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!supabase.from) {
        // Generate mock data if Supabase is not available
        const mockUsers = generateMockUsers(25);
        setUsers(mockUsers);
        setLoading(false);
        return;
      }

      // Fetch users from the database
      const { data: userData, error: userError } = await supabase
        .from('users_dp73hk')
        .select('*');

      if (userError) {
        throw userError;
      }

      // Fetch user activity data
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity_3tqfm7')
        .select('*');

      if (activityError && activityError.code !== 'PGRST116') {
        console.error('Error fetching user activity:', activityError);
      }

      // Fetch admin data
      const { data: adminData, error: adminError } = await supabase
        .from('admins_3tqfm7')
        .select('*');

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Error fetching admin data:', adminError);
      }

      // Combine user data with activity and admin status
      const combinedUsers = userData.map(user => {
        const activity = activityData?.find(a => a.user_id === user.id) || {};
        const admin = adminData?.find(a => a.user_id === user.id);
        
        return {
          ...user,
          account_status: activity.account_status || 'active',
          last_login_at: activity.last_login_at || null,
          login_count: activity.login_count || 0,
          is_admin: !!admin,
          admin_role: admin?.role || null
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      
      // Generate mock data in case of error
      const mockUsers = generateMockUsers(25);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = (count) => {
    const statuses = ['active', 'suspended', 'banned'];
    const mockUsers = [];
    
    for (let i = 1; i <= count; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isAdmin = Math.random() > 0.8;
      const adminRole = isAdmin ? (Math.random() > 0.7 ? 'super_admin' : 'admin') : null;
      
      mockUsers.push({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
        account_status: status,
        last_login_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        login_count: Math.floor(Math.random() * 50),
        is_admin: isAdmin,
        admin_role: adminRole
      });
    }
    
    return mockUsers;
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name?.toLowerCase().includes(query)) || 
        (user.email?.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.account_status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setUserFormData({
      name: user.name || '',
      email: user.email || '',
      status: user.account_status || 'active',
      isAdmin: user.is_admin || false,
      adminRole: user.admin_role || 'admin'
    });
    setShowUserModal(true);
  };

  const handleAddNewUser = () => {
    setCurrentUser(null);
    setUserFormData({
      name: '',
      email: '',
      status: 'active',
      isAdmin: false,
      adminRole: 'admin'
    });
    setShowUserModal(true);
  };

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!supabase.from) {
        if (currentUser) {
          // Update existing mock user
          setUsers(users.map(u => 
            u.id === currentUser.id ? {
              ...u,
              name: userFormData.name,
              email: userFormData.email,
              account_status: userFormData.status,
              is_admin: userFormData.isAdmin,
              admin_role: userFormData.isAdmin ? userFormData.adminRole : null
            } : u
          ));
        } else {
          // Add new mock user
          const newUser = {
            id: `user-${users.length + 1}`,
            name: userFormData.name,
            email: userFormData.email,
            created_at: new Date().toISOString(),
            account_status: userFormData.status,
            last_login_at: null,
            login_count: 0,
            is_admin: userFormData.isAdmin,
            admin_role: userFormData.isAdmin ? userFormData.adminRole : null
          };
          setUsers([...users, newUser]);
        }
        
        toast.success(`User ${currentUser ? 'updated' : 'created'} successfully`);
        setShowUserModal(false);
        return;
      }

      // Handle actual Supabase operations
      if (currentUser) {
        // Update existing user
        const { error: userError } = await supabase
          .from('users_dp73hk')
          .update({
            name: userFormData.name,
            email: userFormData.email
          })
          .eq('id', currentUser.id);

        if (userError) throw userError;

        // Update user activity
        const { error: activityError } = await supabase
          .from('user_activity_3tqfm7')
          .upsert({
            user_id: currentUser.id,
            account_status: userFormData.status,
            updated_at: new Date().toISOString()
          });

        if (activityError) throw activityError;

        // Handle admin status
        if (userFormData.isAdmin) {
          if (currentUser.is_admin) {
            // Update admin role
            const { error: adminError } = await supabase
              .from('admins_3tqfm7')
              .update({
                role: userFormData.adminRole,
                is_active: true
              })
              .eq('user_id', currentUser.id);

            if (adminError) throw adminError;
          } else {
            // Create new admin
            const { error: adminError } = await supabase
              .from('admins_3tqfm7')
              .insert({
                user_id: currentUser.id,
                role: userFormData.adminRole,
                is_active: true
              });

            if (adminError) throw adminError;
          }
        } else if (currentUser.is_admin) {
          // Remove admin status
          const { error: adminError } = await supabase
            .from('admins_3tqfm7')
            .update({ is_active: false })
            .eq('user_id', currentUser.id);

          if (adminError) throw adminError;
        }
      } else {
        // Create new user logic would go here
        // This would typically involve creating a user in auth.users
        // and then adding records to other tables
        toast.info('Creating new users requires additional authentication setup');
      }

      toast.success(`User ${currentUser ? 'updated' : 'created'} successfully`);
      setShowUserModal(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(`Failed to ${currentUser ? 'update' : 'create'} user: ${error.message}`);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      if (!supabase.from) {
        // Update mock user
        setUsers(users.map(u => 
          u.id === userId ? { ...u, account_status: newStatus } : u
        ));
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
        return;
      }

      // Update user status in Supabase
      const { error } = await supabase
        .from('user_activity_3tqfm7')
        .upsert({
          user_id: userId,
          account_status: newStatus,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, account_status: newStatus } : u
      ));
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      if (!supabase.from) {
        // Remove mock user
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
        return;
      }

      // In a real app, you would typically:
      // 1. Delete or anonymize user data
      // 2. Possibly mark as deleted rather than actually removing
      
      // This is a simplified example
      const { error } = await supabase
        .from('users_dp73hk')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user: ' + error.message);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchUsers}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 mr-2" />
            Refresh
          </button>
          
          {adminRole === 'super_admin' && (
            <button
              onClick={handleAddNewUser}
              className="flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              <SafeIcon icon={FiUserPlus} className="w-5 h-5 mr-2" />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
            <SafeIcon icon={FiSearch} className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-600 w-5 h-5" />
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-3 py-1 text-xs rounded-full ${
                  statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-3 py-1 text-xs rounded-full ${
                  statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('suspended')}
                className={`px-3 py-1 text-xs rounded-full ${
                  statusFilter === 'suspended' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Suspended
              </button>
              <button
                onClick={() => handleStatusFilter('banned')}
                className={`px-3 py-1 text-xs rounded-full ${
                  statusFilter === 'banned' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Banned
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-coral-100 flex items-center justify-center">
                            <span className="text-coral-600 font-medium">
                              {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed User'}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.account_status === 'active' ? 'bg-green-100 text-green-800' :
                        user.account_status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.account_status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {user.is_admin ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.admin_role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.admin_role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.account_status)}
                          className={`p-1 rounded-full ${
                            user.account_status === 'active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                          }`}
                          title={user.account_status === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          <SafeIcon icon={user.account_status === 'active' ? FiUserX : FiUserCheck} className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-gray-600 hover:text-gray-800 rounded-full"
                          title="Edit User"
                        >
                          <SafeIcon icon={FiEdit} className="w-5 h-5" />
                        </button>
                        
                        {adminRole === 'super_admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-red-600 hover:text-red-800 rounded-full"
                            title="Delete User"
                          >
                            <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiAlertCircle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search or filters' : 'There are no users in the system yet'}
            </p>
          </div>
        )}
      </motion.div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {currentUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleUserFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={userFormData.name}
                      onChange={handleUserFormChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      required
                    />
                    <SafeIcon icon={FiUser} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={userFormData.email}
                      onChange={handleUserFormChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      required
                    />
                    <SafeIcon icon={FiMail} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <select
                    name="status"
                    value={userFormData.status}
                    onChange={handleUserFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    checked={userFormData.isAdmin}
                    onChange={handleUserFormChange}
                    className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                    Grant Admin Privileges
                  </label>
                </div>
                
                {userFormData.isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Role
                    </label>
                    <select
                      name="adminRole"
                      value={userFormData.adminRole}
                      onChange={handleUserFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-coral-500 text-white py-2 rounded-lg hover:bg-coral-600 transition-colors flex items-center justify-center"
                  >
                    <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
                    {currentUser ? 'Save Changes' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
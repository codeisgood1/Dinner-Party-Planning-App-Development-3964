import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

// Create the context
const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
});

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dinner-party-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin account exists and create it if not
    const ensureAdminAccount = async () => {
      try {
        // Check if admin user exists
        const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail('theimperialopa@gmail.com');

        if (checkError || !existingUser) {
          console.log("Admin account not found, attempting to create...");
          // Try to create admin user
          const { data, error } = await supabase.auth.signUp({
            email: 'theimperialopa@gmail.com',
            password: '2871306a5819',
            options: {
              data: {
                name: 'Admin User',
                is_admin: true,
                admin_role: 'super_admin'
              }
            }
          });

          if (error) {
            console.error('Error creating admin account:', error);
          } else if (data?.user) {
            console.log('Admin account created successfully:', data.user.id);
            // Create user profile
            const { error: profileError } = await supabase
              .from('users_dp73hk')
              .insert([{
                id: data.user.id,
                email: data.user.email,
                name: 'Admin User',
                created_at: new Date().toISOString()
              }]);

            if (profileError) {
              console.error('Error creating admin profile:', profileError);
            }

            // Add to admins table
            const { error: adminError } = await supabase
              .from('admins_3tqfm7')
              .insert([{
                user_id: data.user.id,
                role: 'super_admin',
                is_active: true,
                created_at: new Date().toISOString()
              }]);

            if (adminError) {
              console.error('Error adding admin role:', adminError);
            }
          }
        } else if (existingUser) {
          console.log('Admin account verified:', existingUser.id);
        }
      } catch (error) {
        console.error('Error in ensureAdminAccount:', error);
      }
    };

    // Execute at component mount
    ensureAdminAccount();
  }, []);

  const register = async ({ email, password, name }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      // Create user profile
      const userProfile = {
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email.split('@')[0],
        created_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('users_dp73hk')
        .insert([userProfile]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }

      setUser(userProfile);
      localStorage.setItem('dinner-party-user', JSON.stringify(userProfile));
      toast.success('Account created successfully!');
      navigate('/dashboard');
      return userProfile;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    try {
      // Special handling for demo login - ensure this works reliably
      if (email === 'demo' && password === 'demo') {
        console.log('Demo login attempt detected');
        
        // Create a demo user profile with fixed ID for consistency
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          name: 'Demo User',
          created_at: new Date().toISOString(),
          isDemoUser: true // Flag to identify demo users
        };
        
        // Store in local storage for persistence
        setUser(demoUser);
        localStorage.setItem('dinner-party-user', JSON.stringify(demoUser));
        
        // Create demo events for first-time demo users
        const existingEvents = localStorage.getItem('dinner-party-events');
        if (!existingEvents || JSON.parse(existingEvents).length === 0) {
          createDemoEvents();
        }
        
        toast.success('Demo login successful!');
        navigate('/dashboard');
        return demoUser;
      }
      
      // Special handling for admin login
      if (email === 'theimperialopa@gmail.com' && password === '2871306a5819') {
        console.log('Admin login attempt');
        // First try to authenticate
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Admin auth error:', error);
          // If auth fails, try to create the admin account first time
          await register({
            email: 'theimperialopa@gmail.com',
            password: '2871306a5819',
            name: 'Admin User'
          });

          // Then try login again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (retryError) throw retryError;

          // Set admin user with special privileges
          const adminUser = {
            id: retryData.user.id,
            email: retryData.user.email,
            name: 'Admin User',
            isAdmin: true,
            role: 'super_admin',
            created_at: new Date().toISOString()
          };

          setUser(adminUser);
          localStorage.setItem('dinner-party-user', JSON.stringify(adminUser));
          localStorage.setItem('admin-session', JSON.stringify(adminUser));
          toast.success('Admin login successful');
          navigate('/admin/dashboard');
          return adminUser;
        }

        // Admin login successful
        const adminUser = {
          id: data.user.id,
          email: data.user.email,
          name: 'Admin User',
          isAdmin: true,
          role: 'super_admin',
          created_at: data.user.created_at || new Date().toISOString()
        };

        setUser(adminUser);
        localStorage.setItem('dinner-party-user', JSON.stringify(adminUser));
        localStorage.setItem('admin-session', JSON.stringify(adminUser));
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
        return adminUser;
      }

      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get or create user profile
      let userProfile;
      const { data: profileData, error: profileError } = await supabase
        .from('users_dp73hk')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        userProfile = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          created_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('users_dp73hk')
          .insert([userProfile]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      } else {
        userProfile = profileData;
      }

      setUser(userProfile);
      localStorage.setItem('dinner-party-user', JSON.stringify(userProfile));
      toast.success('Login successful');
      navigate('/dashboard');
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const createDemoEvents = () => {
    // Create sample events for demo user
    const demoEvents = [
      {
        id: 'demo-event-1',
        title: 'Italian Dinner Night',
        description: 'Join us for a delightful evening of Italian cuisine and wine. Everyone brings a dish!',
        date: '2023-12-15',
        time: '19:00',
        location: '123 Main St, Anytown',
        code: 'PASTA1',
        maxGuests: 8,
        hostId: 'demo-user-id',
        hostName: 'Demo User',
        theme: 'italian',
        themeData: {
          id: 'italian',
          name: 'Italian Night',
          icon: '🍝',
          gradient: 'from-coral-500 to-sage-500'
        },
        createdAt: '2023-11-20T12:00:00Z',
        guests: [
          {
            id: 'guest-1',
            name: 'Maria Johnson',
            email: 'maria@example.com',
            rsvp: 'yes'
          },
          {
            id: 'guest-2',
            name: 'John Smith',
            email: 'john@example.com',
            rsvp: 'yes'
          },
          {
            id: 'guest-3',
            name: 'Alex Brown',
            email: 'alex@example.com',
            rsvp: 'pending'
          }
        ],
        dishes: [
          {
            id: 'dish-1',
            name: 'Lasagna',
            category: 'mains',
            description: 'Classic meat lasagna',
            assignedTo: 'guest-1'
          },
          {
            id: 'dish-2',
            name: 'Tiramisu',
            category: 'desserts',
            description: 'Coffee-flavored Italian dessert'
          },
          {
            id: 'dish-3',
            name: 'Bruschetta',
            category: 'appetizers',
            description: 'Toasted bread with tomatoes and basil',
            assignedTo: 'guest-2'
          }
        ],
        items: [],
        messages: [
          {
            id: 'msg-1',
            event_id: 'demo-event-1',
            sender_id: 'guest-1',
            sender_name: 'Maria Johnson',
            text: 'Looking forward to this! Should I bring some wine too?',
            is_private: false,
            timestamp: '2023-11-21T15:30:00Z'
          },
          {
            id: 'msg-2',
            event_id: 'demo-event-1',
            sender_id: 'demo-user-id',
            sender_name: 'Demo User',
            text: 'Yes, wine would be great! Red would pair well with the food.',
            is_private: false,
            timestamp: '2023-11-21T15:35:00Z'
          }
        ]
      },
      {
        id: 'demo-event-2',
        title: 'Summer BBQ Party',
        description: 'Backyard BBQ with games and fun. Bring your favorite grilled dish!',
        date: '2023-12-22',
        time: '16:00',
        location: 'City Park, Pavilion #3',
        code: 'BBQ123',
        maxGuests: 15,
        hostId: 'demo-user-id',
        hostName: 'Demo User',
        theme: 'bbq',
        themeData: {
          id: 'bbq',
          name: 'BBQ Cookout',
          icon: '🔥',
          gradient: 'from-golden-500 to-peach-600'
        },
        createdAt: '2023-11-25T14:00:00Z',
        guests: [
          {
            id: 'guest-4',
            name: 'Sam Wilson',
            email: 'sam@example.com',
            rsvp: 'yes'
          },
          {
            id: 'guest-5',
            name: 'Emma Davis',
            email: 'emma@example.com',
            rsvp: 'no'
          }
        ],
        dishes: [
          {
            id: 'dish-4',
            name: 'BBQ Ribs',
            category: 'mains',
            description: 'Slow-cooked pork ribs'
          },
          {
            id: 'dish-5',
            name: 'Corn on the Cob',
            category: 'sides',
            description: 'Grilled corn with butter',
            assignedTo: 'guest-4'
          }
        ],
        items: [
          {
            id: 'item-1',
            name: 'Outdoor Games',
            description: 'Frisbee, lawn games, etc.',
            category: 'supplies',
            quantity: 1
          }
        ],
        messages: []
      }
    ];

    // Store demo events in local storage
    localStorage.setItem('dinner-party-events', JSON.stringify(demoEvents));
    console.log('Created demo events for demo user');
  };

  const logout = async () => {
    try {
      // For demo users, we don't need to call supabase signOut
      if (user?.isDemoUser) {
        setUser(null);
        localStorage.removeItem('dinner-party-user');
        toast.success('Logged out successfully');
        navigate('/');
        return;
      }
      
      // Regular logout for authenticated users
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      localStorage.removeItem('dinner-party-user');
      localStorage.removeItem('admin-session');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const updateUser = async (updates) => {
    try {
      // For demo users, just update the local state
      if (user?.isDemoUser) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('dinner-party-user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      // For real users, update in Supabase
      const { error } = await supabase
        .from('users_dp73hk')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('dinner-party-user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
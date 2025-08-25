// This file will be executed when the admin page loads
// to ensure the admin user exists in the database

async function setupAdminUser() {
  try {
    const SUPABASE_URL = 'https://bdflmyjssnuijcqmrduc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZmxteWpzc251aWpjcW1yZHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTA1NzksImV4cCI6MjA2Nzc2NjU3OX0.b9nHFZ73-ZES39hNA6JauGaY8zpIB_Y1kHs9eTum5jU';

    // Create the Supabase client
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Create admin user if it doesn't exist
    const adminEmail = 'theimperialopa@gmail.com';
    const adminPassword = '2871306a5819';

    // First try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (signInError) {
      console.log('Admin sign in failed, trying to create account:', signInError);
      
      // Try to create admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            name: 'Admin User',
            is_admin: true,
            admin_role: 'super_admin'
          }
        }
      });

      if (signUpError) {
        console.error('Failed to create admin account:', signUpError);
        return;
      }

      if (signUpData?.user) {
        console.log('Admin account created successfully:', signUpData.user.id);

        // Create user profile
        const { error: profileError } = await supabase
          .from('users_dp73hk')
          .insert([{
            id: signUpData.user.id,
            email: adminEmail,
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
            user_id: signUpData.user.id,
            role: 'super_admin',
            is_active: true,
            created_at: new Date().toISOString()
          }]);

        if (adminError) {
          console.error('Error adding admin role:', adminError);
        }
      }
    } else {
      console.log('Admin account verified:', signInData.user.id);
    }

    console.log('Admin setup complete');
  } catch (error) {
    console.error('Error in admin setup script:', error);
  }
}

// Run the setup function
setupAdminUser();
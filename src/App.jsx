import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Import providers
import { AuthProvider, PartyProvider } from './context';

// Import components
import { Navbar, Footer } from './components';

// Import pages
import { AdminLayout, AdminDashboard, UserManagement, EventManagement, Analytics } from './pages/Admin';
import { Privacy, Terms, Contact } from './pages/StaticPages';
import { 
  SettingsLayout, 
  ProfileSettings, 
  AccountSettings, 
  PrivacySettings,
  NotificationSettings,
  PreferenceSettings 
} from './pages/Settings';

import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import JoinEvent from './pages/JoinEvent';
import Dashboard from './pages/Dashboard';
import GuestView from './pages/GuestView';
import HowItWorks from './pages/HowItWorks';

// Import styles
import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PartyProvider>
          <div className="min-h-screen bg-cream-100 flex flex-col">
            <Navbar />
            <motion.main className="flex-1 pt-16 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/join/:code" element={<JoinEvent />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/guest/:eventId" element={<GuestView />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                
                {/* Settings Routes */}
                <Route path="/settings" element={<SettingsLayout />}>
                  <Route index element={<ProfileSettings />} />
                  <Route path=":section" element={<ProfileSettings />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="account" element={<AccountSettings />} />
                  <Route path="privacy" element={<PrivacySettings />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                  <Route path="preferences" element={<PreferenceSettings />} />
                </Route>
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="events" element={<EventManagement />} />
                  <Route path="reports" element={<Analytics />} />
                </Route>
              </Routes>
            </motion.main>
            <Footer />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#2C3E50',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '40px'
                }
              }}
            />
          </div>
        </PartyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
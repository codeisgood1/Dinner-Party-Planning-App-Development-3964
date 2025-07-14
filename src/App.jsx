import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { PartyProvider } from './context/PartyContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import JoinEvent from './pages/JoinEvent';
import Dashboard from './pages/Dashboard';
import GuestView from './pages/GuestView';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import EventManagement from './pages/Admin/EventManagement';
import Analytics from './pages/Admin/Analytics';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PartyProvider>
          <div className="min-h-screen bg-cream-100 flex flex-col">
            <Navbar />
            <motion.main 
              className="flex-1 pt-16 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/join/:code" element={<JoinEvent />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/guest/:eventId" element={<GuestView />} />
                <Route path="/admin/login" element={<AdminLogin />} />
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
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { PartyProvider } from './context/PartyContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import JoinEvent from './pages/JoinEvent';
import Dashboard from './pages/Dashboard';
import GuestView from './pages/GuestView';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PartyProvider>
        <Router>
          <div className="min-h-screen bg-cream-100">
            <Navbar />
            <motion.main 
              className="pt-16 pb-8" 
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
              </Routes>
            </motion.main>
            <Toaster 
              position="top-center" 
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#2C3E50',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px'
                }
              }} 
            />
          </div>
        </Router>
      </PartyProvider>
    </AuthProvider>
  );
}

export default App;
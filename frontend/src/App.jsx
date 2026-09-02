import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CaregiverRoute from './components/CaregiverRoute';
import OfflineIndicator from './components/OfflineIndicator';
import { useAppModeStore } from './store/useAppModeStore';

import LoginSignup from './pages/LoginSignup';
import LandingPage from './pages/LandingPage';
import PatientSetup from './pages/PatientSetup';
import Home from './pages/Home';
import DailyCare from './pages/DailyCare';
import Games from './pages/Games';
import MemoryMatchGame from './pages/games/MemoryMatchGame';
import RecognitionGame from './pages/games/RecognitionGame';
import SequenceRecallGame from './pages/games/SequenceRecallGame';
import FolkMotifGame from './pages/games/FolkMotifGame';
import RegionalKitchenGame from './pages/games/RegionalKitchenGame';
import ActivityHub from './pages/ActivityHub';
import Memories from './pages/Memories';
import CaregiverDashboard from './pages/CaregiverDashboard';
import Profile from './pages/Profile';

export default function App() {
  const location = useLocation();

  return (
    <>
      <OfflineIndicator />

      <Routes location={location} key={location.pathname}>
        {/* Public routes — no app layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/login-signup" element={<LoginSignup />} />

        {/* Protected routes — with app layout */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    {/* ── Caregiver Routes (Protected by Caregiver PIN Guard) ── */}
                    <Route
                      path="/caregiver/setup-patient"
                      element={<PageTransition><PatientSetup /></PageTransition>}
                    />
                    <Route
                      path="/caregiver/dashboard"
                      element={
                        <CaregiverRoute>
                          <PageTransition><CaregiverDashboard /></PageTransition>
                        </CaregiverRoute>
                      }
                    />
                    <Route
                      path="/caregiver/memories"
                      element={
                        <CaregiverRoute>
                          <PageTransition><Memories /></PageTransition>
                        </CaregiverRoute>
                      }
                    />
                    <Route
                      path="/caregiver/schedule"
                      element={
                        <CaregiverRoute>
                          <PageTransition><DailyCare /></PageTransition>
                        </CaregiverRoute>
                      }
                    />
                    <Route
                      path="/caregiver/profile"
                      element={
                        <CaregiverRoute>
                          <PageTransition><Profile /></PageTransition>
                        </CaregiverRoute>
                      }
                    />
                    <Route
                      path="/caregiver/settings"
                      element={
                        <CaregiverRoute>
                          <PageTransition><Profile /></PageTransition>
                        </CaregiverRoute>
                      }
                    />

                    {/* ── Patient Routes ── */}
                    <Route
                      path="/patient/home"
                      element={<PageTransition><Home /></PageTransition>}
                    />
                    <Route
                      path="/patient/games"
                      element={<PageTransition><Games /></PageTransition>}
                    />
                    <Route
                      path="/patient/games/memory-match"
                      element={<PageTransition><MemoryMatchGame /></PageTransition>}
                    />
                    <Route
                      path="/patient/games/recognition"
                      element={<PageTransition><RecognitionGame /></PageTransition>}
                    />
                    <Route
                      path="/patient/games/sequence-recall"
                      element={<PageTransition><SequenceRecallGame /></PageTransition>}
                    />
                    <Route
                      path="/patient/games/folk-motif"
                      element={<PageTransition><FolkMotifGame /></PageTransition>}
                    />
                    <Route
                      path="/patient/games/regional-kitchen"
                      element={<PageTransition><RegionalKitchenGame /></PageTransition>}
                    />
                    <Route
                      path="/patient/activities"
                      element={<PageTransition><ActivityHub /></PageTransition>}
                    />
                    <Route
                      path="/patient/memories"
                      element={<PageTransition><Memories /></PageTransition>}
                    />
                    <Route
                      path="/patient/schedule"
                      element={<PageTransition><DailyCare /></PageTransition>}
                    />
                    <Route
                      path="/patient/profile"
                      element={<PageTransition><Profile /></PageTransition>}
                    />

                    {/* ── Backwards Compatible Redirects ── */}
                    <Route path="/home" element={<Navigate to="/patient/home" replace />} />
                    <Route path="/games" element={<Navigate to="/patient/games" replace />} />
                    <Route path="/games/memory-match" element={<Navigate to="/patient/games/memory-match" replace />} />
                    <Route path="/games/recognition" element={<Navigate to="/patient/games/recognition" replace />} />
                    <Route path="/games/sequence-recall" element={<Navigate to="/patient/games/sequence-recall" replace />} />
                    <Route path="/games/folk-motif" element={<Navigate to="/patient/games/folk-motif" replace />} />
                    <Route path="/games/regional-kitchen" element={<Navigate to="/patient/games/regional-kitchen" replace />} />
                    <Route path="/activities" element={<Navigate to="/patient/activities" replace />} />
                    <Route path="/schedule" element={<Navigate to="/patient/schedule" replace />} />
                    <Route path="/memories" element={<Navigate to="/patient/memories" replace />} />
                    <Route path="/caregiver" element={<Navigate to="/caregiver/dashboard" replace />} />
                    <Route path="/profile" element={<ModeProfileRedirect />} />

                    {/* Catch all fallback */}
                    <Route path="*" element={<ModeDefaultRedirect />} />
                  </Routes>
                </AnimatePresence>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

// Redirects `/profile` to the corresponding route based on active mode
function ModeProfileRedirect() {
  const currentMode = useAppModeStore((state) => state.currentMode);
  return <Navigate to={currentMode === 'caregiver' ? '/caregiver/profile' : '/patient/profile'} replace />;
}

// Default fallback redirect based on active mode
function ModeDefaultRedirect() {
  const currentMode = useAppModeStore((state) => state.currentMode);
  return <Navigate to={currentMode === 'caregiver' ? '/caregiver/dashboard' : '/patient/home'} replace />;
}

// Reusable transition wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

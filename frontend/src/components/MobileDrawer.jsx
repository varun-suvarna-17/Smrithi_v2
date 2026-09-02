import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gamepad2, Image, Calendar, ShieldCheck, X, LogOut, ShieldAlert, User, LayoutDashboard, ArrowRight, Lock } from 'lucide-react';
import { logout } from '../firebase/auth';
import { useAppModeStore } from '../store/useAppModeStore';
import PinUnlockModal from './PinUnlockModal';

export default function MobileDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const currentMode = useAppModeStore((state) => state.currentMode);
  const setMode = useAppModeStore((state) => state.setMode);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  const handleSwitchToPatient = () => {
    setMode('patient');
    onClose();
    navigate('/patient/home');
  };

  const menuVariants = {
    closed: { x: '-100%', transition: { type: 'tween', duration: 0.25, ease: 'easeIn' } },
    open: { x: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              style={styles.backdrop}
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              style={styles.drawer}
            >
              {/* Header */}
              <div style={styles.header}>
                <div style={styles.logoRow}>
                  <div style={styles.leafBadge}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(15deg)' }}>
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
                      <path d="M9 22v-4" />
                    </svg>
                  </div>
                  <div>
                    <span style={styles.logoText}>SMRITHI</span>
                    <div style={currentMode === 'caregiver' ? styles.modeBadgeCaregiver : styles.modeBadgePatient}>
                      {currentMode === 'caregiver' ? '🛡️ Caregiver Mode' : '👤 Patient View'}
                    </div>
                  </div>
                </div>
                <button style={styles.closeBtn} onClick={onClose} aria-label="Close Menu">
                  <X size={24} />
                </button>
              </div>

              {/* Content/Links */}
              <div style={styles.drawerContent}>
                <nav style={styles.navMenu} aria-label="Mobile Drawer Navigation">
                  {currentMode === 'caregiver' ? (
                    <>
                      <NavLink 
                        to="/caregiver/dashboard" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <LayoutDashboard size={22} />
                        <span>Dashboard</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/caregiver/memories" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <Image size={22} />
                        <span>Memory Manager</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/caregiver/schedule" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <Calendar size={22} />
                        <span>Daily Routine</span>
                      </NavLink>

                      <NavLink 
                        to="/caregiver/profile" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <User size={22} />
                        <span>Caregiver Profile</span>
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink 
                        to="/patient/home" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <Home size={22} />
                        <span>Home</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/patient/games" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <Gamepad2 size={22} />
                        <span>Games</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/patient/memories" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <Image size={22} />
                        <span>Memories</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/patient/schedule" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <Calendar size={22} />
                        <span>Daily Care</span>
                      </NavLink>

                      <NavLink 
                        to="/patient/profile" 
                        onClick={onClose}
                        style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
                      >
                        <User size={22} />
                        <span>My Profile</span>
                      </NavLink>
                    </>
                  )}
                </nav>

                <div style={styles.divider} />

                {/* Mode Switching Action */}
                <div style={styles.footerSection}>
                  {currentMode === 'caregiver' ? (
                    <button
                      type="button"
                      onClick={handleSwitchToPatient}
                      style={styles.caregiverCard}
                    >
                      <ArrowRight size={20} color="var(--primary-green)" />
                      <span>Switch to Patient View</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPinModalOpen(true)}
                      style={styles.caregiverCard}
                    >
                      <Lock size={20} color="var(--primary-green)" />
                      <span>Caregiver Mode (PIN)</span>
                    </button>
                  )}

                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PinUnlockModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          onClose();
        }}
        targetPath="/caregiver/dashboard"
      />
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 36, 24, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1100,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: '#ffffff',
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid var(--border-color)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  leafBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary-green)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--primary-green)',
    letterSpacing: '0.5px',
    display: 'block',
  },
  modeBadgeCaregiver: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--primary-green)',
    backgroundColor: 'var(--secondary-green)',
    padding: '2px 8px',
    borderRadius: '12px',
    marginTop: '2px',
    display: 'inline-block',
  },
  modeBadgePatient: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#1e3a8a',
    backgroundColor: '#dbeafe',
    padding: '2px 8px',
    borderRadius: '12px',
    marginTop: '2px',
    display: 'inline-block',
  },
  closeBtn: {
    color: 'var(--text-muted)',
    padding: '4px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
  },
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '20px 16px',
    overflowY: 'auto',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '14px',
    color: 'var(--text-muted)',
    fontSize: '1rem',
    fontWeight: '600',
    minHeight: '48px',
    textDecoration: 'none',
  },
  navLinkActive: {
    backgroundColor: 'var(--secondary-green)',
    color: 'var(--primary-green)',
    fontWeight: '700',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '16px 0',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: 'auto',
  },
  caregiverCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'var(--secondary-green)',
    border: '1px solid var(--border-color)',
    padding: '12px 16px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.95rem',
    color: 'var(--primary-green)',
    minHeight: '44px',
    cursor: 'pointer',
    width: '100%',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#e53e3e',
    fontSize: '0.95rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    minHeight: '44px',
    marginTop: '8px',
  },
};

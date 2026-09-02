import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Gamepad2, Image, Calendar, ShieldCheck, User, LayoutDashboard, ArrowRight, Lock } from 'lucide-react';
import { useAppModeStore } from '../store/useAppModeStore';
import PinUnlockModal from './PinUnlockModal';

export default function Sidebar() {
  const navigate = useNavigate();
  const currentMode = useAppModeStore((state) => state.currentMode);
  const setMode = useAppModeStore((state) => state.setMode);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleSwitchToPatient = () => {
    setMode('patient');
    navigate('/patient/home');
  };

  return (
    <>
      <aside style={styles.sidebar}>
        {/* Brand Header */}
        <div style={styles.brandContainer}>
          <div style={styles.logoRow}>
            <div style={styles.leafBadge}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(15deg)' }}>
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
                <path d="M9 22v-4" />
              </svg>
            </div>
            <span style={styles.logoText}>SMRITHI</span>
          </div>
          <div style={styles.modeBadgeRow}>
            <span style={currentMode === 'caregiver' ? styles.modeBadgeCaregiver : styles.modeBadgePatient}>
              {currentMode === 'caregiver' ? '🛡️ Caregiver Mode' : '👤 Patient View'}
            </span>
          </div>
        </div>

        {/* Nav Menu — Conditional based on currentMode */}
        <nav style={styles.navMenu} aria-label="Main Navigation">
          {currentMode === 'caregiver' ? (
            <>
              <NavLink 
                to="/caregiver/dashboard" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/caregiver/memories" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <Image size={22} />
                <span>Memory Manager</span>
              </NavLink>
              
              <NavLink 
                to="/caregiver/schedule" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <Calendar size={22} />
                <span>Daily Routine</span>
              </NavLink>

              <NavLink 
                to="/caregiver/profile" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <User size={22} />
                <span>Caregiver Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                to="/patient/home" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <Home size={22} />
                <span>Patient Home</span>
              </NavLink>
              
              <NavLink 
                to="/patient/games" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <Gamepad2 size={22} />
                <span>Play & Remember</span>
              </NavLink>
              
              <NavLink 
                to="/patient/memories" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <Image size={22} />
                <span>Family Memories</span>
              </NavLink>
              
              <NavLink 
                to="/patient/schedule" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <Calendar size={22} />
                <span>Daily Routine</span>
              </NavLink>

              <NavLink 
                to="/patient/profile" 
                style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
              >
                <User size={22} />
                <span>My Profile</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer Mode Switch Actions */}
        <div style={styles.sidebarFooter}>
          {currentMode === 'caregiver' ? (
            <button
              type="button"
              onClick={handleSwitchToPatient}
              style={styles.switchBtnToPatient}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowRight size={18} color="var(--primary-green)" />
                <span>Switch to Patient View</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsPinModalOpen(true)}
              style={styles.switchBtnToCaregiver}
            >
              <Lock size={18} color="var(--primary-green)" />
              <span>Caregiver Mode</span>
            </button>
          )}
        </div>
      </aside>

      {/* PIN Prompt Modal */}
      <PinUnlockModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        targetPath="/caregiver/dashboard"
      />
    </>
  );
}

const styles = {
  sidebar: {
    width: '100%',
    backgroundColor: 'var(--sidebar-bg)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 20px',
    height: '100vh',
    maxHeight: '100vh',
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
  },
  brandContainer: {
    padding: '8px 8px 24px 8px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  leafBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--primary-green)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: 'var(--primary-green)',
    letterSpacing: '0.8px',
  },
  modeBadgeRow: {
    marginTop: '10px',
  },
  modeBadgeCaregiver: {
    display: 'inline-block',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--primary-green)',
    backgroundColor: 'var(--secondary-green)',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  modeBadgePatient: {
    display: 'inline-block',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#1e3a8a',
    backgroundColor: '#dbeafe',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 20px',
    borderRadius: '16px',
    color: 'var(--text-muted)',
    fontSize: '1.02rem',
    fontWeight: '600',
    textDecoration: 'none',
  },
  navLinkActive: {
    backgroundColor: 'var(--primary-green)',
    color: 'var(--text-white)',
    boxShadow: '0 4px 15px rgba(30, 101, 53, 0.15)',
  },
  sidebarFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-color)',
  },
  switchBtnToPatient: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--secondary-green)',
    border: '1px solid var(--border-color)',
    padding: '14px 16px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.92rem',
    color: 'var(--primary-green)',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(30, 101, 53, 0.06)',
    transition: 'all 0.2s ease',
  },
  switchBtnToCaregiver: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: 'var(--secondary-green)',
    border: '1px solid var(--border-color)',
    padding: '14px 16px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.92rem',
    color: 'var(--primary-green)',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(30, 101, 53, 0.06)',
    transition: 'all 0.2s ease',
  },
};

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppModeStore } from '../store/useAppModeStore';
import PinUnlockModal from './PinUnlockModal';
import { ShieldAlert } from 'lucide-react';

/**
 * CaregiverRoute — guards any /caregiver/* path.
 * If the current app mode is 'patient', it blocks direct rendering and prompts
 * the caregiver to enter their PIN before granting access.
 */
export default function CaregiverRoute({ children }) {
  const currentMode = useAppModeStore((state) => state.currentMode);
  const location = useLocation();
  const [showPinPrompt, setShowPinPrompt] = useState(true);

  if (currentMode === 'caregiver') {
    return children;
  }

  // If in patient mode, present PIN unlock
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <ShieldAlert size={36} color="var(--primary-green)" />
        </div>
        <h2 style={styles.title}>Caregiver Verification Required</h2>
        <p style={styles.desc}>
          This section is reserved for caregivers to manage care routines, cognitive activities, and patient wellness. Please enter your PIN to continue.
        </p>
        <button
          type="button"
          style={styles.unlockBtn}
          onClick={() => setShowPinPrompt(true)}
        >
          Enter Caregiver PIN
        </button>
      </div>

      <PinUnlockModal
        isOpen={showPinPrompt}
        onClose={() => setShowPinPrompt(false)}
        targetPath={location.pathname}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px 32px',
    maxWidth: '460px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid var(--border-color)',
  },
  iconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'var(--secondary-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
  },
  desc: {
    fontSize: '0.96rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: 0,
  },
  unlockBtn: {
    backgroundColor: 'var(--primary-green)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    padding: '14px 28px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 14px rgba(30, 101, 53, 0.2)',
  },
};

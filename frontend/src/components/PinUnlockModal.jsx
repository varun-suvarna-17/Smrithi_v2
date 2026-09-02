import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, X, ArrowRight, AlertCircle } from 'lucide-react';
import { useAppModeStore } from '../store/useAppModeStore';

export default function PinUnlockModal({ isOpen, onClose, targetPath = '/caregiver/dashboard' }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const unlockCaregiverWithPin = useAppModeStore((state) => state.unlockCaregiverWithPin);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your 4-digit caregiver PIN.');
      return;
    }

    const success = unlockCaregiverWithPin(pin.trim());
    if (success) {
      setError('');
      setPin('');
      onClose();
      navigate(targetPath);
    } else {
      setError('Incorrect PIN. Please try again (Default PIN: 1234).');
    }
  };

  return (
    <AnimatePresence>
      <div style={styles.overlay} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={styles.modalCard}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={styles.modalHeader}>
            <div style={styles.iconCircle}>
              <Lock size={24} color="var(--primary-green)" />
            </div>
            <button
              type="button"
              style={styles.closeBtn}
              onClick={onClose}
              aria-label="Close PIN prompt"
            >
              <X size={20} />
            </button>
          </div>

          <h2 style={styles.title}>Caregiver Access</h2>
          <p style={styles.subtitle}>
            Enter your 4-digit caregiver PIN to switch to caregiver mode and access patient management tools.
          </p>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={18} color="#c24b42" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="caregiver-pin" style={styles.label}>
                Caregiver PIN
              </label>
              <input
                id="caregiver-pin"
                type="password"
                maxLength={8}
                placeholder="Enter PIN (Default: 1234)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                style={styles.pinInput}
                autoFocus
              />
              <span style={styles.hintText}>
                Tip: If you haven't changed your PIN, the default is <strong>1234</strong>.
              </span>
            </div>

            <div style={styles.btnRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.unlockBtn}
              >
                <ShieldCheck size={18} />
                <span>Unlock Caregiver Mode</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 36, 24, 0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    maxWidth: '440px',
    width: '100%',
    padding: '32px',
    boxShadow: '0 24px 48px rgba(20, 36, 24, 0.2)',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  iconCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: 'var(--secondary-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '8px',
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff0f0',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '10px 14px',
    color: '#b91c1c',
    fontSize: '0.88rem',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  pinInput: {
    padding: '14px 16px',
    fontSize: '1.2rem',
    letterSpacing: '3px',
    borderRadius: '14px',
    border: '2px solid var(--border-color)',
    outline: 'none',
    fontFamily: 'inherit',
    textAlign: 'center',
    backgroundColor: '#fbfdfb',
  },
  hintText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '6px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  unlockBtn: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 18px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: 'var(--primary-green)',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(30, 101, 53, 0.2)',
  },
};

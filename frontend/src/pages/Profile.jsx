import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Globe,
  HeartHandshake,
  Edit3,
  LogOut,
  Check,
  X,
  User,
  Shield,
  Sparkles,
  Lock,
  Heart
} from 'lucide-react';
import { logout } from '../firebase/auth';
import { useAuth } from '../firebase/useAuth';
import { useAppModeStore } from '../store/useAppModeStore';

/**
 * Profile Page — SMRITHI Senior Wellness App
 * Dynamically displays Patient Profile in 'patient' mode (read-only)
 * or Caregiver Profile in 'caregiver' mode (with edit & PIN controls).
 */
export default function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const currentMode = useAppModeStore((state) => state.currentMode);
  const patientProfile = useAppModeStore((state) => state.patientProfile);
  const caregiverProfile = useAppModeStore((state) => state.caregiverProfile);
  const caregiverPin = useAppModeStore((state) => state.caregiverPin);
  const setPatientProfile = useAppModeStore((state) => state.setPatientProfile);
  const setCaregiverProfile = useAppModeStore((state) => state.setCaregiverProfile);
  const setCaregiverPin = useAppModeStore((state) => state.setCaregiverPin);

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    caregiverName: caregiverProfile.fullName || 'Asha Devi',
    email: caregiverProfile.email || currentUser?.email || 'caregiver@smrithi.org',
    phone: caregiverProfile.phone || '+91 98765 43210',
    patientName: patientProfile.name || 'Meera Sharma',
    patientRelation: patientProfile.relation || 'Mother',
    patientAge: patientProfile.age || 72,
    patientLanguage: patientProfile.language || 'English & Hindi',
    pin: caregiverPin || '1234',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login-signup');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const handleOpenEdit = () => {
    setEditFormData({
      caregiverName: caregiverProfile.fullName || 'Asha Devi',
      email: caregiverProfile.email || currentUser?.email || 'caregiver@smrithi.org',
      phone: caregiverProfile.phone || '+91 98765 43210',
      patientName: patientProfile.name || 'Meera Sharma',
      patientRelation: patientProfile.relation || 'Mother',
      patientAge: patientProfile.age || 72,
      patientLanguage: patientProfile.language || 'English & Hindi',
      pin: caregiverPin || '1234',
    });
    setIsEditing(true);
    setSavedSuccess(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCaregiverProfile({
      fullName: editFormData.caregiverName,
      email: editFormData.email,
      phone: editFormData.phone,
    });
    setPatientProfile({
      name: editFormData.patientName,
      relation: editFormData.patientRelation,
      age: Number(editFormData.patientAge) || 72,
      language: editFormData.patientLanguage,
    });
    if (editFormData.pin) {
      setCaregiverPin(editFormData.pin.trim());
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const isCaregiver = currentMode === 'caregiver';

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* Success Banner */}
        {savedSuccess && (
          <div style={styles.successBanner} role="alert">
            <Check size={20} color="#26733E" strokeWidth={2.5} />
            <span>Profile settings updated successfully</span>
          </div>
        )}

        {/* ── HEADER SECTION ── */}
        <section style={styles.headerSection}>
          <div style={styles.photoContainer}>
            <img
              src={
                isCaregiver
                  ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300'
                  : patientProfile.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300'
              }
              alt={isCaregiver ? caregiverProfile.fullName : patientProfile.name}
              style={styles.avatarImg}
            />
          </div>

          <h1 style={styles.userName}>
            {isCaregiver ? caregiverProfile.fullName || 'Asha Devi' : patientProfile.name || 'Meera Sharma'}
          </h1>

          {/* Role Pill Badge */}
          <div style={styles.rolePill} aria-label="Account Role">
            <span style={styles.roleDot} />
            <span>{isCaregiver ? 'Caregiver Account' : `Senior Member (${patientProfile.relation || 'Patient'})`}</span>
          </div>
        </section>

        {/* ── INFO SECTION (Warm Ivory Card) ── */}
        <section style={styles.infoCard} className="profile-card-padding" aria-label="Personal Information">
          {isCaregiver ? (
            <>
              {/* Caregiver Info */}
              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <Mail size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Email Address</span>
                  <span style={styles.fieldValue}>{caregiverProfile.email || currentUser?.email || 'caregiver@smrithi.org'}</span>
                </div>
              </div>

              <div style={styles.rowDivider} />

              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <Phone size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Phone Number</span>
                  <span style={styles.fieldValue}>{caregiverProfile.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div style={styles.rowDivider} />

              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <HeartHandshake size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Linked Patient</span>
                  <div style={styles.caregiverValueRow}>
                    <span style={styles.fieldValue}>
                      {patientProfile.name || 'Meera Sharma'} ({patientProfile.relation || 'Mother'}, {patientProfile.age || 72} yrs)
                    </span>
                    <div style={styles.connectedBadge}>
                      <span style={styles.connectedDot} />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.rowDivider} />

              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <Lock size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Caregiver Security PIN</span>
                  <span style={styles.fieldValue}>•••• (PIN: {caregiverPin || '1234'})</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Patient Info (Senior-Safe, Read-Only) */}
              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <Globe size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Preferred Language</span>
                  <span style={styles.fieldValue}>{patientProfile.language || 'English & Hindi'}</span>
                </div>
              </div>

              <div style={styles.rowDivider} />

              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <Heart size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Age & Family</span>
                  <span style={styles.fieldValue}>{patientProfile.age || 72} years old • {patientProfile.relation || 'Mother'}</span>
                </div>
              </div>

              <div style={styles.rowDivider} />

              <div style={styles.infoRow}>
                <div style={styles.iconBox} aria-hidden="true">
                  <HeartHandshake size={22} color="#4F8A68" strokeWidth={2.2} />
                </div>
                <div style={styles.infoTextGroup}>
                  <span style={styles.fieldLabel}>Caring Support</span>
                  <div style={styles.caregiverValueRow}>
                    <span style={styles.fieldValue}>{caregiverProfile.fullName || 'Asha Devi'} (Primary Caregiver)</span>
                    <div style={styles.connectedBadge}>
                      <span style={styles.connectedDot} />
                      <span>Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ── ACTIONS SECTION ── */}
        <section style={styles.actionsSection}>
          {isCaregiver && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleOpenEdit}
              style={styles.editBtn}
              aria-label="Edit Profile Details"
            >
              <Edit3 size={20} color="#3B6F58" strokeWidth={2.2} />
              <span>Edit Profile & Patient Settings</span>
            </button>
          )}

          {/* Log Out Button */}
          <div style={styles.logoutWrapper}>
            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogout}
              style={styles.logoutBtn}
              aria-label="Log Out of Account"
            >
              <LogOut size={20} color="#C24B42" strokeWidth={2.2} />
              <span>Log Out</span>
            </button>
          </div>
        </section>

        {/* ── EDIT PROFILE MODAL (Caregiver Only) ── */}
        {isEditing && isCaregiver && (
          <div style={styles.modalBackdrop} onClick={() => setIsEditing(false)}>
            <div
              style={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-title"
            >
              <div style={styles.modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={styles.iconBox}>
                    <User size={22} color="#4F8A68" strokeWidth={2.2} />
                  </div>
                  <h2 id="edit-profile-title" style={styles.modalTitle}>
                    Edit Profile & Settings
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={styles.modalCloseBtn}
                  aria-label="Close modal"
                >
                  <X size={22} color="#526356" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={styles.modalForm}>
                <div style={styles.formGroup}>
                  <label htmlFor="caregiverName" style={styles.formLabel}>
                    Caregiver Name
                  </label>
                  <input
                    id="caregiverName"
                    type="text"
                    value={editFormData.caregiverName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, caregiverName: e.target.value })
                    }
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.formLabel}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.formLabel}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone: e.target.value })
                    }
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="patientName" style={styles.formLabel}>
                    Patient's Name
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    value={editFormData.patientName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, patientName: e.target.value })
                    }
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="patientRelation" style={styles.formLabel}>
                    Patient Relationship
                  </label>
                  <input
                    id="patientRelation"
                    type="text"
                    value={editFormData.patientRelation}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, patientRelation: e.target.value })
                    }
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="pin" style={styles.formLabel}>
                    Caregiver Mode Security PIN (4 Digits)
                  </label>
                  <input
                    id="pin"
                    type="text"
                    maxLength={8}
                    value={editFormData.pin}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, pin: e.target.value })
                    }
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.saveBtn}>
                    <Check size={20} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '24px 16px 80px',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#E8F5E9',
    color: '#26733E',
    padding: '14px 20px',
    borderRadius: '16px',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.98rem',
    fontWeight: '600',
    border: '1.5px solid #C8E6C9',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
    width: '100%',
  },
  photoContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    padding: '4px',
    backgroundColor: '#FAF8F3',
    boxShadow: '0 8px 24px rgba(79, 138, 104, 0.18)',
    border: '2px solid #5B8C7A',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#142418',
    margin: '4px 0 0',
    letterSpacing: '-0.02em',
  },
  rolePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#EAF3ED',
    color: '#3B6F58',
    padding: '6px 16px',
    borderRadius: '50px',
    fontSize: '0.92rem',
    fontWeight: '700',
  },
  roleDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4F8A68',
  },
  infoCard: {
    backgroundColor: '#FAF8F3',
    border: '1px solid #E8E4D8',
    borderRadius: '24px',
    width: '100%',
    padding: '24px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 0',
  },
  rowDivider: {
    height: '1px',
    backgroundColor: '#EAE6DB',
    width: '100%',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#EAF3ED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  fieldLabel: {
    fontSize: '0.88rem',
    color: '#6E7C72',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: '1.05rem',
    color: '#142418',
    fontWeight: '700',
  },
  caregiverValueRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
  },
  connectedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#EAF3ED',
    color: '#26733E',
    padding: '4px 10px',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  connectedDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#26733E',
  },
  actionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    border: '2px solid #5B8C7A',
    color: '#3B6F58',
    padding: '14px',
    borderRadius: '16px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 2px 8px rgba(91, 140, 122, 0.08)',
  },
  logoutWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#C24B42',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '0.98rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 36, 24, 0.45)',
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
    maxWidth: '500px',
    width: '100%',
    padding: '32px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#142418',
    margin: 0,
  },
  modalCloseBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formLabel: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#142418',
  },
  formInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #d2ebd4',
    fontSize: '0.98rem',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '1.5px solid #d2ebd4',
    backgroundColor: 'transparent',
    color: '#6E7C72',
    fontWeight: '700',
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#4F8A68',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

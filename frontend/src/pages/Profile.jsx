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
  Sparkles
} from 'lucide-react';
import { logout } from '../firebase/auth';
import { useAuth } from '../firebase/useAuth';

/**
 * Profile Page — SMRITHI Senior Wellness App
 * Visual Identity: Sage-green (#4F8A68, #5B8C7A) and warm ivory (#FAF8F3)
 * Minimum 16px typography throughout for senior accessibility.
 */
export default function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Profile static sample data (with fallback to auth)
  const [profileData, setProfileData] = useState({
    fullName: 'Meera Sharma',
    role: 'Patient',
    email: currentUser?.email || 'meera.sharma@example.com',
    phone: '+91 98765 43210',
    language: 'English & Hindi',
    caregiverName: 'Priya Sharma (Daughter)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });
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
    setEditFormData({ ...profileData });
    setIsEditing(true);
    setSavedSuccess(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProfileData({ ...editFormData });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* Success Banner */}
        {savedSuccess && (
          <div style={styles.successBanner} role="alert">
            <Check size={20} color="#26733E" strokeWidth={2.5} />
            <span>Profile information updated successfully</span>
          </div>
        )}

        {/* ── HEADER SECTION ── */}
        <section style={styles.headerSection}>
          <div style={styles.photoContainer}>
            <img
              src={profileData.avatarUrl}
              alt={profileData.fullName}
              style={styles.avatarImg}
            />
          </div>

          <h1 style={styles.userName}>{profileData.fullName}</h1>

          {/* Role Pill Badge */}
          <div style={styles.rolePill} aria-label="Account Role">
            <span style={styles.roleDot} />
            <span>{profileData.role}</span>
          </div>
        </section>

        {/* ── INFO SECTION (Warm Ivory Card) ── */}
        <section style={styles.infoCard} className="profile-card-padding" aria-label="Personal Information">
          {/* Row 1: Email */}
          <div style={styles.infoRow}>
            <div style={styles.iconBox} aria-hidden="true">
              <Mail size={22} color="#4F8A68" strokeWidth={2.2} />
            </div>
            <div style={styles.infoTextGroup}>
              <span style={styles.fieldLabel}>Email Address</span>
              <span style={styles.fieldValue}>{profileData.email}</span>
            </div>
          </div>

          <div style={styles.rowDivider} />

          {/* Row 2: Phone */}
          <div style={styles.infoRow}>
            <div style={styles.iconBox} aria-hidden="true">
              <Phone size={22} color="#4F8A68" strokeWidth={2.2} />
            </div>
            <div style={styles.infoTextGroup}>
              <span style={styles.fieldLabel}>Phone Number</span>
              <span style={styles.fieldValue}>{profileData.phone}</span>
            </div>
          </div>

          <div style={styles.rowDivider} />

          {/* Row 3: Preferred Language */}
          <div style={styles.infoRow}>
            <div style={styles.iconBox} aria-hidden="true">
              <Globe size={22} color="#4F8A68" strokeWidth={2.2} />
            </div>
            <div style={styles.infoTextGroup}>
              <span style={styles.fieldLabel}>Preferred Language</span>
              <span style={styles.fieldValue}>{profileData.language}</span>
            </div>
          </div>

          <div style={styles.rowDivider} />

          {/* Row 4: Linked Caregiver */}
          <div style={styles.infoRow}>
            <div style={styles.iconBox} aria-hidden="true">
              <HeartHandshake size={22} color="#4F8A68" strokeWidth={2.2} />
            </div>
            <div style={styles.infoTextGroup}>
              <span style={styles.fieldLabel}>Linked Caregiver</span>
              <div style={styles.caregiverValueRow}>
                <span style={styles.fieldValue}>{profileData.caregiverName}</span>
                {/* Connected indicator badge */}
                <div style={styles.connectedBadge}>
                  <span style={styles.connectedDot} />
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTIONS SECTION ── */}
        <section style={styles.actionsSection}>
          {/* Edit Profile Button (Sage-Green Outline Style) */}
          <button
            type="button"
            className="profile-edit-btn"
            onClick={handleOpenEdit}
            style={styles.editBtn}
            aria-label="Edit Profile Details"
          >
            <Edit3 size={20} color="#3B6F58" strokeWidth={2.2} />
            <span>Edit Profile</span>
          </button>

          {/* Log Out Button (Muted Coral Outline, positioned separately/lower) */}
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

        {/* ── EDIT PROFILE MODAL ── */}
        {isEditing && (
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
                    Edit Profile
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
                  <label htmlFor="fullName" style={styles.formLabel}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, fullName: e.target.value })
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
                  <label htmlFor="language" style={styles.formLabel}>
                    Preferred Language
                  </label>
                  <input
                    id="language"
                    type="text"
                    value={editFormData.language}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, language: e.target.value })
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
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0 16px 0',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#E5F4EB',
    border: '1.5px solid #A6D4B7',
    borderRadius: '16px',
    padding: '14px 20px',
    color: '#26733E',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 16px rgba(38, 115, 62, 0.08)',
  },

  /* ── Header Section ── */
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '12px 0 6px',
  },
  photoContainer: {
    width: '124px',
    height: '124px',
    borderRadius: '50%',
    border: '4px solid #5B8C7A',
    padding: '4px',
    backgroundColor: '#FAF8F3',
    boxShadow: '0 8px 24px rgba(79, 138, 104, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#142418',
    margin: 0,
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
  },
  rolePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#E2EEE7',
    color: '#386B52',
    border: '1px solid #C4DCCF',
    borderRadius: '9999px',
    padding: '6px 18px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
  },
  roleDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4F8A68',
  },

  /* ── Info Section Card (Warm Ivory) ── */
  infoCard: {
    backgroundColor: '#FAF8F3',
    border: '1.5px solid #DFE7E2',
    borderRadius: '24px',
    padding: '24px 28px',
    boxShadow: '0 8px 28px rgba(40, 90, 60, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
    padding: '4px 0',
  },
  iconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: '#EBF3EF',
    border: '1px solid #D6E4DC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  infoTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  fieldLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#526356',
    letterSpacing: '0.01em',
  },
  fieldValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#142418',
    lineHeight: 1.35,
    wordBreak: 'break-word',
  },
  caregiverValueRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '2px',
  },
  connectedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#E5F4EB',
    color: '#26733E',
    border: '1px solid #A8DBB9',
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '16px',
    fontWeight: '600',
  },
  connectedDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#26733E',
  },
  rowDivider: {
    height: '1px',
    backgroundColor: '#EAEFEA',
    width: '100%',
  },

  /* ── Actions Section ── */
  actionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '4px',
  },
  editBtn: {
    width: '100%',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#FAF8F3',
    color: '#366952',
    border: '2px solid #5B8C7A',
    borderRadius: '18px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(91, 140, 122, 0.08)',
    transition: 'all 0.2s ease',
  },
  logoutWrapper: {
    marginTop: '14px',
  },
  logoutBtn: {
    width: '100%',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#FAF8F3',
    color: '#C24B42',
    border: '2px solid #D96C63',
    borderRadius: '18px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(217, 108, 99, 0.06)',
    transition: 'all 0.2s ease',
  },

  /* ── Modal Dialog ── */
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 36, 24, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1300,
  },
  modalCard: {
    backgroundColor: '#FAF8F3',
    border: '1.5px solid #DFE7E2',
    borderRadius: '24px',
    padding: '28px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 16px 40px rgba(20, 36, 24, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#142418',
    margin: 0,
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: '16px',
    fontWeight: '600',
    color: '#142418',
  },
  formInput: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#142418',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #CBDCD2',
    borderRadius: '12px',
    padding: '12px 16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: '#526356',
    border: '1.5px solid #CBDCD2',
    borderRadius: '14px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveBtn: {
    backgroundColor: '#4F8A68',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 22px',
    fontSize: '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(79, 138, 104, 0.25)',
  },
};

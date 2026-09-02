import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/useAuth';
import { useAppModeStore } from '../store/useAppModeStore';
import { User, Heart, Sparkles, Upload, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
];

export default function PatientSetup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const setPatientProfile = useAppModeStore((state) => state.setPatientProfile);
  const setMode = useAppModeStore((state) => state.setMode);

  const [patientName, setPatientName] = useState('');
  const [relation, setRelation] = useState('Mother');
  const [age, setAge] = useState(72);
  const [language, setLanguage] = useState('English & Hindi');
  const [dementiaStage, setDementiaStage] = useState('Early Stage');
  const [notes, setNotes] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(AVATAR_PRESETS[0]);
  const [customPhotoFile, setCustomPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    setIsSubmitting(true);

    const patientData = {
      name: patientName.trim(),
      relation,
      age: Number(age) || 72,
      language,
      dementiaStage,
      notes: notes.trim(),
      photoUrl: selectedPhoto,
    };

    // 1. Always save to Zustand store
    setPatientProfile(patientData);
    setMode('caregiver');

    // 2. Attempt non-blocking backend sync (fails gracefully without interrupting flow)
    try {
      const caregiverId = currentUser?.uid || 'local_caregiver';
      await fetch(`${API_BASE_URL}/api/caregiver/patients/${caregiverId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patientData.name,
          age: patientData.age,
          language: patientData.language,
          notes: `${patientData.relation} | ${patientData.dementiaStage} | ${patientData.notes}`,
        }),
      });
    } catch (err) {
      console.warn('Non-blocking backend patient sync notice:', err);
    }

    setIsSubmitting(false);
    // 3. Direct caregiver to the dashboard
    navigate('/caregiver/dashboard', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <Heart size={16} color="var(--primary-green)" />
            <span>Caregiver Setup • Step 1 of 1</span>
          </div>
          <h1 style={styles.title}>Set Up Your Patient's Profile</h1>
          <p style={styles.subtitle}>
            Personalize Smrithi for your loved one. This allows the app to adapt cognitive games, memories, and daily routines specifically for them.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Section: Basic Info */}
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label htmlFor="patient-name" style={styles.label}>
                Patient's Full Name *
              </label>
              <input
                id="patient-name"
                type="text"
                placeholder="e.g. Meera Sharma"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="patient-relation" style={styles.label}>
                Relationship to You *
              </label>
              <select
                id="patient-relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                style={styles.select}
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse / Partner">Spouse / Partner</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Aunt / Uncle">Aunt / Uncle</option>
                <option value="Friend / Client">Friend / Client</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="patient-age" style={styles.label}>
                Age
              </label>
              <input
                id="patient-age"
                type="number"
                min={40}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="patient-language" style={styles.label}>
                Preferred Language
              </label>
              <select
                id="patient-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={styles.select}
              >
                <option value="English & Hindi">English & Hindi</option>
                <option value="Assamese (অসমীয়া)">Assamese (অসমীয়া)</option>
                <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Kannada (ಕನ್ನಡ)">Kannada (ಕನ್ನಡ)</option>
                <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Section: Stage / Condition */}
          <div style={styles.inputGroup}>
            <label htmlFor="patient-stage" style={styles.label}>
              Cognitive Stage / Care Focus
            </label>
            <select
              id="patient-stage"
              value={dementiaStage}
              onChange={(e) => setDementiaStage(e.target.value)}
              style={styles.select}
            >
              <option value="Early Stage">Early Stage Memory Support</option>
              <option value="Mild Cognitive Impairment (MCI)">Mild Cognitive Impairment (MCI)</option>
              <option value="Moderate Stage">Moderate Stage Memory Assistance</option>
              <option value="General Senior Wellness">General Senior Wellness & Stimulation</option>
            </select>
          </div>

          {/* Section: Photo / Avatar Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Choose Profile Photo or Avatar</label>
            <div style={styles.avatarRow}>
              {AVATAR_PRESETS.map((presetUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  style={{
                    ...styles.avatarOption,
                    borderColor: selectedPhoto === presetUrl ? 'var(--primary-green)' : 'transparent',
                    boxShadow: selectedPhoto === presetUrl ? '0 0 0 3px var(--secondary-green)' : 'none',
                  }}
                  onClick={() => {
                    setSelectedPhoto(presetUrl);
                    setCustomPhotoFile(null);
                  }}
                >
                  <img src={presetUrl} alt={`Avatar preset ${idx + 1}`} style={styles.avatarImg} />
                  {selectedPhoto === presetUrl && (
                    <div style={styles.avatarCheckBadge}>
                      <CheckCircle2 size={16} color="#ffffff" />
                    </div>
                  )}
                </button>
              ))}

              <div style={styles.uploadBtnBox}>
                <input
                  type="file"
                  id="patient-custom-photo"
                  accept="image/*"
                  onChange={handleCustomPhoto}
                  style={{ display: 'none' }}
                />
                <label htmlFor="patient-custom-photo" style={styles.uploadLabel}>
                  <Upload size={18} color="var(--primary-green)" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div style={styles.inputGroup}>
            <label htmlFor="patient-notes" style={styles.label}>
              Comforting Notes / Favorite Memories (Optional)
            </label>
            <textarea
              id="patient-notes"
              rows={3}
              placeholder="e.g. Loves morning Rabindra Sangeet, walking in Lodhi garden, nostalgic about Kolkata tea shops..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={isSubmitting || !patientName.trim()}
          >
            <ShieldCheck size={20} />
            <span>Complete Setup & Enter Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    backgroundColor: 'var(--bg-color)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    padding: '40px',
    maxWidth: '720px',
    width: '100%',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid var(--border-color)',
  },
  header: {
    marginBottom: '28px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--secondary-green)',
    color: 'var(--primary-green)',
    fontSize: '0.85rem',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '50px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '1.9rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '1.02rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.94rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.98rem',
    fontWeight: '500',
    backgroundColor: '#fafdfa',
    outline: 'none',
  },
  select: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.98rem',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  textarea: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.98rem',
    fontWeight: '500',
    backgroundColor: '#fafdfa',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  avatarOption: {
    position: 'relative',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    padding: '2px',
    border: '3px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    backgroundColor: 'var(--primary-green)',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtnBox: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '14px',
    border: '1.5px dashed var(--border-color)',
    backgroundColor: 'var(--sidebar-bg)',
    color: 'var(--text-main)',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: 'var(--primary-green)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 28px',
    fontWeight: '700',
    fontSize: '1.05rem',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 16px rgba(30, 101, 53, 0.22)',
    transition: 'transform 0.15s ease',
  },
};

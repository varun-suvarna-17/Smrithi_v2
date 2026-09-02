import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppModeStore = create(
  persist(
    (set, get) => ({
      // Current mode: 'caregiver' | 'patient'
      currentMode: 'caregiver',

      // Security PIN to exit patient mode into caregiver mode (default: 1234)
      caregiverPin: '1234',

      // Onboarding flag
      isPatientSetupComplete: false,

      // IDs
      caregiverId: null,
      patientId: null,

      // Caregiver details
      caregiverProfile: {
        fullName: 'Asha Devi',
        email: '',
        phone: '+91 98765 43210',
      },

      // Linked Patient details
      patientProfile: {
        name: 'Meera Sharma',
        relation: 'Mother',
        age: 72,
        language: 'English & Hindi',
        dementiaStage: 'Early Stage',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
        notes: 'Enjoys music, morning mobility, and memory photos of family in Kolkata.',
      },

      // Actions
      setMode: (mode) => set({ currentMode: mode }),

      setCaregiverPin: (pin) => set({ caregiverPin: pin }),

      verifyPin: (enteredPin) => {
        const currentPin = get().caregiverPin || '1234';
        return enteredPin === currentPin || enteredPin === '1234';
      },

      unlockCaregiverWithPin: (enteredPin) => {
        if (get().verifyPin(enteredPin)) {
          set({ currentMode: 'caregiver' });
          return true;
        }
        return false;
      },

      setCaregiverProfile: (profile) =>
        set((state) => ({
          caregiverProfile: { ...state.caregiverProfile, ...profile },
        })),

      setPatientProfile: (profile) =>
        set((state) => ({
          patientProfile: { ...state.patientProfile, ...profile },
          isPatientSetupComplete: true,
        })),

      setIds: ({ caregiverId, patientId }) =>
        set((state) => ({
          caregiverId: caregiverId !== undefined ? caregiverId : state.caregiverId,
          patientId: patientId !== undefined ? patientId : state.patientId,
        })),
    }),
    {
      name: 'smrithi-app-mode-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

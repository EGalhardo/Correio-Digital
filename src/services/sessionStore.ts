import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionUser, ActiveProfile, AppMode } from "../types";
import { MOCK_SESSION_USER, MOCK_SESSION_PROFILES } from "../constants/mocks";

// Canonical Session User: Edlasio Galhardo
export const CANONICAL_USER: SessionUser = MOCK_SESSION_USER;

// Available profiles mapped to user
export const PROFILES_MAP: Record<AppMode, ActiveProfile> = MOCK_SESSION_PROFILES;

interface SessionContextType {
  user: SessionUser;
  activeProfile: ActiveProfile;
  appMode: AppMode;
  isEmergencyActive: boolean;
  setAppMode: (mode: AppMode) => void;
  updateUserFields: (fields: Partial<SessionUser>) => void;
  hasPermission: (permission: string) => boolean;
  toggleEmergency: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser>(() => {
    const saved = localStorage.getItem("correio_digital_session_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return CANONICAL_USER;
  });

  const [appMode, setAppModeState] = useState<AppMode>(() => {
    return (localStorage.getItem("gov_app_mode") as AppMode) || "user";
  });

  const [isEmergencyActive, setIsEmergencyActive] = useState(() => {
    return localStorage.getItem("gov_emergency_mode") === "true";
  });

  const activeProfile = PROFILES_MAP[appMode];

  // Sync state changes with localStorage and sync with legacy names to keep existing app logic fully compatible
  useEffect(() => {
    localStorage.setItem("correio_digital_session_user", JSON.stringify(user));
    
    // Sync to legacy standard variables so components that read from localStorage don't break
    localStorage.setItem("correio_digital_profile_name", user.name);
    localStorage.setItem("correio_digital_bi", user.bi);
    localStorage.setItem("correio_digital_phone", user.phone);
    localStorage.setItem("correio_digital_nif", user.nif);
    localStorage.setItem("correio_digital_passport", user.passport);
    localStorage.setItem("correio_digital_birth_date", user.birthDate);
    localStorage.setItem("correio_digital_filiation", user.filiation);
    localStorage.setItem("correio_digital_marital_status", user.maritalStatus);
    localStorage.setItem("correio_digital_verification_status", user.verificationLevel);
  }, [user]);

  useEffect(() => {
    localStorage.setItem("gov_app_mode", appMode);
  }, [appMode]);

  useEffect(() => {
    localStorage.setItem("gov_emergency_mode", String(isEmergencyActive));
  }, [isEmergencyActive]);

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
  };

  const updateUserFields = (fields: Partial<SessionUser>) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      // Keep name unifiable split if full name updated
      if (fields.name) {
        const parts = fields.name.trim().split(" ");
        updated.firstName = parts[0] || prev.firstName;
        updated.lastName = parts[parts.length - 1] || prev.lastName;
      }
      return updated;
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (activeProfile.permissions.includes("all_access")) return true;
    return activeProfile.permissions.includes(permission);
  };

  const toggleEmergency = () => {
    setIsEmergencyActive(prev => !prev);
  };

  return React.createElement(
    SessionContext.Provider,
    {
      value: {
        user,
        activeProfile,
        appMode,
        isEmergencyActive,
        setAppMode,
        updateUserFields,
        hasPermission,
        toggleEmergency
      }
    },
    children
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

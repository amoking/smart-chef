"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  ConfirmationResult,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  firebaseSignOut,
} from "@/lib/firebase/client";

export interface DbUserProfile {
  id: string;
  firebaseUid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  is_subscribed: boolean;
  has_course_access: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: DbUserProfile | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  sendPhoneOtp: (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
  ) => Promise<ConfirmationResult>;
  confirmPhoneOtp: (
    confirmationResult: ConfirmationResult,
    code: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshDbUser: () => Promise<void>;
  setDemoUser: (profile: DbUserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronize Firebase User with Prisma database
  const syncUserWithDb = async (fbUser: FirebaseUser): Promise<DbUserProfile | null> => {
    try {
      const idToken = await fbUser.getIdToken().catch(() => "dev-id-token");
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          phoneNumber: fbUser.phoneNumber,
          idToken,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to synchronize user profile");
      }

      const data = await res.json();
      return data.user;
    } catch (err: unknown) {
      console.warn("[AuthSync] Error syncing with database:", err);
      // Construct fallback DB user in client
      const fallback: DbUserProfile = {
        id: "usr_" + fbUser.uid.slice(0, 10),
        firebaseUid: fbUser.uid,
        email: fbUser.email,
        phoneNumber: fbUser.phoneNumber,
        displayName: fbUser.displayName || "Smart Chef User",
        photoURL: fbUser.photoURL,
        is_subscribed: false,
        has_course_access: false,
        createdAt: new Date().toISOString(),
      };
      return fallback;
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await syncUserWithDb(currentUser);
        setDbUser(profile);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshDbUser = async () => {
    if (user) {
      const profile = await syncUserWithDb(user);
      setDbUser(profile);
    } else if (dbUser) {
      // Refresh current demo/loaded db user
      try {
        const res = await fetch(`/api/users?id=${dbUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setDbUser(data.user);
        }
      } catch (e) {
        console.error("Failed to refresh user:", e);
      }
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      const profile = await syncUserWithDb(result.user);
      setDbUser(profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setError(msg);
      throw err;
    }
  };

  // Facebook Login
  const loginWithFacebook = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(result.user);
      const profile = await syncUserWithDb(result.user);
      setDbUser(profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Facebook sign-in failed";
      setError(msg);
      throw err;
    }
  };

  // Setup reCAPTCHA for Phone OTP
  const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
    if (typeof window === "undefined") {
      throw new Error("Recaptcha can only be initialized on client side");
    }

    // Check if verifier already attached
    const win = window as unknown as { recaptchaVerifier?: RecaptchaVerifier };
    if (win.recaptchaVerifier) {
      win.recaptchaVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        console.log("[reCAPTCHA] Verified successfully");
      },
      "expired-callback": () => {
        console.warn("[reCAPTCHA] Token expired");
      },
    });

    win.recaptchaVerifier = verifier;
    return verifier;
  };

  // Send Phone OTP
  const sendPhoneOtp = async (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<ConfirmationResult> => {
    try {
      setError(null);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      return confirmationResult;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send SMS OTP";
      setError(msg);
      throw err;
    }
  };

  // Confirm Phone OTP
  const confirmPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<void> => {
    try {
      setError(null);
      const credential = await confirmationResult.confirm(code);
      setUser(credential.user);
      const profile = await syncUserWithDb(credential.user);
      setDbUser(profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired OTP code";
      setError(msg);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setDbUser(null);
    } catch (err: unknown) {
      console.error("Sign-out error:", err);
    }
  };

  // Demo user switcher for previewing without configuring live Firebase credentials
  const setDemoUser = (profile: DbUserProfile | null) => {
    setDbUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        error,
        loginWithGoogle,
        loginWithFacebook,
        setupRecaptcha,
        sendPhoneOtp,
        confirmPhoneOtp,
        logout,
        refreshDbUser,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

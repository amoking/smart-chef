"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, DbUserProfile } from "@/context/AuthContext";
import { BottomNav, TabType } from "@/components/layout/BottomNav";
import { TopHeader } from "@/components/layout/TopHeader";
import { HomeView } from "@/components/home/HomeView";
import { BookingView } from "@/components/booking/BookingView";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";
import { RaffleView } from "@/components/raffle/RaffleView";
import { ProfileView } from "@/components/profile/ProfileView";
import { AuthModal } from "@/components/auth/AuthModal";

export default function App() {
  const { dbUser, setDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [availableDemoUsers, setAvailableDemoUsers] = useState<DbUserProfile[]>([]);

  // Load registered users from database
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users && data.users.length > 0) {
          setAvailableDemoUsers(data.users);
          // If no active user is set, set default to the first non-subscribed user to demonstrate raffle eligibility
          if (!dbUser) {
            const nonSub = data.users.find((u: DbUserProfile) => !u.is_subscribed);
            if (nonSub) {
              setDemoUser(nonSub);
            }
          }
        }
      })
      .catch((e) => console.error("Error fetching users:", e));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0b10] text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Ambient background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <TopHeader
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setActiveTab("profile")}
      />

      {/* Main Content Area (Max width md for mobile-first experience) */}
      <div className="w-full max-w-md mx-auto px-4 flex-1 pt-2">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HomeView
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === "consult" && (
            <motion.div
              key="consult"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BookingView
                onOpenAuth={() => setIsAuthOpen(true)}
                onBookingCreated={() => setActiveTab("home")}
              />
            </motion.div>
          )}

          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MemberDashboard onOpenAuth={() => setIsAuthOpen(true)} />
            </motion.div>
          )}

          {activeTab === "raffle" && (
            <motion.div
              key="raffle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RaffleView />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileView
                onOpenAuth={() => setIsAuthOpen(true)}
                availableDemoUsers={availableDemoUsers}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        raffleCountBadge={1}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        availableDemoUsers={availableDemoUsers}
      />
    </main>
  );
}

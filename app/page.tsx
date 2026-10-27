"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, DbUserProfile } from "@/context/AuthContext";
import { BottomNav, TabType } from "@/components/layout/BottomNav";
import { TopHeader } from "@/components/layout/TopHeader";
import { HomeView } from "@/components/home/HomeView";
import { BookingView } from "@/components/booking/BookingView";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";
import { ProspectiveEmployeeHub } from "@/components/recruitment/ProspectiveEmployeeHub";
import { EmployerHub } from "@/components/recruitment/EmployerHub";
import { AdminPlacementDesk } from "@/components/recruitment/AdminPlacementDesk";
import { RaffleView } from "@/components/raffle/RaffleView";
import { ProfileView } from "@/components/profile/ProfileView";
import { AuthModal } from "@/components/auth/AuthModal";

export default function App() {
  const { dbUser, setDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [careersRoleView, setCareersRoleView] = useState<
    "employee" | "employer" | "admin"
  >("admin");
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

      {/* Main Content Area (Mobile-first with responsive expansion for split-screen views) */}
      <div className="w-full max-w-md md:max-w-3xl mx-auto px-4 flex-1 pt-2">
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
                onNavigate={(tab, roleMode) => {
                  if (roleMode) setCareersRoleView(roleMode);
                  setActiveTab(tab);
                }}
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

          {activeTab === "careers" && (
            <motion.div
              key="careers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Recruitment Marketplace 3-Way Role Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-chef-card border border-white/10">
                <button
                  type="button"
                  onClick={() => setCareersRoleView("employee")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all ${
                    careersRoleView === "employee"
                      ? "bg-brand-500 text-white shadow-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Talent (PE)
                </button>
                <button
                  type="button"
                  onClick={() => setCareersRoleView("employer")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all ${
                    careersRoleView === "employer"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Employer Hub
                </button>
                <button
                  type="button"
                  onClick={() => setCareersRoleView("admin")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all ${
                    careersRoleView === "admin"
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Admin Desk
                </button>
              </div>

              {careersRoleView === "employee" && <ProspectiveEmployeeHub />}
              {careersRoleView === "employer" && <EmployerHub />}
              {careersRoleView === "admin" && <AdminPlacementDesk />}
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

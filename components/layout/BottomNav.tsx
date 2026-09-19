"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  CalendarDays,
  Sparkles,
  GraduationCap,
  User as UserIcon,
} from "lucide-react";

export type TabType = "home" | "consult" | "courses" | "raffle" | "profile";

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  raffleCountBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  raffleCountBadge,
}) => {
  const tabs = [
    { id: "home" as TabType, label: "Home", icon: UtensilsCrossed },
    { id: "consult" as TabType, label: "Book", icon: CalendarDays },
    { id: "courses" as TabType, label: "Training", icon: GraduationCap },
    {
      id: "raffle" as TabType,
      label: "5% Raffle",
      icon: Sparkles,
      badge: raffleCountBadge,
    },
    { id: "profile" as TabType, label: "Profile", icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-auto">
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-chef-dark/85 px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-brand-600/30 to-brand-500/20 border border-brand-500/40 rounded-2xl"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-brand-400" : "text-slate-400"
                    }`}
                  />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-brand-500 text-white text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-pulse">
                      5%
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium mt-1 tracking-tight transition-colors duration-200 ${
                    isActive ? "text-brand-300 font-semibold" : "text-slate-400"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

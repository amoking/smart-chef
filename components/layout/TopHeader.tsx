"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Flame, Sparkles, LogIn, Crown } from "lucide-react";
import Image from "next/image";

interface TopHeaderProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, dbUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full max-w-md mx-auto px-4 pt-3 pb-2">
      <div className="glass-panel rounded-2xl border border-white/10 px-4 py-2.5 flex items-center justify-between shadow-lg backdrop-blur-xl bg-chef-dark/80">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shadow-glow">
            <Flame className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-sm tracking-tight text-white">
                SMART CHEF
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Culinary Art & Mentorship
            </p>
          </div>
        </div>

        {/* User Status / Login */}
        <div className="flex items-center space-x-2">
          {dbUser || user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-1.5 pr-2.5 py-1 transition-all"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                {dbUser?.photoURL || user?.photoURL ? (
                  <Image
                    src={dbUser?.photoURL || user?.photoURL || ""}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (dbUser?.displayName?.[0] || user?.displayName?.[0] || "U").toUpperCase()
                )}
                {dbUser?.is_subscribed && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-chef-dark flex items-center justify-center" />
                )}
              </div>
              <span className="text-xs font-medium text-slate-200 max-w-[70px] truncate">
                {dbUser?.displayName?.split(" ")[0] || "Account"}
              </span>
              {dbUser?.is_subscribed ? (
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ) : (
                <span className="text-[9px] bg-brand-500/20 text-brand-300 font-bold px-1 rounded">
                  Free
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

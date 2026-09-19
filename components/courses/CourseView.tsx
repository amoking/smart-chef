"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MpesaModal } from "@/components/mpesa/MpesaModal";
import {
  GraduationCap,
  Crown,
  Check,
  Smartphone,
  Sparkles,
  Lock,
  PlayCircle,
  Clock,
} from "lucide-react";

interface CourseViewProps {
  onOpenAuth: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ onOpenAuth }) => {
  const { dbUser, refreshDbUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    amount: number;
    transactionType: "SUBSCRIPTION" | "COURSE_ACCESS";
  } | null>(null);

  const courses = [
    {
      id: "course_1",
      title: "Art of French Pastry & Macaron Masterclass",
      instructor: "Chef Sarah Wanjiku",
      lessons: 14,
      duration: "4.5 Hours",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "course_2",
      title: "Coastal Swahili Spice Chemistry & Seafood",
      instructor: "Chef David Kiprono",
      lessons: 10,
      duration: "3.2 Hours",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handlePurchase = (
    title: string,
    amount: number,
    transactionType: "SUBSCRIPTION" | "COURSE_ACCESS"
  ) => {
    if (!dbUser) {
      onOpenAuth();
      return;
    }
    setSelectedProduct({ title, amount, transactionType });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-widest font-bold text-brand-400">
          Professional Culinary Skills
        </span>
        <h2 className="text-2xl font-black text-white mt-0.5">
          Masterclasses & Memberships
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Instant access with Safaricom M-Pesa Daraja payment integration.
        </p>
      </div>

      {/* Subscription Tier Banner */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-[#211812] via-[#1a1410] to-[#0d0e12] border border-brand-500/40 shadow-xl">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              Chef Pro VIP Subscription
            </span>
          </div>
          {dbUser?.is_subscribed && (
            <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
              ACTIVE
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-white">KES 4,999</span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Unlimited masterclasses, priority consultation booking slots, and direct WhatsApp chef chat.
          </p>
        </div>

        <ul className="space-y-2 text-xs text-slate-300 mb-5">
          <li className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>All HD Masterclasses Included</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>20% Discount on In-Person Face-to-Face Consultations</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Exclusive Monthly Chef Roundtables</span>
          </li>
        </ul>

        {dbUser?.is_subscribed ? (
          <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            You are an Active VIP Subscriber
          </div>
        ) : (
          <button
            onClick={() =>
              handlePurchase(
                "Chef Pro VIP Monthly Subscription",
                4999,
                "SUBSCRIPTION"
              )
            }
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-brand-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-slate-950 font-black text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>Subscribe via M-Pesa (KES 4,999)</span>
          </button>
        )}
      </div>

      {/* Individual Courses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            <span>Featured Masterclasses</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {dbUser?.has_course_access ? "Full Access Unlocked" : "One-time Pass"}
          </span>
        </div>

        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl bg-chef-card border border-white/5 overflow-hidden hover:border-white/10 transition-all"
            >
              <div className="h-32 relative bg-slate-800">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chef-card via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-brand-400" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-white leading-snug">
                  {course.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  By {course.instructor} • {course.lessons} Practical Modules
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <span className="text-xs font-bold text-slate-300">
                    KES 2,500 (All Modules)
                  </span>

                  {dbUser?.has_course_access || dbUser?.is_subscribed ? (
                    <button className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Watch Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handlePurchase(course.title, 2500, "COURSE_ACCESS")
                      }
                      className="flex items-center space-x-1 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Unlock with M-Pesa</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* M-Pesa Checkout Modal */}
      {selectedProduct && (
        <MpesaModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.title}
          amount={selectedProduct.amount}
          transactionType={selectedProduct.transactionType}
          onSuccess={async () => {
            await refreshDbUser();
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

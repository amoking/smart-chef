"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmployerHub } from "@/components/recruitment/EmployerHub";

export default function EmployerPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto px-4 pt-4 flex-1">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Smart Chef Home</span>
          </Link>
        </div>

        <EmployerHub />
      </div>
    </main>
  );
}


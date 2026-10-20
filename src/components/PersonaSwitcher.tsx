'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Users, Shield, Award, GraduationCap, UserCheck, HelpCircle } from 'lucide-react';

export const PersonaSwitcher: React.FC = () => {
  const { currentUser, users, switchUser, setIsTraceabilityOpen } = useApp();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'authorized_overall_coordinator':
        return { label: 'Overall Coordinator (4th Yr)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'faculty_advisor':
        return { label: 'Faculty Advisor', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'moderator':
        return { label: 'Platform Moderator', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'alumni':
        return { label: 'Verified Alumni', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'Student Maker', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  return (
    <aside aria-label="SRS prototype simulation toolbar" className="bg-slate-950/80 border-b border-indigo-900/30 backdrop-blur-md px-4 py-2 sticky top-0 z-40 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SRS v0.1 Prototype Mode
          </div>
          <span className="hidden sm:inline text-slate-400 text-xs">
            Simulate RBAC &amp; Governance Roles:
          </span>
        </div>

        {/* Persona quick switch buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {users.map((u) => {
            const isSelected = u.id === currentUser.id;
            const badge = getRoleBadge(u.role);
            return (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm shadow-indigo-500/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                }`}
                title={`Switch view to ${u.name} (${badge.label})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                <span>{u.name.split(' ')[0]}</span>
                <span className={`hidden md:inline text-[10px] px-1 py-0.2 rounded border ${badge.color}`}>
                  {u.role === 'authorized_overall_coordinator' ? 'Coord' : u.role === 'faculty_advisor' ? 'Faculty' : u.role === 'moderator' ? 'Mod' : u.role === 'alumni' ? 'Alumni' : 'Student'}
                </span>
              </button>
            );
          })}
        </div>

        {/* SRS Traceability matrix toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTraceabilityOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-600 font-medium transition-colors cursor-pointer text-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>SRS Compliance Matrix</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

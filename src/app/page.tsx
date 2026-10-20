'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';
import { Navbar } from '@/components/Navbar';
import { FeedView } from '@/components/FeedView';
import { ProjectsView } from '@/components/ProjectsView';
import { ExploreView } from '@/components/ExploreView';
import { CertificationCenterView } from '@/components/CertificationCenterView';
import { ModerationView } from '@/components/ModerationView';
import { ProfileView } from '@/components/ProfileView';
import { ProjectCreateModal } from '@/components/ProjectCreateModal';
import { NotificationsDrawer } from '@/components/NotificationsDrawer';
import { SearchModal } from '@/components/SearchModal';
import { SrsTraceabilityDrawer } from '@/components/SrsTraceabilityDrawer';
import { ToastContainer } from '@/components/ToastContainer';
import { Sparkles, Shield, Heart, ExternalLink } from 'lucide-react';

export default function Home() {
  const { activeTab, setIsTraceabilityOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Persona & RBAC Simulation Toolbar */}
      <PersonaSwitcher />

      {/* Main Header / Navigation */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'feed' && <FeedView />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'certifications' && <CertificationCenterView />}
        {activeTab === 'moderation' && <ModerationView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals & Drawers */}
      <ProjectCreateModal />
      <NotificationsDrawer />
      <SearchModal />
      <SrsTraceabilityDrawer />
      <ToastContainer />

      {/* Site Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              IC
            </div>
            <span>
              NIT Raipur Innovation Cell • Student Portfolio Platform (SRS v0.1 Prototype)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsTraceabilityOpen(true)}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Traceability Matrix</span>
            </button>
            <span>•</span>
            <span className="text-slate-500">Prepared by Aditya Sahu, Technical Domain</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  FolderKanban, 
  Compass, 
  Award, 
  ShieldAlert, 
  Bell, 
  Search, 
  Plus, 
  User as UserIcon,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    notifications, 
    setIsNotificationDrawerOpen, 
    setIsSearchModalOpen, 
    setIsCreateProjectOpen,
    certificationRequests,
    moderationReports,
    setSelectedUserId,
    setSelectedProjectId
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingCertCount = certificationRequests.filter(r => r.state === 'pending').length;
  const pendingModCount = moderationReports.filter(r => r.status === 'pending').length;

  const isReviewer = currentUser.role === 'faculty_advisor' || currentUser.role === 'authorized_overall_coordinator';
  const isModerator = currentUser.role === 'moderator' || currentUser.role === 'faculty_advisor';

  const handleNav = (tab: any) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
    if (tab === 'profile') {
      setSelectedUserId(currentUser.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl sticky top-9 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('feed')}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    NIT Raipur <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">I-Cell</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-700/50 text-indigo-300">
                    Platform
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Student Portfolio &amp; Innovation Governance
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleNav('feed')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Feeds</span>
            </button>

            <button
              onClick={() => handleNav('projects')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => handleNav('explore')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => handleNav('certifications')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer relative ${
                activeTab === 'certifications'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certification</span>
              {isReviewer && pendingCertCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {pendingCertCount}
                </span>
              )}
            </button>

            {isModerator && (
              <button
                onClick={() => handleNav('moderation')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer relative ${
                  activeTab === 'moderation'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Moderation</span>
                {pendingModCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                    {pendingModCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Button (Ctrl+K) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs font-medium cursor-pointer"
              title="Search Projects, People, Skills (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Quick Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-400">
                Ctrl K
              </kbd>
            </button>

            {/* Create Project Button */}
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            {/* In-App Notifications Bell (FR-NOTIF-01) */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="View in-app notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-900">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Current User Profile Avatar Pill */}
            <button
              onClick={() => handleNav('profile')}
              className={`flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-950/80 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40" 
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold leading-none">{currentUser.name.split(' ')[0]}</span>
                  {currentUser.certificationStatus === 'approved' && (
                    <span title="Certified Student Profile">
                      <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {currentUser.batch}
                </span>
              </div>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-slate-800 flex flex-col gap-1.5 animate-in fade-in">
            <button
              onClick={() => handleNav('feed')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'feed' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Feeds</span>
            </button>
            <button
              onClick={() => handleNav('projects')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects Showcase</span>
            </button>
            <button
              onClick={() => handleNav('explore')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'explore' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Students &amp; Skills</span>
            </button>
            <button
              onClick={() => handleNav('certifications')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'certifications' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Certification Portal</span>
              </div>
              {pendingCertCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                  {pendingCertCount} pending
                </span>
              )}
            </button>
            {isModerator && (
              <button
                onClick={() => handleNav('moderation')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'moderation' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Moderation Queue</span>
                </div>
                {pendingModCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {pendingModCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

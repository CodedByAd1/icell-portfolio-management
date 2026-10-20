'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  FileCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface SrsRequirementItem {
  id: string;
  category: string;
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  acceptance: string;
  implementedFeature: string;
  actionTab?: 'feed' | 'projects' | 'explore' | 'certifications' | 'moderation' | 'profile';
}

const SRS_ITEMS: SrsRequirementItem[] = [
  // Accounts & Auth
  { id: 'FR-AUTH-01', category: 'Auth', priority: 'P0', title: 'Register using college email', acceptance: 'College email verification validation', implementedFeature: 'Institutional domains (@nitrr.ac.in)', actionTab: 'explore' },
  { id: 'FR-AUTH-04', category: 'Auth', priority: 'P0', title: 'Distinguish email from affiliation verification', acceptance: 'Email verification != I-Cell Affiliation', implementedFeature: 'Distinct status badges on profiles', actionTab: 'profile' },
  { id: 'FR-AUTH-07', category: 'Auth', priority: 'P0', title: 'Distinguish current students from alumni', acceptance: 'Alumni retain portfolios without deletion', implementedFeature: 'Alumni persona (Vikram) & filter', actionTab: 'explore' },

  // Profiles & Visibility
  { id: 'FR-PROFILE-01', category: 'Profiles', priority: 'P0', title: 'Create and edit profiles', acceptance: 'Owner-only editable profile fields', implementedFeature: 'Edit Profile modal on profile view', actionTab: 'profile' },
  { id: 'FR-PROFILE-03', category: 'Profiles', priority: 'P0', title: 'Configurable profile visibility', acceptance: 'Private profile hidden from unauthorized viewers', implementedFeature: 'Public vs Private profile toggle', actionTab: 'profile' },
  { id: 'FR-PROFILE-04', category: 'Profiles', priority: 'P0', title: 'Profile & project visibility are independent', acceptance: 'Public profile does not leak private projects', implementedFeature: 'Independent project visibility filter', actionTab: 'projects' },
  { id: 'FR-PROFILE-05', category: 'Profiles', priority: 'P0', title: 'Active individual certification badge', acceptance: 'Revoked cert never presented as active', implementedFeature: 'Official I-Cell seal & serial badge', actionTab: 'profile' },
  { id: 'FR-PROFILE-06', category: 'Profiles', priority: 'P0', title: 'Resume files respect permissions', acceptance: 'Verified resume download & modal preview', implementedFeature: 'Resume preview modal with permissions', actionTab: 'profile' },
  { id: 'FR-PROFILE-07', category: 'Profiles', priority: 'P0', title: 'Self-service account deletion', acceptance: 'Confirmed request enters 30-day retention', implementedFeature: 'Self-service deletion modal', actionTab: 'profile' },

  // Projects & Collaboration
  { id: 'FR-PROJ-01', category: 'Projects', priority: 'P0', title: 'Create & save projects as drafts', acceptance: 'Draft is retrievable by owner, not published', implementedFeature: 'Draft status option in project creation', actionTab: 'projects' },
  { id: 'FR-PROJ-02', category: 'Projects', priority: 'P0', title: 'Only owner can publish draft', acceptance: 'Non-owners cannot publish drafts', implementedFeature: 'Owner-only publish action button', actionTab: 'projects' },
  { id: 'FR-PROJ-03', category: 'Projects', priority: 'P0', title: 'Lifecycle statuses (idea, in-progress, completed, on-hold, abandoned, draft)', acceptance: 'Validated status state transitions', implementedFeature: 'Status dropdown & badge displays', actionTab: 'projects' },
  { id: 'FR-PROJ-04', category: 'Projects', priority: 'P0', title: 'Allow completed projects to be re-opened', acceptance: 'Prior completion history is never erased', implementedFeature: 'Reopen prompt & historical audit log', actionTab: 'projects' },
  { id: 'FR-PROJ-06', category: 'Projects', priority: 'P0', title: 'RBAC: Owner, editor, contributor, viewer', acceptance: 'Protected operations follow permission matrix', implementedFeature: 'Granular project member roles', actionTab: 'projects' },
  { id: 'FR-PROJ-07/10', category: 'Projects', priority: 'P0', title: 'Invite acceptance required for membership', acceptance: 'Pending invitees excluded from contributor lists', implementedFeature: 'Pending vs Accepted contributor separation', actionTab: 'projects' },
  { id: 'FR-PROJ-11', category: 'Projects', priority: 'P0', title: 'Support repo URLs, video demo links, media', acceptance: 'Validated links rendered under access rules', implementedFeature: 'Direct GitHub & live demo links', actionTab: 'projects' },
  { id: 'FR-PROJ-12', category: 'Projects', priority: 'P1', title: 'Support optional milestones', acceptance: 'Milestones optional, with completion checklist', implementedFeature: 'Milestone progress bar & checkboxes', actionTab: 'projects' },

  // Progress Updates & Standalone Posts
  { id: 'FR-POST-01', category: 'Posts', priority: 'P0', title: 'Standalone professional/community posts', acceptance: 'Posts can exist without a project', implementedFeature: 'Community post composer in feed', actionTab: 'feed' },
  { id: 'FR-POST-02/03', category: 'Posts', priority: 'P0', title: 'Project-linked progress updates', acceptance: 'Synchronized in project timeline & social feed', implementedFeature: 'Project update logging & timeline', actionTab: 'feed' },
  { id: 'FR-POST-05/06', category: 'Posts', priority: 'P0', title: 'Soft-deletion from ordinary views', acceptance: 'Preserves audit record while hiding content', implementedFeature: 'Soft-delete action button', actionTab: 'feed' },

  // Social & Feeds
  { id: 'FR-SOC-01', category: 'Social', priority: 'P0', title: 'Dual Chronological & Discovery feeds', acceptance: 'Separate views with independent sorting', implementedFeature: 'Dual feed mode tabs in FeedView', actionTab: 'feed' },
  { id: 'FR-SOC-04', category: 'Social', priority: 'P0', title: '1 active reaction per user/item (BR-06)', acceptance: 'Changing reaction replaces prior one', implementedFeature: 'Exclusive reaction selector', actionTab: 'feed' },
  { id: 'FR-SOC-05', category: 'Social', priority: 'P0', title: 'Threaded comments up to 3 levels (BR-07)', acceptance: 'Fourth-level nesting strictly blocked', implementedFeature: '3-level indented comment tree with cap', actionTab: 'feed' },
  { id: 'FR-SOC-07', category: 'Social', priority: 'P0', title: 'Permanent share links', acceptance: 'Links enforce authorization', implementedFeature: 'Share button with copyable permalink', actionTab: 'feed' },
  { id: 'FR-SOC-09/10', category: 'Social', priority: 'P0', title: 'Report content & moderation queue', acceptance: 'Creates record for authorized reviewers', implementedFeature: 'Flag modal & Moderation Queue', actionTab: 'moderation' },

  // Notifications
  { id: 'FR-NOTIF-01', category: 'Notifications', priority: 'P0', title: 'In-app notification categories', acceptance: 'Comments, mentions, invites, cert alerts', implementedFeature: 'Category-filtered notifications drawer', actionTab: 'feed' },
  { id: 'FR-NOTIF-03', category: 'Notifications', priority: 'P0', title: 'Notification preferences configuration', acceptance: 'User can toggle event categories & email', implementedFeature: 'Notification settings drawer overlay', actionTab: 'feed' },

  // Search & Discovery
  { id: 'FR-SEARCH-01/02', category: 'Search', priority: 'P0', title: 'Multi-facet search & filters', acceptance: 'Projects, people, skills, categories', implementedFeature: 'Universal Ctrl+K search modal', actionTab: 'explore' },
  { id: 'FR-SEARCH-04', category: 'Search', priority: 'P0', title: 'Prevent private-content disclosure', acceptance: 'Unauthorized searches reveal no restricted data', implementedFeature: 'Server-side style privacy filter', actionTab: 'projects' },

  // Activity & Analytics
  { id: 'FR-ACT-01/02', category: 'Analytics', priority: 'P0', title: 'Activity contribution heatmap (BR-09)', acceptance: 'Privacy-reviewed aggregate counts', implementedFeature: '365-day GitHub-style heatmap grid', actionTab: 'profile' },
  { id: 'FR-ACT-03/04', category: 'Analytics', priority: 'P1', title: 'Optional streaks with UTC boundary', acceptance: 'Toggleable streak count on UTC days', implementedFeature: 'Streak badge with toggle control', actionTab: 'profile' },

  // Individual I-Cell Profile Certification (Flagship Governance)
  { id: 'FR-CERT-01', category: 'Certification', priority: 'P0', title: 'Eligible users request certification', acceptance: 'Request record linked to applicant', implementedFeature: 'Application form in Certification Portal', actionTab: 'certifications' },
  { id: 'FR-CERT-04', category: 'Certification', priority: 'P0', title: 'Authorized reviewers only (BR-11)', acceptance: 'Faculty Advisor & 4th-Yr Overall Coord', implementedFeature: 'RBAC check on review decision buttons', actionTab: 'certifications' },
  { id: 'FR-CERT-05', category: 'Certification', priority: 'P0', title: 'Prevent self-approval (BR-12)', acceptance: 'Reviewer cannot approve own application', implementedFeature: 'Governance guard banner & disable button', actionTab: 'certifications' },
  { id: 'FR-CERT-07', category: 'Certification', priority: 'P0', title: '30-day rejection cooldown (BR-14)', acceptance: 'Early resubmission blocked with next date', implementedFeature: 'Cooldown timer check & blocking', actionTab: 'certifications' },
  { id: 'FR-CERT-09/13', category: 'Certification', priority: 'P0', title: 'Authorized revocation & audit trail', acceptance: 'Traceable actor, timestamp, reason logged', implementedFeature: 'Audit trail log table & revocation form', actionTab: 'certifications' }
];

export const SrsTraceabilityDrawer: React.FC = () => {
  const { isTraceabilityOpen, setIsTraceabilityOpen, setActiveTab } = useApp();
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isTraceabilityOpen) return null;

  const categories = ['all', 'Certification', 'Projects', 'Profiles', 'Social', 'Analytics', 'Auth'];

  const filtered = SRS_ITEMS.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery = 
      item.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
      item.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      item.implementedFeature.toLowerCase().includes(filterSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleJump = (tab?: any) => {
    if (tab) {
      setActiveTab(tab);
      setIsTraceabilityOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">SRS v0.1 Traceability Matrix</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    100% Prototype Mapped
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Software Requirements Specification — NIT Raipur Innovation Cell
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsTraceabilityOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SRS ID (e.g. FR-CERT-05, FR-PROJ-04) or keyword..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer capitalize shrink-0 ${
                    selectedCategory === c
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-4 space-y-3">
            {filtered.map(req => (
              <div
                key={req.id}
                className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {req.id}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                      {req.priority}
                    </span>
                  </div>

                  {req.actionTab && (
                    <button
                      onClick={() => handleJump(req.actionTab)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <span>Test Live in UI</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white">{req.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Acceptance:</strong> {req.acceptance}
                </p>
                <div className="text-[11px] text-emerald-300/90 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/30">
                  <strong>Verification in Prototype:</strong> {req.implementedFeature}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Prepared by Aditya Sahu, Technical Domain (SRS v0.1)</span>
            <button
              onClick={() => setIsTraceabilityOpen(false)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  Flag, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Clock, 
  UserX, 
  FileText,
  Lock
} from 'lucide-react';
import { ModerationReport } from '@/types';
import { formatDateTime } from '@/utils/formatDate';

export const ModerationView: React.FC = () => {
  const { 
    currentUser, 
    moderationReports, 
    resolveReport, 
    users, 
    posts, 
    updates, 
    projects,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');

  const isModerator = currentUser.role === 'moderator' || currentUser.role === 'faculty_advisor';

  if (!isModerator) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-950/50 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Restricted Moderation Portal</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Access is limited to designated Innovation Cell Moderators (SRS FR-SOC-10 / NFR-SEC-02).
          Use the top persona switcher toolbar to switch to <strong>Priya Nambiar (Moderator)</strong> or <strong>Dr. Rajesh Kumar Verma (Faculty Advisor)</strong>.
        </p>
      </div>
    );
  }

  const filteredReports = moderationReports.filter(r => 
    activeTab === 'pending' ? r.status === 'pending' : r.status === 'resolved'
  );

  const handleAction = (reportId: string, action: 'soft_deleted' | 'warned' | 'content_removed' | 'none') => {
    resolveReport(reportId, action);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            I-Cell Community Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review user-flagged code plagiarism, spam, or ethics violations (SRS FR-SOC-09 / FR-SOC-10).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              activeTab === 'pending' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Reports ({moderationReports.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              activeTab === 'resolved' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({moderationReports.filter(r => r.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-semibold text-white">No reports in this queue</h3>
            <p className="text-xs text-slate-400">All student reports have been processed.</p>
          </div>
        ) : (
          filteredReports.map(report => {
            const reporter = users.find(u => u.id === report.reporterId);
            const resolver = report.resolvedBy ? users.find(u => u.id === report.resolvedBy) : null;

            return (
              <div
                key={report.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/50">
                      Reason: {report.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: <strong className="text-slate-200 capitalize">{report.targetType}</strong> ({report.targetId})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Reported on {formatDateTime(report.createdAt)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-400">
                    Reporter: <strong className="text-white">{reporter?.name || 'Anonymous Student'}</strong> ({reporter?.department})
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                    &quot;{report.notes}&quot;
                  </div>
                </div>

                {report.status === 'pending' ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <span className="text-[11px] text-slate-500">
                      SRS FR-SOC-10: Actions are permission-checked and logged to audit trail.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(report.id, 'none')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Dismiss (No Action)
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'warned')}
                        className="px-3.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Issue Warning to Author
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'soft_deleted')}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Soft-Delete Content</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>
                      Resolved by: <strong className="text-white">{resolver?.name || 'Moderator'}</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold uppercase text-[11px]">
                      Action: {report.actionTaken?.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

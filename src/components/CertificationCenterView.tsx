'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Clock, 
  UserCheck, 
  Lock, 
  History, 
  Check, 
  Info,
  AlertCircle
} from 'lucide-react';
import { CertificationRequest } from '@/types';
import { formatDate, formatDateTime } from '@/utils/formatDate';

export const CertificationCenterView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    certificationRequests, 
    auditLogs, 
    decideCertification, 
    revokeCertification,
    submitCertificationRequest,
    setSelectedUserId,
    setActiveTab,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'all' | 'audit' | 'request'>('pending');
  const [decisionNotes, setDecisionNotes] = useState<{ [reqId: string]: string }>({});
  
  // Student self-request form state
  const [reqRollNo, setReqRollNo] = useState('');
  const [reqStatement, setReqStatement] = useState('');
  const [reqPortfolioLinks, setReqPortfolioLinks] = useState('');
  const [reqEvidence, setReqEvidence] = useState('');

  const isReviewer = currentUser.role === 'faculty_advisor' || currentUser.role === 'authorized_overall_coordinator';
  const pendingRequests = certificationRequests.filter(r => r.state === 'pending');
  const userRequest = certificationRequests.find(r => r.applicantId === currentUser.id);

  const handleReviewDecision = (req: CertificationRequest, decision: 'approved' | 'rejected') => {
    const note = decisionNotes[req.id]?.trim() || (decision === 'approved' ? 'Verified portfolio claims and institutional affiliation.' : 'Incomplete portfolio requirements.');
    const success = decideCertification(req.id, decision, note);
    if (success) {
      setDecisionNotes(prev => ({ ...prev, [req.id]: '' }));
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqRollNo.trim() || !reqStatement.trim()) {
      showToast('Please provide your institute Roll Number and statement.', 'warning');
      return;
    }

    const links = reqPortfolioLinks.split('\n').map(l => l.trim()).filter(Boolean);
    submitCertificationRequest(reqRollNo.trim(), reqStatement.trim(), links, reqEvidence.trim());
    setReqRollNo('');
    setReqStatement('');
    setReqPortfolioLinks('');
    setReqEvidence('');
    setActiveSubTab('all');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SRS Section 4.9 Governance Workflow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NIT Raipur I-Cell Profile Certification Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Person-level technical accreditation validating student identity, academic affiliation, and verifiable engineering claims.
            Restricted to the Faculty Advisor and Authorized 4th-Year Overall Coordinators (SRS FR-CERT-04 / BR-11).
          </p>
        </div>
      </div>

      {/* Reviewer Authority Notification Banner */}
      {isReviewer ? (
        <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Authorized Reviewer Active: <strong>{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()}).
              You have privileged authority to approve or reject student certifications.
            </span>
          </div>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-emerald-900/60 font-mono text-[11px]">
            FR-CERT-04 Active
          </span>
        </div>
      ) : (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              You are signed in as a student/alumni member. You can submit your portfolio for I-Cell certification below.
            </span>
          </div>
          <button
            onClick={() => setActiveSubTab('request')}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {isReviewer && (
            <button
              onClick={() => setActiveSubTab('pending')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'pending'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Review Queue ({pendingRequests.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>All Decisions &amp; Records</span>
          </button>

          <button
            onClick={() => setActiveSubTab('request')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'request'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Submit Application (FR-CERT-01)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail (FR-CERT-13)</span>
          </button>
        </div>
      </div>

      {/* Tab: Pending Review Queue (FR-CERT-03, 04, 05) */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-semibold text-white">Review queue is clear</h3>
              <p className="text-xs text-slate-400">All submitted student certification applications have been processed.</p>
            </div>
          ) : (
            pendingRequests.map(req => {
              const applicant = users.find(u => u.id === req.applicantId);
              if (!applicant) return null;
              
              // CRITICAL GOVERNANCE CHECK (BR-12 / FR-CERT-05): Self approval prevention!
              const isSelf = applicant.id === currentUser.id;

              return (
                <div
                  key={req.id}
                  className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 ${
                    isSelf ? 'border-amber-700/60 bg-amber-950/10' : 'border-slate-800'
                  }`}
                >
                  {/* Applicant identity snapshot */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-start gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={applicant.avatar}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">{applicant.name}</h3>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                            Roll: {req.studentRollNumber}
                          </span>
                          <span className="text-xs text-slate-400">{applicant.department}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Submitted on {formatDate(req.submittedAt)} • Profile Snapshot: {req.profileSnapshotDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedUserId(applicant.id);
                        setActiveTab('profile');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all self-start"
                    >
                      <span>View Full Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Application Statement & Evidence */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Candidate Statement:</span>
                      <p className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-slate-300 leading-relaxed">
                        {req.statement}
                      </p>
                    </div>

                    {req.evidenceNotes && (
                      <div>
                        <span className="font-semibold text-slate-300 block mb-1">Evidence &amp; Verification Proofs:</span>
                        <p className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-slate-400 leading-relaxed">
                          {req.evidenceNotes}
                        </p>
                      </div>
                    )}

                    {req.portfolioLinks && req.portfolioLinks.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-300 block mb-1">Submitted Repository / Publication Links:</span>
                        <div className="flex flex-wrap gap-2">
                          {req.portfolioLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 hover:text-white text-[11px]"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{link.replace('https://', '')}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Self-Approval Block Notice (BR-12 / FR-CERT-05) */}
                  {isSelf ? (
                    <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3 text-amber-200 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Governance Guard Active (BR-12 / FR-CERT-05):</span>
                        You cannot approve or reject your own certification application! Another authorized reviewer (e.g. Faculty Advisor) must adjudicate this submission.
                      </div>
                    </div>
                  ) : (
                    /* Review Decision Controls */
                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          placeholder="Reviewer feedback or approval rationale (Logged to audit trail per FR-CERT-13)..."
                          value={decisionNotes[req.id] || ''}
                          onChange={(e) => setDecisionNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                          className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleReviewDecision(req, 'rejected')}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                            title="Reject application and trigger 30-day cooldown (FR-CERT-07)"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject (30d Cooldown)</span>
                          </button>
                          <button
                            onClick={() => handleReviewDecision(req, 'approved')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
                            title="Grant Official I-Cell Certification (FR-CERT-02)"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve &amp; Issue Seal</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        * Approving issues verifiable serial number and public profile badge. Rejection enforces a mandatory 30-day cooldown (FR-CERT-07).
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: All Records & Statuses */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Student Certification Registry</h3>
              <span className="text-xs text-slate-400">{certificationRequests.length} Total Submissions</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {certificationRequests.map(req => {
                const applicant = users.find(u => u.id === req.applicantId);
                const reviewer = req.reviewerId ? users.find(u => u.id === req.reviewerId) : null;
                if (!applicant) return null;

                return (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-950/30 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{applicant.name}</span>
                          <span className="text-xs text-slate-400">({applicant.department})</span>
                          {req.state === 'approved' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Approved #{req.serialNumber}
                            </span>
                          )}
                          {req.state === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Pending Review
                            </span>
                          )}
                          {req.state === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              Rejected (Cooldown Active)
                            </span>
                          )}
                          {req.state === 'revoked' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Revoked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{req.statement}</p>
                        {reviewer && req.decidedAt && (
                          <p className="text-[11px] text-slate-500 mt-1">
                            Reviewed by {reviewer.name} on {formatDate(req.decidedAt)} — &quot;{req.decisionReason}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {isReviewer && req.state === 'approved' && (
                      <button
                        onClick={() => revokeCertification(applicant.id, 'Failure to maintain academic standing / ethics flag')}
                        className="px-3 py-1 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
                        title="Revoke certification with documented reason (FR-CERT-09)"
                      >
                        Revoke (FR-CERT-09)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Submit Certification Request (FR-CERT-01 / 07 / 08) */}
      {activeSubTab === 'request' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Apply for NIT Raipur I-Cell Profile Certification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify your student identity and project contributions to earn the verified I-Cell seal.
            </p>
          </div>

          {/* Active Cooldown Warning if applicable (FR-CERT-07) */}
          {currentUser.certificationCooldownUntil && new Date(currentUser.certificationCooldownUntil) > new Date() && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex items-start gap-3 text-rose-200 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">30-Day Rejection Cooldown Active (FR-CERT-07):</span>
                Your previous application was rejected. Early resubmission is blocked until{' '}
                <strong>{formatDate(currentUser.certificationCooldownUntil)}</strong> per SRS governance rules.
              </div>
            </div>
          )}

          <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs text-slate-300">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Student Roll Number (NIT Raipur MIS) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 23118021 or 22115014"
                value={reqRollNo}
                onChange={(e) => setReqRollNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Candidate Statement &amp; Key Technical Claims *</label>
              <textarea
                rows={3}
                required
                placeholder="Detail your engineering contributions, research publications, hackathon placements, or open-source leadership..."
                value={reqStatement}
                onChange={(e) => setReqStatement(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Portfolio &amp; Repository Proof Links (one per line)</label>
              <textarea
                rows={3}
                placeholder="https://github.com/nitrr-icell/your-repo&#10;https://ieeexplore.ieee.org/document/...&#10;https://devfolio.co/@..."
                value={reqPortfolioLinks}
                onChange={(e) => setReqPortfolioLinks(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-[11px] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Verification / Faculty Mentor Notes</label>
              <input
                type="text"
                placeholder="e.g. Project mentored by Dr. Rajesh Kumar Verma, FabLab Lab Section B..."
                value={reqEvidence}
                onChange={(e) => setReqEvidence(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={Boolean(currentUser.certificationCooldownUntil && new Date(currentUser.certificationCooldownUntil) > new Date())}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Submit Application for Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Audit Trail (FR-CERT-13) */}
      {activeSubTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                Immutable Certification Audit Trail
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                SRS FR-CERT-13 requirement: Each decision has traceable actor and timestamp; log access is restricted.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {log.action}
                    </span>
                    <span className="text-white font-semibold">{log.actorName}</span>
                    <span className="text-slate-400">acted on {log.targetType}</span>
                  </div>
                  <p className="text-slate-300 mt-1 pl-1">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

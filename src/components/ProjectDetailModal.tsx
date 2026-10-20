'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  ExternalLink, 
  Video, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  Globe, 
  RotateCcw, 
  UserPlus, 
  Check, 
  PlusCircle, 
  Tag, 
  Sparkles,
  Archive,
  ArrowRight
} from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { ProjectMemberRole, ProjectStatus } from '@/types';
import { formatDate } from '@/utils/formatDate';

interface ProjectDetailModalProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ projectId, onClose }) => {
  const { 
    projects, 
    users, 
    currentUser, 
    updates, 
    toggleProjectStatus, 
    reopenProject, 
    inviteCollaborator, 
    respondToInvitation, 
    toggleMilestone, 
    createProgressUpdate,
    setSelectedUserId,
    setActiveTab,
    showToast
  } = useApp();

  const project = projects.find(p => p.id === projectId);
  
  // Reopen modal state
  const [isReopenPromptOpen, setIsReopenPromptOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // Collaborator invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectMemberRole>('contributor');

  // New progress update state inside project
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [newUpdateTags, setNewUpdateTags] = useState('');

  if (!project) return null;

  const owner = users.find(u => u.id === project.ownerId) || currentUser;
  const isOwner = currentUser.id === project.ownerId;
  const currentMembership = project.members.find(m => m.userId === currentUser.id);
  const canEdit = isOwner || currentMembership?.role === 'editor';
  const acceptedMembers = project.members.filter(m => m.status === 'accepted');
  const pendingMembers = project.members.filter(m => m.status === 'pending');
  const projectUpdates = updates.filter(u => u.projectId === project.id && !u.isSoftDeleted);

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;
  const milestoneProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const handleReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      showToast('Please state a reason for reopening this project (FR-PROJ-04).', 'warning');
      return;
    }
    reopenProject(project.id, reopenReason);
    setIsReopenPromptOpen(false);
    setReopenReason('');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteCollaborator(project.id, inviteEmail.trim(), inviteRole);
    setInviteEmail('');
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) {
      showToast('Please provide both title and details.', 'warning');
      return;
    }
    const tags = newUpdateTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    createProgressUpdate(project.id, newUpdateTitle, newUpdateContent, tags);
    setNewUpdateTitle('');
    setNewUpdateContent('');
    setNewUpdateTags('');
    setIsAddingUpdate(false);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in-progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Completed</span>;
      case 'idea':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Idea Stage</span>;
      case 'on-hold':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">On Hold</span>;
      case 'draft':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">Draft (Unpublished)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Abandoned</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cover / Header */}
        <div className="relative h-48 sm:h-64 bg-slate-950 overflow-hidden shrink-0">
          {project.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/40">
              {project.category}
            </span>
            {getStatusBadge(project.status)}
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
              project.visibility === 'public'
                ? 'bg-slate-900/80 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/80 text-amber-300 border-amber-500/40'
            }`}>
              {project.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {project.visibility === 'public' ? 'Public' : 'Private (Protected)'}
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl line-clamp-2">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Action Row: Status Transitions & Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {/* Repository link (FR-FILE-05: stores repo URLs without OAuth) */}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-medium text-slate-200 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/50 hover:border-indigo-500 text-xs font-medium text-indigo-300 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400" />
                </a>
              )}

              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/50 hover:border-rose-500 text-xs font-medium text-rose-300 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Demo</span>
                  <ExternalLink className="w-3 h-3 text-rose-400" />
                </a>
              )}
            </div>

            {/* Owner & Authorized Status Controls */}
            {canEdit && (
              <div className="flex items-center gap-2">
                {project.status === 'draft' && isOwner && (
                  <button
                    onClick={() => toggleProjectStatus(project.id, 'in-progress')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Draft (FR-PROJ-02)</span>
                  </button>
                )}

                {project.status === 'completed' && (
                  <button
                    onClick={() => setIsReopenPromptOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/30 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen Project (FR-PROJ-04)</span>
                  </button>
                )}

                {project.status === 'in-progress' && (
                  <button
                    onClick={() => toggleProjectStatus(project.id, 'completed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Reopen prompt modal */}
          {isReopenPromptOpen && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-bold">
                <RotateCcw className="w-4 h-4" />
                <span>Reopen Completed Project (FR-PROJ-04)</span>
              </div>
              <p className="text-xs text-amber-200/80">
                SRS Requirement FR-PROJ-04 mandates that prior completion history is strictly preserved and logged in the project audit record.
              </p>
              <form onSubmit={handleReopen} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Reason for reopening (e.g. Phase 2 grant approved, new field trial required)..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Confirm Reopen
                </button>
                <button
                  type="button"
                  onClick={() => setIsReopenPromptOpen(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Prior completion / reopen history audit (FR-PROJ-04) */}
          {project.reopenedHistory && project.reopenedHistory.length > 0 && (
            <div className="p-3 bg-slate-950 border border-indigo-900/40 rounded-xl text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Reopened Audit History (FR-PROJ-04):
              </span>
              {project.reopenedHistory.map((h, i) => (
                <div key={i} className="text-slate-400 pl-5">
                  • Reopened on {formatDate(h.reopenedAt)} — Reason: <span className="text-slate-200">&quot;{h.reason}&quot;</span>
                </div>
              ))}
            </div>
          )}

          {/* Description & Tech Stack */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Overview</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              {project.description}
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map(tech => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Milestones Tracker (FR-PROJ-12) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Milestones</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {completedMilestones} / {totalMilestones} Completed ({milestoneProgress}%)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>

            <div className="space-y-2">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => canEdit && toggleMilestone(project.id, m.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    canEdit ? 'cursor-pointer hover:border-slate-600' : ''
                  } ${
                    m.completed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className={m.completed ? 'line-through opacity-80' : 'font-medium'}>
                      {m.title}
                    </span>
                    {m.dueDate && !m.completed && (
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        Due: {formatDate(m.dueDate)}
                      </span>
                    )}
                    {m.completedAt && (
                      <span className="block text-[10px] text-emerald-400 mt-0.5">
                        Completed on {formatDate(m.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members & Invitations (FR-PROJ-05 / 06 / 07 / 10) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Team &amp; Contributors
              </h3>
              <span className="text-[11px] text-slate-400">
                Rule: Only accepted members appear as contributors (FR-PROJ-10)
              </span>
            </div>

            {/* Accepted Contributors List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {acceptedMembers.map(member => {
                const u = users.find(usr => usr.id === member.userId);
                if (!u) return null;
                return (
                  <div key={member.userId} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white truncate">{u.name}</span>
                        {u.certificationStatus === 'approved' && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize block">{member.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pending Invitations list (Visible to editors/owners) */}
            {canEdit && pendingMembers.length > 0 && (
              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Pending Invitations (Excluded from public contributors per FR-PROJ-10):
                </span>
                <div className="space-y-1">
                  {pendingMembers.map(pm => {
                    const u = users.find(usr => usr.id === pm.userId);
                    return (
                      <div key={pm.userId} className="flex items-center justify-between text-xs text-slate-300 pl-4">
                        <span>{u ? u.name : pm.userId} ({pm.role})</span>
                        <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                          Pending acceptance
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If current user has a pending invitation to this project */}
            {currentMembership && currentMembership.status === 'pending' && (
              <div className="p-4 bg-indigo-950/40 border border-indigo-700/60 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-white block">You have been invited to join this project!</span>
                  <span className="text-[11px] text-indigo-300">Role: {currentMembership.role.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => respondToInvitation(project.id, true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Accept Invite
                  </button>
                  <button
                    onClick={() => respondToInvitation(project.id, false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Invite Collaborator Form (Owners & Editors) */}
            {canEdit && (
              <form onSubmit={handleInvite} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <UserPlus className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                <input
                  type="email"
                  placeholder="Invite peer by college email (e.g. asharma.it@nitrr.ac.in)..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as ProjectMemberRole)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="contributor">Contributor</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Send Invite
                </button>
              </form>
            )}
          </div>

          {/* Project Progress Updates Timeline (FR-POST-02 / FR-POST-03) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sprint &amp; Progress Timeline
                </h3>
                <p className="text-[11px] text-slate-400">
                  Chronological development log linked directly to this project.
                </p>
              </div>

              {canEdit && (
                <button
                  onClick={() => setIsAddingUpdate(!isAddingUpdate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-medium cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log Progress</span>
                </button>
              )}
            </div>

            {/* Log Progress Form */}
            {isAddingUpdate && (
              <form onSubmit={handleAddUpdate} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-white">Log Project Progress Update</h4>
                <input
                  type="text"
                  placeholder="Update headline (e.g. Completed telemetry hardware test)..."
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  rows={3}
                  placeholder="Details, technical metrics, test results..."
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
                <input
                  type="text"
                  placeholder="Tags (e.g. Benchmark, Livox, CUDA)"
                  value={newUpdateTags}
                  onChange={(e) => setNewUpdateTags(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUpdate(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Post to Timeline
                  </button>
                </div>
              </form>
            )}

            {/* Timeline entries */}
            {projectUpdates.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 text-xs">
                No progress updates logged yet. {canEdit && 'Click "Log Progress" above to document your development.'}
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {projectUpdates.map(u => {
                  const author = users.find(usr => usr.id === u.authorId);
                  return (
                    <div key={u.id} className="relative space-y-1.5">
                      <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{u.title}</span>
                        <span className="text-[10px] text-slate-500">
                          • {formatDate(u.createdAt)}
                        </span>
                        {author && (
                          <span className="text-[10px] text-indigo-400">by {author.name}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                        {u.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

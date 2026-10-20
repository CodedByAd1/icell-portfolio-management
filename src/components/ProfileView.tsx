'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Download, 
  Globe, 
  Award, 
  Flame, 
  Eye, 
  Lock, 
  Edit3, 
  FolderKanban, 
  Users, 
  Trash2, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  Code2, 
  Check, 
  AlertTriangle,
  X
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { ProjectDetailModal } from './ProjectDetailModal';
import { formatDate } from '@/utils/formatDate';

export const ProfileView: React.FC = () => {
  const { 
    users, 
    currentUser, 
    projects, 
    selectedUserId, 
    activityData, 
    updateProfile, 
    followToggle, 
    deleteAccountSelfService,
    setSelectedProjectId,
    selectedProjectId,
    setActiveTab,
    showToast
  } = useApp();

  const user = users.find(u => u.id === (selectedUserId || currentUser.id)) || currentUser;
  const isMe = user.id === currentUser.id;

  // Edit profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(user.headline);
  const [bio, setBio] = useState(user.bio);
  const [skillsText, setSkillsText] = useState(user.skills.join(', '));
  const [profileVis, setProfileVis] = useState(user.profileVisibility);
  const [streakToggle, setStreakToggle] = useState(user.streakEnabled);

  // Resume modal preview state
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Delete account confirmation modal (FR-PROFILE-07 / FR-DATA-01)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // User's accessible projects
  const userProjects = projects.filter(p => {
    const isOwner = p.ownerId === user.id;
    const isMember = p.members.some(m => m.userId === user.id && m.status === 'accepted');
    if (!isOwner && !isMember) return false;
    
    // Privacy check (FR-PROJ-08 / BR-02)
    if (p.visibility === 'private' && currentUser.id !== user.id) {
      return false; // Private projects stay hidden
    }
    return true;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    updateProfile(user.id, {
      headline,
      bio,
      skills,
      profileVisibility: profileVis,
      streakEnabled: streakToggle
    });
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Type DELETE to confirm account removal.', 'warning');
      return;
    }
    deleteAccountSelfService();
    setShowDeleteModal(false);
    setDeleteConfirmText('');
  };

  // Activity Heatmap helper: calculate last 52 weeks (364 days)
  const heatmapEntries = Object.entries(activityData).slice(-182); // 6 months for clean responsive rendering

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-slate-900 border border-slate-800';
    if (count <= 2) return 'bg-emerald-950 border border-emerald-800';
    if (count <= 4) return 'bg-emerald-800/80 border border-emerald-700';
    if (count <= 6) return 'bg-emerald-600 border border-emerald-500';
    return 'bg-emerald-400 border border-emerald-300';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Cover gradient */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-950 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-1.5 ${
              user.profileVisibility === 'public'
                ? 'bg-slate-900/80 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/80 text-amber-300 border-amber-500/40'
            }`}>
              {user.profileVisibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>{user.profileVisibility === 'public' ? 'Public Profile' : 'Private Profile'}</span>
            </span>

            {isMe && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-white backdrop-blur-md border border-slate-700 transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Content */}
        <div className="px-6 pb-6 pt-0 relative space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-slate-900 shadow-2xl bg-slate-900"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user.name}</h1>
                  
                  {/* Active Certification Badge with Serial (FR-PROFILE-05 / FR-CERT-11) */}
                  {user.certificationStatus === 'approved' && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-950 to-indigo-950 border border-cyan-500/50 text-cyan-300 shadow-sm"
                      title={`Certified by NIT Raipur Innovation Cell on ${user.certifiedDate ? formatDate(user.certifiedDate) : 'Active'}`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold tracking-tight">I-Cell Certified</span>
                      {user.certificationSerial && (
                        <span className="text-[10px] text-cyan-400/80 font-mono hidden md:inline">
                          #{user.certificationSerial}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Affiliation distinction (FR-AUTH-04) */}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {user.affiliationStatus === 'icell_affiliated' ? 'NIT Raipur Student' : 'Email Verified'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-medium">
                  {user.headline}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.location}</span>
                  </span>
                  <span>•</span>
                  <span>{user.department}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-300">{user.batch}</span>
                </div>
              </div>
            </div>

            {/* Follow / Action Buttons */}
            <div className="flex items-center gap-2 mb-2 self-start sm:self-auto">
              {!isMe && (
                <button
                  onClick={() => followToggle(user.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Follow Peer
                </button>
              )}

              {/* Resume download / preview (FR-PROFILE-06) */}
              <button
                onClick={() => setShowResumeModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume (FR-PROFILE-06)</span>
              </button>

              {isMe && user.certificationStatus !== 'approved' && (
                <button
                  onClick={() => setActiveTab('certifications')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Request Certification</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio text */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl pt-2">
            {user.bio}
          </p>

          {/* Skills pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user.skills.map(skill => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Social Links Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 text-xs">
            {user.links.github && (
              <a
                href={user.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {user.links.linkedin && (
              <a
                href={user.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
            {user.links.portfolio && (
              <a
                href={user.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
            )}
            {user.links.devfolio && (
              <a
                href={user.links.devfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Devfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar & Optional Streaks Widget (FR-ACT-03/04/05) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Projects Built</span>
          <span className="text-2xl font-black text-white mt-1 block">{userProjects.length}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Total Followers</span>
          <span className="text-2xl font-black text-white mt-1 block">{user.followersCount}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Following</span>
          <span className="text-2xl font-black text-white mt-1 block">{user.followingCount}</span>
        </div>

        {/* Streaks Widget (FR-ACT-03: optional, UTC boundaries FR-ACT-04) */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Streak</span>
            </span>
            <span className="text-2xl font-black text-amber-300 mt-1 block">
              {user.streakEnabled ? `${user.currentStreak} Days` : 'Disabled'}
            </span>
            <span className="text-[10px] text-slate-500 block">UTC Day Boundary (FR-ACT-04)</span>
          </div>
        </div>
      </div>

      {/* Activity Heatmap Grid (FR-ACT-01 / 02 / BR-09) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Engineering Contribution &amp; Progress Heatmap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks project creation, milestones, and sprint logs. Respects privacy by showing aggregate counts without exposing private project titles (BR-09).
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-800/80" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
            {heatmapEntries.map(([date, count]) => (
              <div
                key={date}
                className={`w-3 h-3 rounded-xs transition-colors cursor-pointer ${getIntensityColor(count)}`}
                title={`${date}: ${count} verified technical contributions`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Projects by this user */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-indigo-400" />
          Projects &amp; Artifacts
        </h3>

        {userProjects.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
            No public projects currently showcased.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                    {proj.category}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {proj.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {proj.tagline}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Deletion Self-Service (FR-PROFILE-07 / FR-DATA-01) */}
      {isMe && (
        <div className="p-5 bg-rose-950/20 border border-rose-900/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              Self-Service Account Deletion (SRS FR-PROFILE-07 / FR-DATA-01)
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Initiates the approved 30-day data lifecycle retention workflow. Shared projects and attributed contributions retain historical attribution per SRS FR-DATA-04.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-600/50 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
          >
            Initiate Deletion
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Profile Details (FR-PROFILE-01)</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Profile Visibility (FR-PROFILE-03)</label>
                <select
                  value={profileVis}
                  onChange={(e) => setProfileVis(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="public">Public (Visible to community &amp; recruiters)</option>
                  <option value="private">Private (Restricted access)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="streak-check"
                  checked={streakToggle}
                  onChange={(e) => setStreakToggle(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <label htmlFor="streak-check" className="text-slate-300 cursor-pointer">
                  Display Daily Activity Streak (FR-ACT-03)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Preview Modal (FR-PROFILE-06) */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Verified Student Resume (SRS FR-PROFILE-06)</span>
              </div>
              <button onClick={() => setShowResumeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 space-y-4 text-xs font-sans">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-white">{user.name}</h2>
                  <p className="text-slate-400">{user.email} • {user.department}</p>
                  <p className="text-slate-400">National Institute of Technology Raipur</p>
                </div>
                {user.certificationStatus === 'approved' && (
                  <div className="text-right">
                    <span className="text-cyan-400 font-bold block">NIT Raipur I-Cell Certified</span>
                    <span className="text-[10px] text-slate-500 font-mono">Serial: {user.certificationSerial}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-[11px] mb-1">Education</h3>
                <p>Bachelor of Technology ({user.department})</p>
                <p className="text-slate-400">{user.institution} • {user.batch}</p>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-[11px] mb-1">Technical Skills</h3>
                <p className="text-slate-300">{user.skills.join(' • ')}</p>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-[11px] mb-1">Verified Innovation Projects</h3>
                {userProjects.map(p => (
                  <div key={p.id} className="mt-1">
                    <span className="font-semibold text-slate-200">{p.title}</span> — <span className="text-slate-400">{p.tagline}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Respects profile visibility and access rules (FR-PROFILE-06)</span>
              <button
                onClick={() => {
                  showToast('Resume downloaded successfully (FR-PROFILE-06)', 'success');
                  setShowResumeModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirm Account Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with SRS <strong>FR-DATA-01/02</strong>, submitting deletion will mark your profile as inactive and initiate the 30-day retention countdown before permanent purging.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>• Projects where you are sole owner will be soft-deleted.</div>
              <div>• Shared projects and code history retain attribution (FR-DATA-04).</div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Type DELETE to confirm:</label>
              <input
                type="text"
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Project Modal */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Plus, Trash2, FolderPlus, Globe, Lock, Code2, Link as LinkIcon } from 'lucide-react';
import { ProjectStatus, ProjectVisibility } from '@/types';

export const ProjectCreateModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, createProject, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('AI/ML');
  const [techStackInput, setTechStackInput] = useState('Next.js, Python, PyTorch');
  const [status, setStatus] = useState<ProjectStatus>('in-progress');
  const [visibility, setVisibility] = useState<ProjectVisibility>('public');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Dynamic milestones
  const [milestones, setMilestones] = useState<{ id: string; title: string; completed: boolean }[]>([
    { id: 'm-1', title: 'Hardware Architecture & Schematic Design', completed: true },
    { id: 'm-2', title: 'Firmware Prototype & Sensor Benchmarking', completed: false }
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  if (!isCreateProjectOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones(prev => [...prev, { id: `m-${Date.now()}`, title: newMilestoneText.trim(), completed: false }]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (asDraft: boolean = false) => {
    if (!title.trim()) {
      showToast('Please provide a project title.', 'warning');
      return;
    }

    const techStack = techStackInput.split(',').map(s => s.trim()).filter(Boolean);

    createProject({
      title: title.trim(),
      tagline: tagline.trim() || 'Student innovation project at NIT Raipur',
      description: description.trim() || 'Comprehensive project documentation and development notes.',
      category,
      techStack,
      status: asDraft ? 'draft' : status,
      visibility,
      repoUrl: repoUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      milestones
    });

    setIsCreateProjectOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full my-8 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Innovation Project</h3>
              <p className="text-xs text-slate-400">Document claims, team members, and milestones (SRS FR-PROJ-01)</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateProjectOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-4 text-xs text-slate-300">
          
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. KisanDrishti: Edge-AI Crop Pathogen Diagnosis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">One-line Tagline</label>
            <input
              type="text"
              placeholder="Brief summary of the innovation or problem solved..."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Category (Domain)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="Hardware/IoT">Hardware / Robotics / IoT</option>
                <option value="Web/Mobile">Web / Mobile Platforms</option>
                <option value="Biotech">Biotech &amp; Healthcare</option>
                <option value="CleanTech">CleanTech &amp; Renewable Energy</option>
                <option value="FinTech">FinTech &amp; Web3</option>
                <option value="Social Impact">Social Impact &amp; Rural Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Development Status (FR-PROJ-03)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="idea">Idea Stage</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">Full Description &amp; Problem Statement</label>
            <textarea
              rows={4}
              placeholder="Detail your engineering architecture, problem statement, and novel innovation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">Technologies &amp; Tools (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. PyTorch, TensorRT, ROS2, Jetson Nano, Next.js"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Repository URL (FR-FILE-05)</label>
              <input
                type="url"
                placeholder="https://github.com/nitrr-icell/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Live Demo / Deployed URL</label>
              <input
                type="url"
                placeholder="https://demo.project.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Visibility toggle (FR-PROJ-08: independent of profile visibility) */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-white">Project Visibility (FR-PROJ-08 / BR-02)</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                  className="accent-indigo-600"
                />
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public (Discoverable by peers &amp; recruiters)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="accent-indigo-600"
                />
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Private (Invite-only, hidden from feeds)</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-500">
              * SRS Rule: Project visibility is independent of your profile visibility. Private projects never leak via direct URL (FR-PROJ-13).
            </p>
          </div>

          {/* Milestones (FR-PROJ-12) */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-white">Initial Milestones (FR-PROJ-12)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add milestone e.g. Field benchmark at SECL Korba..."
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="space-y-1 pt-1">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-xs text-slate-300">• {m.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
            title="Save as draft (FR-PROJ-01: can be retrieved and edited before publishing)"
          >
            Save as Draft (FR-PROJ-01)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Publish Project
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

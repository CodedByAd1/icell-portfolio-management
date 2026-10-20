'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Lock, 
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';
import { ProjectStatus } from '@/types';
import { ProjectDetailModal } from './ProjectDetailModal';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    currentUser, 
    users, 
    setIsCreateProjectOpen, 
    selectedProjectId, 
    setSelectedProjectId 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'AI/ML', 'Hardware/IoT', 'Biotech', 'CleanTech', 'Web/Mobile'];

  // Filter projects according to SRS visibility rules:
  // Public projects are viewable by anyone.
  // Private projects are only viewable by owner or accepted members! (FR-PROJ-08 / BR-05)
  const accessibleProjects = projects.filter(p => {
    if (p.visibility === 'public') return true;
    const isOwner = p.ownerId === currentUser.id;
    const isMember = p.members.some(m => m.userId === currentUser.id && m.status === 'accepted');
    return isOwner || isMember;
  });

  const filteredProjects = accessibleProjects.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
            Innovation Projects Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Student hardware prototypes, published research tools, and open-source systems developed at NIT Raipur.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project (FR-PROJ-01)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, technology (e.g. PyTorch, ROS2, ESP32), or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
              <option value="idea">Idea Stage</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 shrink-0 font-medium mr-1">Domain:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer capitalize shrink-0 ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, filter criteria, or click &quot;New Project&quot; to initialize one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const owner = users.find(u => u.id === project.ownerId) || currentUser;
            const acceptedMembers = project.members.filter(m => m.status === 'accepted');
            const completedCount = project.milestones.filter(m => m.completed).length;
            const totalCount = project.milestones.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col cursor-pointer"
              >
                {/* Card Image banner */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  {project.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
                      <FolderKanban className="w-12 h-12 text-indigo-500/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-indigo-300 border border-indigo-700/50 backdrop-blur-md">
                      {project.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 backdrop-blur-md ${
                        project.visibility === 'public'
                          ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900/90 text-amber-300 border-amber-500/40'
                      }`}>
                        {project.visibility === 'public' ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                        {project.visibility === 'public' ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                        project.status === 'completed'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                          : project.status === 'in-progress'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : project.status === 'idea'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {project.status.replace('-', ' ')}
                      </span>

                      {project.reopenedHistory && project.reopenedHistory.length > 0 && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1" title="Reopened project with preserved history">
                          <RotateCcw className="w-2.5 h-2.5" /> Reopened
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-medium">
                        {t}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Milestones bar */}
                  {totalCount > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Milestones</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-indigo-500 h-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer: Owner & Contributors (Accepted only per FR-PROJ-10) */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={owner.avatar}
                        alt={owner.name}
                        className="w-6 h-6 rounded-lg object-cover ring-1 ring-indigo-500/40"
                      />
                      <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
                        {owner.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render Project Detail Modal when a project is selected */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

    </div>
  );
};

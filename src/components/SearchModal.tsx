'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  X, 
  FolderKanban, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Tag, 
  Globe, 
  Lock 
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    projects, 
    users, 
    currentUser, 
    setSelectedProjectId, 
    setSelectedUserId, 
    setActiveTab 
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'projects' | 'people'>('all');

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Projects with privacy filter (FR-SEARCH-04: unauthorized searches reveal no restricted content)
  const matchedProjects = projects.filter(p => {
    if (p.visibility === 'private' && p.ownerId !== currentUser.id && !p.members.some(m => m.userId === currentUser.id && m.status === 'accepted')) {
      return false; // Exclude private projects
    }
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.techStack.some(t => t.toLowerCase().includes(q))
    );
  });

  // Search Users with privacy filter
  const matchedUsers = users.filter(u => {
    if (u.profileVisibility === 'private' && u.id !== currentUser.id) {
      return false;
    }
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.headline.toLowerCase().includes(q) ||
      u.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projects');
    setIsSearchModalOpen(false);
  };

  const handleSelectUser = (id: string) => {
    setSelectedUserId(id);
    setActiveTab('profile');
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type to search projects, students, tech stacks, or skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 text-xs">
          <span className="text-slate-500">Filter:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
              filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilterType('projects')}
            className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
              filterType === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Projects ({matchedProjects.length})
          </button>
          <button
            onClick={() => setFilterType('people')}
            className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
              filterType === 'people' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            People ({matchedUsers.length})
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Projects Results */}
          {(filterType === 'all' || filterType === 'projects') && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                <span>Projects ({matchedProjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedProjects.slice(0, 5).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProject(p.id)}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-slate-900 text-indigo-400 border border-slate-800">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People Results */}
          {(filterType === 'all' || filterType === 'people') && (
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>People &amp; Innovators ({matchedUsers.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedUsers.slice(0, 5).map(u => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {u.name}
                          </span>
                          {u.certificationStatus === 'approved' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block line-clamp-1">{u.headline}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          SRS FR-SEARCH-04: Private content disclosure strictly prevented across snippets and metadata.
        </div>

      </div>
    </div>
  );
};

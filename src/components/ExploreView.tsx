'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Compass, 
  Search, 
  CheckCircle2, 
  MapPin, 
  GraduationCap, 
  ArrowUpRight, 
  Filter,
  Users,
  Code2
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { users, currentUser, setSelectedUserId, setActiveTab, followToggle } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [onlyCertified, setOnlyCertified] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  const departments = [
    'all',
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Metallurgical & Materials Engineering'
  ];

  const filteredUsers = users.filter(u => {
    // Privacy check (FR-PROFILE-03)
    if (u.profileVisibility === 'private' && u.id !== currentUser.id) {
      return false;
    }

    const matchDept = departmentFilter === 'all' || u.department === departmentFilter;
    const matchCert = !onlyCertified || u.certificationStatus === 'approved';
    const matchRole = roleFilter === 'all' || 
      (roleFilter === 'alumni' ? u.isAlumni : !u.isAlumni);

    const q = searchQuery.toLowerCase();
    const matchSearch = 
      u.name.toLowerCase().includes(q) ||
      u.headline.toLowerCase().includes(q) ||
      u.skills.some(s => s.toLowerCase().includes(q));

    return matchDept && matchCert && matchRole && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-400" />
            Explore Innovators &amp; Student Portfolios
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover student developers, hardware builders, researchers, and alumni across NIT Raipur.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar (FR-SEARCH-01 / 02) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, headline, or technical skill (e.g. PyTorch, Rust, ROS2)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Department dropdown */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Role dropdown (Student vs Alumni FR-AUTH-07) */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Current Students</option>
              <option value="alumni">Graduated Alumni (FR-AUTH-07)</option>
            </select>
          </div>
        </div>

        {/* Checkbox for certified-only filter */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <input
            type="checkbox"
            id="cert-filter"
            checked={onlyCertified}
            onChange={(e) => setOnlyCertified(e.target.checked)}
            className="accent-indigo-600 rounded"
          />
          <label htmlFor="cert-filter" className="text-slate-300 cursor-pointer flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show Only I-Cell Certified Profiles (FR-CERT-11)</span>
          </label>
        </div>
      </div>

      {/* Innovators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const isCertified = user.certificationStatus === 'approved';

          return (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUserId(user.id);
                setActiveTab('profile');
              }}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between cursor-pointer space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-indigo-500 transition-all"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {user.name}
                        </h3>
                        {isCertified && (
                          <span title="I-Cell Certified">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                        {user.department.split(' ')[0]} • {user.batch}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    user.isAlumni
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                  }`}>
                    {user.isAlumni ? 'Alumni' : 'Student'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {user.headline}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.skills.slice(0, 4).map(skill => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                      +{user.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>{user.followersCount} Followers</span>
                  {user.streakEnabled && user.currentStreak > 0 && (
                    <span className="text-amber-400 font-semibold">🔥 {user.currentStreak}d Streak</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform font-medium">
                  <span>View Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

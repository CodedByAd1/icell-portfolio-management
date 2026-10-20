'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AtSign, 
  MessageSquare, 
  Users, 
  Award, 
  Heart, 
  ShieldCheck, 
  Settings,
  Mail
} from 'lucide-react';
import { NotificationCategory } from '@/types';
import { formatTime } from '@/utils/formatDate';

export const NotificationsDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    notifications, 
    currentUser, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    showToast
  } = useApp();

  const [filterCat, setFilterCat] = useState<'all' | 'unread' | NotificationCategory>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Notification preferences state (FR-NOTIF-03)
  const [prefMentions, setPrefMentions] = useState(true);
  const [prefComments, setPrefComments] = useState(true);
  const [prefCollaboration, setPrefCollaboration] = useState(true);
  const [prefCriticalEmail, setPrefCriticalEmail] = useState(true);

  if (!isNotificationDrawerOpen) return null;

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.recipientId === currentUser.id);

  const filteredNotifications = userNotifications.filter(n => {
    if (filterCat === 'all') return true;
    if (filterCat === 'unread') return !n.read;
    return n.category === filterCat;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'mention':
        return <AtSign className="w-4 h-4 text-indigo-400" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'collaboration':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'certification':
        return <Award className="w-4 h-4 text-cyan-400" />;
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Notifications Center</h3>
                <p className="text-[11px] text-slate-400">SRS FR-NOTIF-01 Event Alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Configure Preferences (FR-NOTIF-03)"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preferences Overlay (FR-NOTIF-03) */}
          {showPreferences ? (
            <div className="p-5 bg-slate-950/90 border-b border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white">Notification Preferences (FR-NOTIF-03)</h4>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Back to List
                </button>
              </div>

              <div className="space-y-3 text-slate-300">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Mentions (@username)</span>
                  <input
                    type="checkbox"
                    checked={prefMentions}
                    onChange={(e) => setPrefMentions(e.target.checked)}
                    className="accent-indigo-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Comment Threads &amp; Replies</span>
                  <input
                    type="checkbox"
                    checked={prefComments}
                    onChange={(e) => setPrefComments(e.target.checked)}
                    className="accent-indigo-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Project Collaboration Invites</span>
                  <input
                    type="checkbox"
                    checked={prefCollaboration}
                    onChange={(e) => setPrefCollaboration(e.target.checked)}
                    className="accent-indigo-600"
                  />
                </label>
                <div className="pt-2 border-t border-slate-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="block font-medium text-white">Critical Email Notifications (FR-NOTIF-02)</span>
                      <span className="text-[10px] text-slate-500">Send email only for designated critical governance/security events.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefCriticalEmail}
                      onChange={(e) => setPrefCriticalEmail(e.target.checked)}
                      className="accent-indigo-600"
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Notification preferences saved successfully (FR-NOTIF-03)', 'success');
                  setShowPreferences(false);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
              >
                Save Preferences
              </button>
            </div>
          ) : (
            /* Category Filter Pills */
            <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setFilterCat('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterCat === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCat('unread')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterCat === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilterCat('mention')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterCat === 'mention' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mentions
                </button>
                <button
                  onClick={() => setFilterCat('collaboration')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterCat === 'collaboration' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Invites
                </button>
                <button
                  onClick={() => setFilterCat('certification')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterCat === 'certification' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Certification
                </button>
              </div>

              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                title="Mark all as read (FR-NOTIF-05)"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-600" />
                <p>No notifications matching this filter.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-indigo-950/20 hover:bg-indigo-950/30' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            SRS FR-NOTIF-04: Notifications enforce visibility and privacy rules without disclosing private project data.
          </div>

        </div>
      </div>
    </div>
  );
};

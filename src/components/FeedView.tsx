'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ThumbsUp, 
  PartyPopper, 
  Lightbulb, 
  Rocket, 
  MessageSquare, 
  Share2, 
  Flag, 
  Trash2, 
  Sparkles, 
  Send, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  FolderKanban, 
  Clock, 
  TrendingUp, 
  CornerDownRight, 
  Image as ImageIcon 
} from 'lucide-react';
import { ReactionType, Comment } from '@/types';
import { formatDate, formatTime } from '@/utils/formatDate';

export const FeedView: React.FC = () => {
  const { 
    currentUser, 
    posts, 
    updates, 
    projects, 
    users, 
    comments, 
    createStandalonePost, 
    createProgressUpdate, 
    deletePostOrUpdate, 
    reactToItem, 
    addComment, 
    submitReport, 
    showToast,
    setSelectedProjectId,
    setSelectedUserId,
    setActiveTab
  } = useApp();

  const [feedMode, setFeedMode] = useState<'chronological' | 'discovery'>('chronological');
  
  // Post creation state
  const [postType, setPostType] = useState<'standalone' | 'update'>('standalone');
  const [selectedProjId, setSelectedProjId] = useState<string>(projects[0]?.id || '');
  const [updateTitle, setUpdateTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Active commenting & report modals
  const [expandedComments, setExpandedComments] = useState<{ [id: string]: boolean }>({});
  const [replyParentId, setReplyParentId] = useState<{ [itemId: string]: string | null }>({});
  const [commentInputs, setCommentInputs] = useState<{ [itemId: string]: string }>({});
  const [reportingItem, setReportingItem] = useState<{ type: 'post' | 'update'; id: string } | null>(null);
  const [reportReason, setReportReason] = useState<any>('spam');
  const [reportNotes, setReportNotes] = useState('');

  // Combine and sort feed items
  const myProjects = projects.filter(p => p.ownerId === currentUser.id || p.members.some(m => m.userId === currentUser.id && m.status === 'accepted'));

  const feedItems = [
    ...posts.filter(p => !p.isSoftDeleted).map(p => ({ ...p, itemType: 'post' as const })),
    ...updates.filter(u => !u.isSoftDeleted).map(u => ({ ...u, itemType: 'update' as const }))
  ];

  // Sorting
  if (feedMode === 'chronological') {
    feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // Discovery mode: prioritize items with higher reaction counts & certification
    feedItems.sort((a, b) => {
      const scoreA = Object.keys(a.reactions).length * 2 + a.commentsCount;
      const scoreB = Object.keys(b.reactions).length * 2 + b.commentsCount;
      return scoreB - scoreA;
    });
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      showToast('Please enter content for your post.', 'warning');
      return;
    }

    const tags = tagInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    if (postType === 'standalone') {
      createStandalonePost(postContent, tags, mediaUrl.trim() || undefined);
    } else {
      if (!updateTitle.trim()) {
        showToast('Please enter an update title for this project progress log.', 'warning');
        return;
      }
      createProgressUpdate(selectedProjId, updateTitle, postContent, tags, mediaUrl.trim() || undefined);
    }

    // Reset form
    setPostContent('');
    setUpdateTitle('');
    setTagInput('');
    setMediaUrl('');
    setIsPosting(false);
  };

  const handleCopyLink = (itemId: string, type: 'post' | 'update') => {
    const url = `${window.location.origin}/#${type}-${itemId}`;
    navigator.clipboard.writeText(url);
    showToast(`Permanent share link copied to clipboard! (FR-SOC-07 / BR-05)`, 'success');
  };

  const handleSendComment = (itemId: string, itemType: 'post' | 'update') => {
    const text = commentInputs[itemId]?.trim();
    if (!text) return;
    const parentId = replyParentId[itemId] || undefined;
    addComment(itemId, itemType, text, parentId);
    setCommentInputs(prev => ({ ...prev, [itemId]: '' }));
    setReplyParentId(prev => ({ ...prev, [itemId]: null }));
  };

  const handleConfirmReport = () => {
    if (!reportingItem) return;
    submitReport(reportingItem.type, reportingItem.id, reportReason, reportNotes);
    setReportingItem(null);
    setReportNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner / Feed Mode Toggle (FR-SOC-01) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Innovation Activity Feed
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time breakthroughs, project sprint updates, and community engineering discussions.
          </p>
        </div>

        {/* Dual Feed Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFeedMode('chronological')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              feedMode === 'chronological'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chronological</span>
          </button>
          <button
            onClick={() => setFeedMode('discovery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              feedMode === 'discovery'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Discovery &amp; Trending</span>
          </button>
        </div>
      </div>

      {/* Content Creator Card (FR-POST-01 / FR-POST-02) */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl transition-all">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{currentUser.name}</span>
                {currentUser.certificationStatus === 'approved' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-700/50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    I-Cell Certified
                  </span>
                )}
              </div>

              {/* Toggle Post Type */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPostType('standalone')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                    postType === 'standalone' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Community Post
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('update')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                    postType === 'update' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Project Update
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              {postType === 'update' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Select Project</label>
                    <select
                      value={selectedProjId}
                      onChange={(e) => setSelectedProjId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Update Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Achieved 94% accuracy on Jetson..."
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <textarea
                  rows={isPosting ? 4 : 2}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onFocus={() => setIsPosting(true)}
                  placeholder={
                    postType === 'standalone'
                      ? "Share technical insights, engineering hurdles, or research announcements with the NIT Raipur community..."
                      : "Document milestone progress, CAD render benchmarks, test telemetry, or collaborative updates..."
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-all"
                />
              </div>

              {isPosting && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tags (comma separated e.g. ROS2, EdgeAI, Drone)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Optional image/media link (URL)"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  {postType === 'standalone' ? 'Markdown supported • Feeds to community' : 'Stores as first-class record in project timeline'}
                </span>
                <div className="flex items-center gap-2">
                  {isPosting && (
                    <button
                      type="button"
                      onClick={() => setIsPosting(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish {postType === 'standalone' ? 'Post' : 'Update'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Feed Items Stream */}
      <div className="space-y-5">
        {feedItems.map((item) => {
          const author = users.find(u => u.id === item.authorId) || currentUser;
          const isUpdate = item.itemType === 'update';
          const project = isUpdate ? projects.find(p => p.id === (item as any).projectId) : null;
          const userReaction = item.reactions[currentUser.id];
          const reactionCounts = {
            like: Object.values(item.reactions).filter(r => r === 'like').length,
            celebrate: Object.values(item.reactions).filter(r => r === 'celebrate').length,
            insightful: Object.values(item.reactions).filter(r => r === 'insightful').length,
            inspiring: Object.values(item.reactions).filter(r => r === 'inspiring').length
          };
          const totalReactions = Object.keys(item.reactions).length;
          const isAuthor = item.authorId === currentUser.id;
          const isProjectOwner = project?.ownerId === currentUser.id;
          const canDelete = isAuthor || isProjectOwner;

          // Item's comments tree
          const itemComments = comments.filter(c => c.targetId === item.id && !c.isSoftDeleted);
          const topLevelComments = itemComments.filter(c => !c.parentId);
          const isExpanded = expandedComments[item.id];

          return (
            <article
              key={item.id}
              id={`${item.itemType}-${item.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700/80 transition-all space-y-4"
            >
              {/* Header: Author + Meta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedUserId(author.id);
                      setActiveTab('profile');
                    }}
                    className="group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-800 group-hover:ring-indigo-500 transition-all"
                    />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedUserId(author.id);
                          setActiveTab('profile');
                        }}
                        className="text-sm font-bold text-white hover:text-indigo-400 transition-colors"
                      >
                        {author.name}
                      </button>

                      {/* Official Certification Badge (FR-PROFILE-05 / FR-CERT-11) */}
                      {author.certificationStatus === 'approved' && (
                        <span
                          className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full"
                          title={`Certified Profile #${author.certificationSerial || 'NITRR'}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Certified</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-400">• {author.department.split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatDate(item.createdAt)}</span>
                      {isUpdate && project && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => {
                              setSelectedProjectId(project.id);
                              setActiveTab('projects');
                            }}
                            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            <FolderKanban className="w-3 h-3" />
                            <span>{project.title.slice(0, 32)}...</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: Share & Report & Soft-Delete */}
                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    onClick={() => handleCopyLink(item.id, item.itemType)}
                    className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Copy Permanent Share Link (FR-SOC-07)"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setReportingItem({ type: item.itemType, id: item.id })}
                    className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Report Content to Moderation Queue (FR-SOC-09)"
                  >
                    <Flag className="w-4 h-4" />
                  </button>

                  {canDelete && (
                    <button
                      onClick={() => deletePostOrUpdate(item.id, item.itemType)}
                      className="p-1.5 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Soft-Delete this record (FR-POST-05/06)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Update Title if Progress Update */}
              {isUpdate && (item as any).title && (
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  {(item as any).title}
                </h3>
              )}

              {/* Main Content */}
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </div>

              {/* Media preview if provided */}
              {item.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.mediaUrl} alt="Attached Media" className="w-full object-cover max-h-96" />
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-indigo-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement Bar: 1-Active-Reaction (FR-SOC-04 / BR-06) & Comments Toggle */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* 4 Reactions: One active per user */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => reactToItem(item.id, item.itemType, 'like')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      userReaction === 'like'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Like (FR-SOC-04)"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{reactionCounts.like > 0 ? reactionCounts.like : ''}</span>
                  </button>

                  <button
                    onClick={() => reactToItem(item.id, item.itemType, 'celebrate')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      userReaction === 'celebrate'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Celebrate (FR-SOC-04)"
                  >
                    <PartyPopper className="w-3.5 h-3.5" />
                    <span>{reactionCounts.celebrate > 0 ? reactionCounts.celebrate : ''}</span>
                  </button>

                  <button
                    onClick={() => reactToItem(item.id, item.itemType, 'insightful')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      userReaction === 'insightful'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Insightful (FR-SOC-04)"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{reactionCounts.insightful > 0 ? reactionCounts.insightful : ''}</span>
                  </button>

                  <button
                    onClick={() => reactToItem(item.id, item.itemType, 'inspiring')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      userReaction === 'inspiring'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Inspiring (FR-SOC-04)"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>{reactionCounts.inspiring > 0 ? reactionCounts.inspiring : ''}</span>
                  </button>
                </div>

                {/* Comments button toggle */}
                <button
                  onClick={() => setExpandedComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{itemComments.length} {itemComments.length === 1 ? 'Comment' : 'Comments'}</span>
                </button>
              </div>

              {/* Threaded Comments Section (3-Level nesting per FR-SOC-05 & BR-07) */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in">
                  
                  {/* Top-level comment composer */}
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <input
                      type="text"
                      placeholder={replyParentId[item.id] ? "Write a threaded reply..." : "Write a constructive engineering comment..."}
                      value={commentInputs[item.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendComment(item.id, item.itemType);
                        }
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {replyParentId[item.id] && (
                      <button
                        onClick={() => setReplyParentId(prev => ({ ...prev, [item.id]: null }))}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1"
                      >
                        Cancel Reply
                      </button>
                    )}
                    <button
                      onClick={() => handleSendComment(item.id, item.itemType)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Render Threaded Comments Tree */}
                  <div className="space-y-3 pt-2">
                    {topLevelComments.map((topComment) => {
                      const topAuthor = users.find(u => u.id === topComment.authorId) || currentUser;
                      const level2Replies = itemComments.filter(c => c.parentId === topComment.id);

                      return (
                        <div key={topComment.id} className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                          {/* Level 1 Comment */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={topAuthor.avatar} alt={topAuthor.name} className="w-6 h-6 rounded-md object-cover" />
                              <span className="text-xs font-semibold text-white">{topAuthor.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {formatTime(topComment.createdAt)}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">Level 1</span>
                            </div>
                            <button
                              onClick={() => setReplyParentId(prev => ({ ...prev, [item.id]: topComment.id }))}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                              Reply
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 pl-8 leading-relaxed">{topComment.content}</p>

                          {/* Level 2 Replies */}
                          {level2Replies.map((lvl2) => {
                            const lvl2Author = users.find(u => u.id === lvl2.authorId) || currentUser;
                            const level3Replies = itemComments.filter(c => c.parentId === lvl2.id);

                            return (
                              <div key={lvl2.id} className="pl-6 pt-2 border-l-2 border-indigo-500/30 ml-4 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <CornerDownRight className="w-3 h-3 text-indigo-400 shrink-0" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={lvl2Author.avatar} alt={lvl2Author.name} className="w-5 h-5 rounded-md object-cover" />
                                    <span className="text-xs font-semibold text-white">{lvl2Author.name}</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">Level 2</span>
                                  </div>
                                  <button
                                    onClick={() => setReplyParentId(prev => ({ ...prev, [item.id]: lvl2.id }))}
                                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                                  >
                                    Reply
                                  </button>
                                </div>
                                <p className="text-xs text-slate-300 pl-5">{lvl2.content}</p>

                                {/* Level 3 Replies (Strict Cap per SRS BR-07) */}
                                {level3Replies.map((lvl3) => {
                                  const lvl3Author = users.find(u => u.id === lvl3.authorId) || currentUser;
                                  return (
                                    <div key={lvl3.id} className="pl-6 pt-2 border-l-2 border-cyan-500/30 ml-4 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <CornerDownRight className="w-3 h-3 text-cyan-400 shrink-0" />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={lvl3Author.avatar} alt={lvl3Author.name} className="w-5 h-5 rounded-md object-cover" />
                                        <span className="text-xs font-semibold text-white">{lvl3Author.name}</span>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">Level 3 (Max)</span>
                                      </div>
                                      <p className="text-xs text-slate-300 pl-5">{lvl3.content}</p>
                                      <div className="text-[10px] text-amber-400/80 italic pl-5">
                                        * SRS BR-07: Max nesting reached. Further replies post as sibling comments.
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Moderation Report Modal (FR-SOC-09) */}
      {reportingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Flag className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Report Content</h3>
            </div>
            <p className="text-xs text-slate-400">
              Help maintain community integrity and technical authenticity. Reports are reviewed by designated I-Cell moderators.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Violation Category</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="spam">Spam / Unrelated Promotion</option>
                  <option value="plagiarism">Plagiarism / Uncredited Code Fork</option>
                  <option value="unverified_claims">Fraudulent or Misleading Project Claims</option>
                  <option value="harassment">Harassment or Toxic Conduct</option>
                  <option value="inappropriate">Inappropriate Media</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Provide context or original source links for the moderation review board..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReportingItem(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReport}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-rose-600/30"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

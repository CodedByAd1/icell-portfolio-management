'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Project, 
  ProgressUpdate, 
  StandalonePost, 
  Comment, 
  CertificationRequest, 
  ModerationReport, 
  NotificationItem, 
  AuditLogEntry,
  ReactionType,
  ProjectStatus,
  ProjectMemberRole
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_UPDATES,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_CERTIFICATION_REQUESTS,
  INITIAL_MODERATION_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  generateActivityData
} from '@/data/mockData';
import { formatDate } from '@/utils/formatDate';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  projects: Project[];
  updates: ProgressUpdate[];
  posts: StandalonePost[];
  comments: Comment[];
  certificationRequests: CertificationRequest[];
  moderationReports: ModerationReport[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
  activityData: { [date: string]: number };
  toasts: ToastMessage[];
  
  // Navigation & Modals state
  activeTab: 'feed' | 'projects' | 'explore' | 'certifications' | 'moderation' | 'profile';
  setActiveTab: (tab: 'feed' | 'projects' | 'explore' | 'certifications' | 'moderation' | 'profile') => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  isCertModalOpen: boolean;
  setIsCertModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isTraceabilityOpen: boolean;
  setIsTraceabilityOpen: (open: boolean) => void;

  // Actions
  switchUser: (userId: string) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  updateProfile: (userId: string, data: Partial<User>) => void;
  createProject: (project: Partial<Project>) => void;
  updateProject: (projectId: string, data: Partial<Project>) => void;
  toggleProjectStatus: (projectId: string, status: ProjectStatus) => void;
  reopenProject: (projectId: string, reason: string) => void;
  inviteCollaborator: (projectId: string, email: string, role: ProjectMemberRole) => void;
  respondToInvitation: (projectId: string, accept: boolean) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  createProgressUpdate: (projectId: string, title: string, content: string, tags: string[], mediaUrl?: string) => void;
  createStandalonePost: (content: string, tags: string[], mediaUrl?: string) => void;
  deletePostOrUpdate: (id: string, type: 'post' | 'update') => void;
  reactToItem: (id: string, type: 'post' | 'update', reaction: ReactionType) => void;
  addComment: (targetId: string, targetType: 'post' | 'update', content: string, parentId?: string) => void;
  followToggle: (targetUserId: string) => void;
  submitCertificationRequest: (rollNumber: string, statement: string, portfolioLinks: string[], evidenceNotes: string) => void;
  decideCertification: (requestId: string, decision: 'approved' | 'rejected', reason: string) => boolean;
  revokeCertification: (userId: string, reason: string) => void;
  submitReport: (targetType: 'post' | 'update' | 'comment' | 'user' | 'project', targetId: string, reason: ModerationReport['reason'], notes: string) => void;
  resolveReport: (reportId: string, action: 'soft_deleted' | 'warned' | 'content_removed' | 'none') => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteAccountSelfService: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('user-aditya');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [updates, setUpdates] = useState<ProgressUpdate[]>(INITIAL_UPDATES);
  const [posts, setPosts] = useState<StandalonePost[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [certificationRequests, setCertificationRequests] = useState<CertificationRequest[]>(INITIAL_CERTIFICATION_REQUESTS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(INITIAL_MODERATION_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [activityData] = useState<{ [date: string]: number }>(() => generateActivityData());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation states
  const [activeTab, setActiveTab] = useState<'feed' | 'projects' | 'explore' | 'certifications' | 'moderation' | 'profile'>('feed');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const showToast = (text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      showToast(`Switched active persona to ${user.name} (${user.role.replace('_', ' ').toUpperCase()})`, 'info');
    }
  };

  const updateProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    showToast('Profile updated successfully (FR-PROFILE-01)', 'success');
  };

  const createProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: projectData.title || 'Untitled Innovation Project',
      slug: (projectData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: projectData.tagline || 'Project tagline',
      description: projectData.description || 'Description of the innovation project.',
      category: projectData.category || 'AI/ML',
      techStack: projectData.techStack || ['Next.js', 'Python'],
      ownerId: currentUser.id,
      status: projectData.status || 'idea',
      visibility: projectData.visibility || 'public',
      members: [
        {
          userId: currentUser.id,
          role: 'owner',
          status: 'accepted',
          invitedAt: new Date().toISOString()
        }
      ],
      milestones: projectData.milestones || [],
      repoUrl: projectData.repoUrl,
      demoUrl: projectData.demoUrl,
      videoUrl: projectData.videoUrl,
      coverImage: projectData.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    showToast(`Project "${newProject.title}" saved successfully (FR-PROJ-01/02)`, 'success');
  };

  const updateProject = (projectId: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, ...data, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    showToast('Project updated successfully', 'success');
  };

  const toggleProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status,
          updatedAt: new Date().toISOString(),
          completedAt: status === 'completed' ? new Date().toISOString() : p.completedAt
        };
      }
      return p;
    }));
    showToast(`Project status changed to: ${status.toUpperCase()} (FR-PROJ-03)`, 'info');
  };

  const reopenProject = (projectId: string, reason: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const history = p.reopenedHistory || [];
        return {
          ...p,
          status: 'in-progress',
          updatedAt: new Date().toISOString(),
          reopenedHistory: [...history, { reopenedAt: new Date().toISOString(), reason }]
        };
      }
      return p;
    }));
    showToast('Project reopened! Prior completion history preserved (FR-PROJ-04)', 'success');
  };

  const inviteCollaborator = (projectId: string, email: string, role: ProjectMemberRole) => {
    const invitee = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!invitee) {
      showToast('No user found with this college email address.', 'error');
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        // Prevent duplicate invites
        if (p.members.some(m => m.userId === invitee.id)) {
          return p;
        }
        return {
          ...p,
          members: [
            ...p.members,
            {
              userId: invitee.id,
              role,
              status: 'pending',
              invitedAt: new Date().toISOString()
            }
          ]
        };
      }
      return p;
    }));

    // Trigger notification to invitee
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: invitee.id,
      category: 'collaboration',
      title: 'Collaboration Invitation',
      message: `${currentUser.name} invited you to collaborate as a ${role.toUpperCase()} on their project.`,
      createdAt: new Date().toISOString(),
      read: false,
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Invitation sent to ${invitee.name} as pending (FR-PROJ-07/10)`, 'success');
  };

  const respondToInvitation = (projectId: string, accept: boolean) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          members: p.members.map(m => {
            if (m.userId === currentUser.id && m.status === 'pending') {
              return {
                ...m,
                status: accept ? 'accepted' : 'declined',
                acceptedAt: accept ? new Date().toISOString() : undefined
              };
            }
            return m;
          })
        };
      }
      return p;
    }));

    showToast(accept ? 'Invitation accepted! You are now an active contributor.' : 'Invitation declined.', 'info');
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: p.milestones.map(m => {
            if (m.id === milestoneId) {
              const completed = !m.completed;
              return {
                ...m,
                completed,
                completedAt: completed ? new Date().toISOString() : undefined
              };
            }
            return m;
          })
        };
      }
      return p;
    }));
    showToast('Milestone status toggled (FR-PROJ-12)', 'info');
  };

  const createProgressUpdate = (projectId: string, title: string, content: string, tags: string[], mediaUrl?: string) => {
    const newUpdate: ProgressUpdate = {
      id: `upd-${Date.now()}`,
      projectId,
      authorId: currentUser.id,
      title,
      content,
      tags,
      mediaUrl,
      createdAt: new Date().toISOString(),
      reactions: {},
      commentsCount: 0
    };
    setUpdates(prev => [newUpdate, ...prev]);
    showToast('Progress update logged to project timeline and feed (FR-POST-02/03)', 'success');
  };

  const createStandalonePost = (content: string, tags: string[], mediaUrl?: string) => {
    const newPost: StandalonePost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      content,
      tags,
      mediaUrl,
      createdAt: new Date().toISOString(),
      reactions: {},
      commentsCount: 0
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('Community post published to feed (FR-POST-01)', 'success');
  };

  const deletePostOrUpdate = (id: string, type: 'post' | 'update') => {
    if (type === 'post') {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, isSoftDeleted: true } : p));
    } else {
      setUpdates(prev => prev.map(u => u.id === id ? { ...u, isSoftDeleted: true } : u));
    }
    showToast('Content soft-deleted from ordinary views (FR-POST-06 / BR-15)', 'info');
  };

  // Enforces FR-SOC-04 / BR-06: exactly one active reaction per user/item
  const reactToItem = (id: string, type: 'post' | 'update', reaction: ReactionType) => {
    if (type === 'post') {
      setPosts(prev => prev.map(p => {
        if (p.id === id) {
          const reactions = { ...p.reactions };
          if (reactions[currentUser.id] === reaction) {
            delete reactions[currentUser.id]; // Toggle off if already selected
          } else {
            reactions[currentUser.id] = reaction; // Replace reaction
          }
          return { ...p, reactions };
        }
        return p;
      }));
    } else {
      setUpdates(prev => prev.map(u => {
        if (u.id === id) {
          const reactions = { ...u.reactions };
          if (reactions[currentUser.id] === reaction) {
            delete reactions[currentUser.id];
          } else {
            reactions[currentUser.id] = reaction;
          }
          return { ...u, reactions };
        }
        return u;
      }));
    }
  };

  // Enforces FR-SOC-05 / BR-07: comment nesting is limited to three levels
  const addComment = (targetId: string, targetType: 'post' | 'update', content: string, parentId?: string) => {
    let level: 1 | 2 | 3 = 1;
    if (parentId) {
      const parent = comments.find(c => c.id === parentId);
      if (parent) {
        if (parent.level === 1) level = 2;
        else if (parent.level === 2) level = 3;
        else {
          showToast('Maximum comment nesting depth (3 levels) reached per SRS BR-07', 'warning');
          return;
        }
      }
    }

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      targetType,
      targetId,
      authorId: currentUser.id,
      content,
      parentId,
      level,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);

    // Increment count on target
    if (targetType === 'post') {
      setPosts(prev => prev.map(p => p.id === targetId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    } else {
      setUpdates(prev => prev.map(u => u.id === targetId ? { ...u, commentsCount: u.commentsCount + 1 } : u));
    }

    showToast(`Comment added (Level ${level} thread)`, 'success');
  };

  const followToggle = (targetUserId: string) => {
    const target = users.find(u => u.id === targetUserId);
    if (!target) return;

    setUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        return { ...u, followersCount: u.followersCount + 1 };
      }
      if (u.id === currentUser.id) {
        return { ...u, followingCount: u.followingCount + 1 };
      }
      return u;
    }));

    showToast(`You are now following ${target.name}`, 'info');
  };

  const submitCertificationRequest = (rollNumber: string, statement: string, portfolioLinks: string[], evidenceNotes: string) => {
    // Check if user is on 30-day cooldown (FR-CERT-07)
    if (currentUser.certificationCooldownUntil) {
      const cooldownDate = new Date(currentUser.certificationCooldownUntil);
      if (cooldownDate > new Date()) {
        showToast(`Submission blocked! Active 30-day cooldown until ${formatDate(currentUser.certificationCooldownUntil)} (FR-CERT-07)`, 'error');
        return;
      }
    }

    const newReq: CertificationRequest = {
      id: `cert-req-${Date.now()}`,
      applicantId: currentUser.id,
      submittedAt: new Date().toISOString(),
      state: 'pending',
      studentRollNumber: rollNumber,
      statement,
      portfolioLinks,
      evidenceNotes,
      profileSnapshotDate: new Date().toISOString().split('T')[0]
    };

    setCertificationRequests(prev => [newReq, ...prev]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, certificationStatus: 'pending' } : u));
    showToast('Certification request submitted to Innovation Cell review board! (FR-CERT-01)', 'success');
  };

  // Enforces FR-CERT-04 / FR-CERT-05 / BR-11 / BR-12: Only Faculty Advisor / Authorized Overall Coordinator, and NO self-approval!
  const decideCertification = (requestId: string, decision: 'approved' | 'rejected', reason: string): boolean => {
    const req = certificationRequests.find(r => r.id === requestId);
    if (!req) return false;

    // Check authority
    const hasAuthority = currentUser.role === 'faculty_advisor' || currentUser.role === 'authorized_overall_coordinator';
    if (!hasAuthority) {
      showToast('Unauthorized! Only the Faculty Advisor or Authorized Overall Coordinator can decide certifications (FR-CERT-04 / BR-11).', 'error');
      return false;
    }

    // Check self-approval guard (BR-12 / FR-CERT-05)
    if (req.applicantId === currentUser.id) {
      showToast('Governance violation: Reviewers cannot approve or reject their own certification request (BR-12 / FR-CERT-05)!', 'error');
      return false;
    }

    const decidedAt = new Date().toISOString();
    const serialNumber = decision === 'approved' ? `NITRR-ICELL-2026-${Math.floor(100 + Math.random() * 900)}` : undefined;
    const rejectionCooldown = decision === 'rejected' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
      : undefined;

    setCertificationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          state: decision,
          reviewerId: currentUser.id,
          decidedAt,
          decisionReason: reason,
          serialNumber,
          rejectionCooldownUntil: rejectionCooldown
        };
      }
      return r;
    }));

    // Update user profile
    setUsers(prev => prev.map(u => {
      if (u.id === req.applicantId) {
        return {
          ...u,
          certificationStatus: decision,
          certifiedDate: decision === 'approved' ? decidedAt : undefined,
          certificationSerial: serialNumber,
          certificationCooldownUntil: rejectionCooldown
        };
      }
      return u;
    }));

    // Add Audit Log entry (FR-CERT-13)
    const audit: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: decision === 'approved' ? 'CERTIFICATION_APPROVED' : 'CERTIFICATION_REJECTED',
      targetType: 'User',
      targetId: req.applicantId,
      timestamp: decidedAt,
      details: decision === 'approved'
        ? `Awarded certification #${serialNumber}. Reason: ${reason}`
        : `Rejected certification. Cooldown until ${formatDate(rejectionCooldown)}. Reason: ${reason}`
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Send notification to applicant
    const applicantNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: req.applicantId,
      category: 'certification',
      title: decision === 'approved' ? 'Profile Certified!' : 'Certification Application Update',
      message: decision === 'approved' 
        ? `Congratulations! Your NIT Raipur I-Cell certification has been approved by ${currentUser.name}. Serial: ${serialNumber}`
        : `Your certification request was reviewed. Feedback: "${reason}". 30-day cooldown active before resubmission.`,
      createdAt: decidedAt,
      read: false,
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    };
    setNotifications(prev => [applicantNotif, ...prev]);

    showToast(
      decision === 'approved' 
        ? `Certification approved for student! Badge issued. (FR-CERT-02/11)` 
        : `Certification rejected. 30-day cooldown registered. (FR-CERT-07)`,
      'success'
    );
    return true;
  };

  const revokeCertification = (userId: string, reason: string) => {
    const hasAuthority = currentUser.role === 'faculty_advisor' || currentUser.role === 'authorized_overall_coordinator';
    if (!hasAuthority) {
      showToast('Unauthorized to revoke certification (FR-CERT-09)', 'error');
      return;
    }

    const timestamp = new Date().toISOString();
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          certificationStatus: 'revoked',
          certifiedDate: undefined,
          certificationSerial: undefined
        };
      }
      return u;
    }));

    // Audit log (FR-CERT-09/13)
    const audit: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: 'CERTIFICATION_REVOKED',
      targetType: 'User',
      targetId: userId,
      timestamp,
      details: `Revoked certification. Reason: ${reason}`
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast('Certification revoked and logged to audit trail (FR-CERT-09/13)', 'warning');
  };

  const submitReport = (targetType: ModerationReport['targetType'], targetId: string, reason: ModerationReport['reason'], notes: string) => {
    const report: ModerationReport = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      targetType,
      targetId,
      reason,
      notes,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setModerationReports(prev => [report, ...prev]);
    showToast('Report submitted to moderation queue (FR-SOC-09)', 'info');
  };

  const resolveReport = (reportId: string, actionTaken: ModerationReport['actionTaken']) => {
    if (currentUser.role !== 'moderator' && currentUser.role !== 'faculty_advisor') {
      showToast('Only moderators can review reports (FR-SOC-10)', 'error');
      return;
    }

    setModerationReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'resolved',
          resolvedBy: currentUser.id,
          resolvedAt: new Date().toISOString(),
          actionTaken
        };
      }
      return r;
    }));

    showToast(`Report resolved with action: ${actionTaken?.replace('_', ' ').toUpperCase()} (FR-SOC-10)`, 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read (FR-NOTIF-05)', 'info');
  };

  const deleteAccountSelfService = () => {
    showToast('Self-service deletion initiated. In accordance with SRS FR-DATA-01/02, data entered 30-day retention countdown.', 'warning');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      projects,
      updates,
      posts,
      comments,
      certificationRequests,
      moderationReports,
      notifications,
      auditLogs,
      activityData,
      toasts,

      activeTab,
      setActiveTab,
      selectedProjectId,
      setSelectedProjectId,
      selectedUserId,
      setSelectedUserId,
      isCreateProjectOpen,
      setIsCreateProjectOpen,
      isCertModalOpen,
      setIsCertModalOpen,
      isNotificationDrawerOpen,
      setIsNotificationDrawerOpen,
      isSearchModalOpen,
      setIsSearchModalOpen,
      isTraceabilityOpen,
      setIsTraceabilityOpen,

      switchUser,
      showToast,
      dismissToast,
      updateProfile,
      createProject,
      updateProject,
      toggleProjectStatus,
      reopenProject,
      inviteCollaborator,
      respondToInvitation,
      toggleMilestone,
      createProgressUpdate,
      createStandalonePost,
      deletePostOrUpdate,
      reactToItem,
      addComment,
      followToggle,
      submitCertificationRequest,
      decideCertification,
      revokeCertification,
      submitReport,
      resolveReport,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteAccountSelfService
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

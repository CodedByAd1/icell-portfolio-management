export type UserRole = 
  | 'student' 
  | 'alumni' 
  | 'coordinator' 
  | 'faculty' 
  | 'authorized_overall_coordinator' 
  | 'faculty_advisor' 
  | 'moderator' 
  | 'admin';

export type AffiliationStatus = 'unverified' | 'email_verified' | 'icell_affiliated';

export type ProjectStatus = 'draft' | 'idea' | 'in-progress' | 'completed' | 'on-hold' | 'abandoned';

export type ProjectVisibility = 'public' | 'private';

export type ProfileVisibility = 'public' | 'private';

export type ProjectMemberRole = 'owner' | 'editor' | 'contributor' | 'viewer';

export type MembershipStatus = 'pending' | 'accepted' | 'declined';

export type ReactionType = 'like' | 'celebrate' | 'insightful' | 'inspiring';

export type CertificationState = 'not_requested' | 'pending' | 'approved' | 'rejected' | 'revoked';

export type NotificationCategory = 'mention' | 'comment' | 'collaboration' | 'reaction' | 'follow' | 'certification' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  affiliationStatus: AffiliationStatus;
  institution: string;
  department: string;
  batch: string; // e.g. "2023 - 2027"
  isAlumni: boolean;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    devfolio?: string;
    scholar?: string;
    leetcode?: string;
  };
  profileVisibility: ProfileVisibility;
  certificationStatus: CertificationState;
  certifiedDate?: string;
  certificationSerial?: string;
  certificationCooldownUntil?: string; // ISO date for 30-day cooldown
  resumeUrl?: string;
  streakEnabled: boolean;
  currentStreak: number;
  longestStreak: number;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
}

export interface ProjectMember {
  userId: string;
  role: ProjectMemberRole;
  status: MembershipStatus;
  invitedAt: string;
  acceptedAt?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'AI/ML' | 'Web/Mobile' | 'Hardware/IoT' | 'Biotech' | 'Robotics' | 'FinTech' | 'CleanTech' | 'Social Impact';
  techStack: string[];
  ownerId: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  members: ProjectMember[];
  milestones: ProjectMilestone[];
  repoUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  attachments?: { name: string; url: string; size: string; type: string }[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reopenedHistory?: { reopenedAt: string; reason: string }[];
  isArchived?: boolean;
}

export interface ProgressUpdate {
  id: string;
  projectId: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  mediaUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isSoftDeleted?: boolean;
  reactions: Record<string, ReactionType>; // userId -> ReactionType
  commentsCount: number;
}

export interface StandalonePost {
  id: string;
  authorId: string;
  content: string;
  tags: string[];
  mediaUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isSoftDeleted?: boolean;
  reactions: Record<string, ReactionType>;
  commentsCount: number;
}

export interface Comment {
  id: string;
  targetType: 'post' | 'update';
  targetId: string;
  authorId: string;
  content: string;
  parentId?: string; // undefined = Level 1, parentId = Level 2, parent of level 2 = Level 3
  level: 1 | 2 | 3;
  createdAt: string;
  isSoftDeleted?: boolean;
}

export interface CertificationRequest {
  id: string;
  applicantId: string;
  submittedAt: string;
  state: CertificationState;
  studentRollNumber: string;
  statement: string;
  portfolioLinks: string[];
  evidenceNotes: string;
  profileSnapshotDate: string;
  reviewerId?: string;
  decidedAt?: string;
  decisionReason?: string;
  rejectionCooldownUntil?: string;
  serialNumber?: string;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  targetType: 'post' | 'update' | 'comment' | 'user' | 'project';
  targetId: string;
  reason: 'spam' | 'plagiarism' | 'inappropriate' | 'harassment' | 'unverified_claims' | 'other';
  notes: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: string;
  actionTaken?: 'none' | 'soft_deleted' | 'warned' | 'content_removed';
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
  actor?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
  breakdown?: {
    projectCreated?: number;
    updatesPosted?: number;
    milestonesCompleted?: number;
  };
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details: string;
}

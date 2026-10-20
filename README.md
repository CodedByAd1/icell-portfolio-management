# NIT Raipur Innovation Cell — Student Portfolio Platform

> **Software Requirements Specification (SRS v0.1 Draft) — Interactive Prototype**  
> Prepared by: **Aditya Sahu**, Core Coordinator, Technical Domain, NIT Raipur Innovation Cell.

This is the official Next.js interactive web platform built strictly according to the specifications in the **Software Requirements Specification (SRS v0.1)**. For this initial phase, the application operates as an interactive static prototype simulating all core workflows, governance policies, and role-based permissions before backend and database integration.

---

## 🌟 Key Functional Features & SRS Mapping

### 1. Accounts & Institutional Governance (`FR-AUTH-01..08`)
- **Institution**: National Institute of Technology Raipur (I-Cell).
- **Affiliation Distinction (`FR-AUTH-04`)**: Clear visual distinction between simple email verification and official institute affiliation.
- **Student vs Alumni (`FR-AUTH-07`)**: Alumni maintain their portfolios and verified achievements after graduation without deletion.
- **Role Simulation**: Switch personas live via the top toolbar between:
  - **Student Maker**: Create projects, log sprint progress, apply for certification.
  - **Authorized Overall Coordinator (4th Year)**: Privileged authority to review student certifications.
  - **I-Cell Faculty Advisor**: Complete governance authority, issuance of official I-Cell seals, and audit logging.
  - **Moderator**: Review flagged content and enforce ethics/anti-plagiarism guidelines.
  - **Alumni**: Career mentoring and alumni network participation.

### 2. Profiles & Verifiable Portfolios (`FR-PROFILE-01..08`)
- **I-Cell Certification Badge (`FR-PROFILE-05`, `FR-CERT-11`)**: Official badge displaying verification status and unique serial ID (e.g., `#NITRR-ICELL-2025-001`).
- **Profile Visibility (`FR-PROFILE-03`)**: Configurable Public vs Private visibility.
- **Verified Resume (`FR-PROFILE-06`)**: Modal preview and download respecting access permissions.
- **Activity Heatmap & Streaks (`FR-ACT-01..04`)**: 365-day contribution grid tracking project creation, milestones, and progress updates while preserving student privacy (`BR-09`).
- **Self-Service Account Deletion (`FR-PROFILE-07`, `FR-DATA-01`)**: 30-day lifecycle retention workflow preserving shared project attribution (`FR-DATA-04`).

### 3. Projects & Technical Collaboration (`FR-PROJ-01..13`)
- **Lifecycle Statuses (`FR-PROJ-03`)**: `idea`, `in-progress`, `completed`, `on-hold`, `abandoned`, and `draft`.
- **Reopen Completed Projects (`FR-PROJ-04`)**: Reopening completed projects preserves prior completion history and logs an immutable audit trail.
- **Independent Project Visibility (`FR-PROJ-08`)**: Private projects remain protected even when a profile is public.
- **RBAC Roles (`FR-PROJ-06`)**: Owner, Editor, Contributor, and Viewer.
- **Contributors vs Pending Invitees (`FR-PROJ-07`, `FR-PROJ-10`)**: Pending invitees are excluded from contributor rosters until explicitly accepted.
- **Artifact Links (`FR-PROJ-11`, `FR-FILE-05`)**: Direct repository links, video demos, and deployment URLs.
- **Milestones (`FR-PROJ-12`)**: Interactive milestone checklist and percentage progress tracking.

### 4. Progress Updates & Timelines (`FR-POST-01..08`)
- **Dual Content Types**: Project-linked progress updates (first-class records in project timelines) vs Standalone community discussions.
- **Soft-Deletion (`FR-POST-06`, `BR-15`)**: Author/owner soft-deletion hiding items from ordinary feeds.

### 5. Feeds & Social Interactions (`FR-SOC-01..10`)
- **Dual Feeds (`FR-SOC-01`)**:
  - **Chronological Feed**: Time-ordered stream of all peer updates and engineering posts.
  - **Discovery Feed**: Curated, trending student innovations with domain filtering.
- **Exclusive Reaction Rule (`FR-SOC-04`, `BR-06`)**: Exactly one active reaction per user/item (Like, Celebrate, Insightful, Inspiring).
- **3-Level Threaded Comments (`FR-SOC-05`, `BR-07`)**: Thread depth strictly capped at 3 levels to maintain readability.
- **Permanent Share Links (`FR-SOC-07`)**: Quick share URLs that respect authorization boundaries.
- **Moderation Queue (`FR-SOC-09`, `FR-SOC-10`)**: User-flagging for spam, plagiarism, or false claims with reviewer dismissal or soft-delete actions.

### 6. Individual I-Cell Profile Certification Board (`FR-CERT-01..13`)
- **Person-Level Certification**: Accredits the student's authentic skills and verified claims.
- **Self-Approval Prevention Guard (`FR-CERT-05`, `BR-12`)**: Reviewers cannot approve or reject their own certification requests.
- **30-Day Rejection Cooldown (`FR-CERT-07`, `BR-14`)**: Rejected candidates are barred from early resubmission until the 30-day cooldown expires.
- **Immutable Audit Trail (`FR-CERT-13`)**: Every decision and revocation logs the reviewer identity, timestamp, and justification.

### 7. Universal Search (`FR-SEARCH-01..05`)
- Keyboard shortcut `Ctrl + K` or `Cmd + K` for instant search across Projects, People, Tech Stacks, and Skills with privacy filtering (`FR-SEARCH-04`).

---

## 🚀 Running the Platform Locally

```bash
# Install dependencies
npm install

# Start the Next.js development server
npm run dev

# Open in your browser
http://localhost:3000
```

---

## 🛠 Tech Stack
- **Framework**: Next.js 16 (Turbopack, App Router)
- **UI & Styling**: Tailwind CSS, Lucide React, Custom Brand SVGs
- **State Architecture**: Reactive React Context (`src/context/AppContext.tsx`) with instant simulation of SRS business rules
- **Language**: TypeScript 5 (Strict types)

---

## 📋 Next Phase: Backend & Database Migration Plan
When transitioning from this static prototype to full production:
1. **Database Schema**: Map `src/types/index.ts` to PostgreSQL tables (Users, Projects, ProjectMemberships, ProgressUpdates, Comments, Reactions, CertificationRequests, ModerationReports, AuditLogs).
2. **Authentication**: Implement college email OTP via Supabase Auth / NextAuth with domain validation (`@nitrr.ac.in`).
3. **Storage**: Configure S3/Cloud Storage buckets with signed URLs for resumes and project media (`FR-FILE-01..04`).
4. **Server Actions & API Routes**: Replace Context state handlers with validated Next.js Server Actions and PostgreSQL row-level security (RLS).

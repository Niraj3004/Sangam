# Backend Prompts Tracker (Deep Edition)

This document tracks our progress strictly against the `Sangam_Backend_Build_Prompts_Deep.pdf`.

## Phase 1: MVP (B0-B7)

### B0: CLAUDE.md - Project Rules
- **Status**: ✅ Completed (Mapped into `AGENTS.md`)
- **Spec**: Layered convention (route -> middleware -> controller -> service -> model). Authorization + ownership checks on every write. Verification gates sensitive actions.

### B1: Project init & server
- **Status**: ✅ Completed
- **Spec**: Express + TypeScript API. `env.config.ts` (Zod), `db.ts`, standard success/error envelope. 
- **Missing / To Fix**: 
  - Need to verify if `CLIENT_URL` CORS is strictly implemented.
  - Need to verify `helmet` is implemented.
  - Need to verify if `mailer.ts` and `ai.ts` files exist in `src/config/`.

### B2: Auth, roles & student verification
- **Status**: ⚠️ Partially Completed
- **Spec**: `/api/auth/register`, `/login`, `/refresh`, `/me`, `/google`. Roles: `student, verified_student, curator, moderator, admin, org`. Verification tiers: `email < college < manual`.
- **Missing / To Fix**: 
  - Need to check if `VerificationRequest` manual review flow is fully implemented.
  - Need to verify password hashing (argon2/bcrypt).

### B3: Data models & indexes
- **Status**: ⚠️ Partially Completed
- **Spec**: Schemas for User, Profile, VerificationRequest, Source, Opportunity, Event, SavedItem, ReviewQueueItem, Connection, Notification. Compound filters and text indexes.
- **Missing / To Fix**:
  - `Source`, `Event`, `SavedItem`, `Notification` models are not fully defined yet.

### B4: Profile module
- **Status**: ⚠️ Partially Completed
- **Spec**: `GET/PATCH /api/profile/me` and `GET /api/profile/:handle`. Fields: about, education, skills, interests, lookingFor, availability, location, studyDestination, languages, links, achievements, projects. Completeness score.
- **Missing / To Fix**: 
  - Verify all specific fields (like `lookingFor` and `achievements`) are in the `Profile` schema.

### B5: Opportunity & event feed + collection worker
- **Status**: ⚠️ Partially Completed
- **Spec**: `GET /api/opportunities`, `POST /api/opportunities/:id/save`, `unsave`. Curator review queue. Collection worker for RSS feeds.
- **Missing / To Fix**: 
  - The actual `node-cron` worker to ingest RSS feeds is missing.
  - Save/Unsave endpoints for users are missing.

### B6: Reminders & personalized digest
- **Status**: ❌ Not Started
- **Spec**: Retention engine. Deadline reminders via cron. Weekly digest via email/web push. `/api/notifications/prefs`.

### B7: Discover people & purposeful connect
- **Status**: ⚠️ Partially Completed
- **Spec**: `GET /api/discover/people` with filters. `POST /api/connections` with purpose enum. Accept/Decline logic.
- **Missing / To Fix**:
  - Need to verify `GET /api/discover/people` exists with exact filters (`skill`, `college`, `country`, `interest`, etc).
  - Connection `purpose` (collaboration | idea | startup | job | academic | open_source | networking) enum might be missing from `Connection` schema.

## Phase 2: Collaboration (B8-B11)

### B8: Ideas & projects / teams
- **Status**: ⚠️ Partially Completed
- **Spec**: `POST/GET/PATCH /api/ideas`. `POST/GET/PATCH /api/projects`. Apply/invite logic.
- **Missing / To Fix**: 
  - The `Idea` model and routes are entirely missing.
  - Project Application logic (`POST /api/projects/:id/apply` and open `roles`) is missing.

### B9: Matching seam
- **Status**: ❌ Not Started (The previous matchmaking logic needs to be moved to this dedicated `/api/match/*` structure with `reasons[]`).

### B10: Messaging
- **Status**: ❌ Not Started

### B11: Communities & knowledge
- **Status**: ❌ Not Started

## Phase 3: Marketplace & B2B (B12)

### B12: Jobs, internships, organizations & mentorship
- **Status**: ❌ Not Started

## Finish (B13-B14)

### B13: Trust, safety & notifications
- **Status**: ⚠️ Partially Completed (Report mechanism done, Notifications missing).

### B14: Search, docs, seed, security & deploy
- **Status**: ❌ Not Started

# AGENTS Permanent Rules

## 1. Project Memory Rule
At the beginning of EVERY task, you MUST READ:
- `/AGENTS.md`
- `/docs/PROJECT_MEMORY.md`

Then read the documentation relevant to the task.

At the end of EVERY task, you MUST UPDATE:
- `/docs/PROJECT_MEMORY.md`

Record completed work, changed architecture, changed database, changed APIs, decisions, bugs, and remaining tasks.

## 2. No Feature Drift
The following labels must always be respected:
- `[REQUIRED-SRS]`
- `[NEW-FEATURE]`
- `[APPROVED]`
- `[PROPOSED]`
- `[IMPLEMENTED]`
- `[DEPRECATED]`
- `[OPEN QUESTION]`

Never turn an AI suggestion into a requirement without explicit approval.

## 3. When You Are Uncertain
Do NOT guess silently. Say "I found an ambiguity."
Explain the source requirement, possible interpretations, recommended interpretation, and architectural impact.
If it materially affects architecture, mark it as `[OPEN QUESTION]`.

## 4. GitHub Push Instructions & Workflow
- **Phase Naming Convention**: DO NOT use terms like "B1", "F1", or "A1" which make it feel AI-generated. Use descriptive, professional phase names such as "Backend Foundation", "Backend Authentication", "Frontend Profile", etc.
- **Commit Style**: Use professional, clear, and descriptive commit messages (e.g., `feat(auth): implement jwt token generation`, `chore(docs): update project memory`).
- **Push Timing**: After every completed backend or frontend phase, you MUST push the code to GitHub before starting the next phase.
- **Git Ignore Rules**: NEVER push `.md` files to GitHub except for `README.md`. NEVER push `.pdf` files to GitHub. Ensure the `.gitignore` correctly ignores the `docs/` folder and any PDFs.

## 5. Development Strategy
Development happens in strict phases:
DOCUMENTATION → BACKEND → BACKEND TESTING → AI → AI TESTING → FRONTEND → FULL INTEGRATION → PRODUCTION HARDENING

For every development phase:
1. Read project memory.
2. Read relevant SRS/New Feature requirements.
3. Check previous completed modules.
4. Identify dependencies.
5. Create implementation plan.
6. Identify database/API/security changes.
7. Implement.
8. Write tests.
9. Run all relevant tests and fix regressions.
10. Update documentation and `PROJECT_MEMORY.md`.
11. Report what was completed and STOP.

## 6. Do Not Break Existing Work
Before changing an existing module, identify why, affected requirements/models/APIs/tests, migration requirements, and run regression tests. Never silently break existing functionality.

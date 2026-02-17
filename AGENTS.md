# AGENTS

Last updated: February 17, 2026

## Session Start Protocol (Invoice-Scope)
1. Confirm repository and branch state:
   - Repo: `crisesarmiento/invoice-scope`
   - Preferred working branch prefix: `codex/`
2. Read `docs/context/SESSION_CONTEXT.md` before making changes.
3. Verify current integration health:
   - GitHub project board item flow
   - GitHub -> Linear issue sync behavior
   - SonarCloud workflow configuration status
4. If user asks to continue roadmap execution, prioritize milestone order:
   - M1 -> M2 -> M3 -> M4 -> M5
5. Keep GitHub and Linear aligned:
   - Preserve linkage marker comments in GitHub issues:
     `<!-- linear_issue_id: ... -->`
   - Do not create duplicate Linear issues when marker already exists.

## Persistent Project Context
### GitHub
- Repo: `crisesarmiento/invoice-scope`
- Roadmap board: `https://github.com/users/crisesarmiento/projects/2`
- Milestones:
  - `M1 - CI Foundation`
  - `M2 - CD and Secure Delivery`
  - `M3 - Auth and Security Hardening`
  - `M4 - Invoice Tracking Workflows`
  - `M5 - SSO (Google First)`

### Linear
- Initiative: `Projectos Individuales Cristian Github`
  - ID: `a73d38bf-f088-432e-a39b-2537cf046791`
- Project: `Invoice-Scope`
  - ID: `18f879b5-9ccd-4549-b4f7-2ed382c1c6ef`
- Team: `Cris-Emi`
  - ID: `a901c542-7bcb-4f89-9731-e753f16ee745`
- Backfill status: GitHub open roadmap issues were synced into Linear (`CE-185`..`CE-215`).

## Integration Workflows In Repo
- `.github/workflows/project-auto-add.yml`
  - Adds roadmap-labeled issues/PRs to GitHub Project #2.
- `.github/workflows/ci-sonar.yml`
  - Runs CI + SonarCloud analysis and quality gate wait.
- `.github/workflows/linear-sync.yml`
  - Syncs roadmap-labeled GitHub issues into Linear.
  - Handles issue create/update/close/reopen and milestone changes.

## Required GitHub Repository Variables
- `LINEAR_TEAM_ID`
- `LINEAR_PROJECT_ID`
- `SONAR_ORGANIZATION`
- `SONAR_PROJECT_KEY`

## Required GitHub Repository Secrets
- `LINEAR_API_KEY`
- `SONAR_TOKEN`
- `PROJECT_AUTOMATION_TOKEN`

## Guardrails
- Never store API keys/tokens in committed files.
- Keep Linear/GitHub mapping deterministic and idempotent.
- If milestone names change in GitHub, update Linear milestones and sync mapping.

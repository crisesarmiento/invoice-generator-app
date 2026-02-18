# Session Context: Invoice-Scope

Last sync: February 17, 2026

## Current Objective
Maintain a single roadmap source of truth across:
- GitHub Issues + Milestones + Project board
- Linear Initiative/Project structure
- CI/CD and security workflows in repo

## Canonical Systems
### GitHub
- Repo: `crisesarmiento/invoice-scope`
- Project board: `https://github.com/users/crisesarmiento/projects/2`
- Roadmap issue set: `#2` through `#32` (open set backfilled to Linear)

### Linear
- Initiative: `Projectos Individuales Cristian Github`
- Project: `Invoice-Scope`
- Team: `Cris-Emi`
- Backfilled issue range: `CE-185`..`CE-215`

## Sync Rules in Place
1. Roadmap classification labels:
   - `area/*`, `type/*`, `effort/*`, or exact `roadmap`
2. GitHub -> Linear linkage:
   - Marker in GitHub comments:
     `<!-- linear_issue_id: ... -->`
3. Milestone alignment:
   - `M1..M5` milestone names mirrored in Linear project milestones
   - GitHub milestone change events sync to Linear milestone assignment

## Important Operational Notes
- Local workflow changes need commit + push + merge before GitHub Actions runs them.
- SonarCloud checks require `SONAR_TOKEN`, `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY`.
- Linear sync requires `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID`.

## Start-of-Session Checklist
1. Read `AGENTS.md`.
2. Confirm current branch and uncommitted changes.
3. Confirm GitHub secrets/variables still exist.
4. If roadmap changed since last run, sync deltas (GitHub -> Linear).

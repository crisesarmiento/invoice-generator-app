# M0-M1 Shadcn Redesign Plan (Modern Ledger)

Date: 2026-02-18

## Objective
Create a distinctive, production-ready visual direction for Invoice Scope using shadcn-based UI patterns while preserving existing business flows.

## Design Direction
- Theme: Modern Ledger
- Core vibe: clean finance workspace with warm paper surfaces and green USD-oriented accents
- Typography:
  - Body: Manrope
  - Display: Space Grotesk

## Milestones
1. M0 - Theme Foundation (Effort: M)
   - Tokenized palette for background, surface, border, accent, danger, and focus states
   - Global typography and motion baseline
   - Shadcn `components.json` alignment for future component additions
2. M1 - App Shell Refresh (Effort: M)
   - Sidebar-driven navigation for desktop
   - Sticky top bar with context title and quick actions
   - Mobile menu drawer behavior

## Current Execution Scope
- Implemented M0 token baseline in `apps/web/src/app/globals.css`
- Implemented M1 shell in `apps/web/src/components/app/app-shell.tsx`
- Updated `(app)` layout to use the new shell
- Refreshed auth canvas and card styling
- Aligned core UI primitives (button/card/input/textarea/select/table/dialog/badge/switch) with theme tokens

## Research References
- https://ui.shadcn.com/docs/theming
- https://ui.shadcn.com/blocks
- https://ui.shadcn.com/docs/components/sidebar
- https://ui.shadcn.com/docs/components/data-table
- https://ui.shadcn.com/docs/components/chart
- https://tailwindcss.com/docs/theme
- https://nextjs.org/docs/app/getting-started/fonts
- https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion

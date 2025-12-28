# Khel Club Frontend – Walkover Support

## Overview

This frontend is part of the v0 Khel Club tournament management system built using **Next.js**.  
As part of the Walkover assignment, no UI redesign was done. The focus was on ensuring that the frontend can **clearly display matches that end in a Walkover**, using existing components and patterns.

The frontend consumes match and score data from the backend and renders it across fixtures, tables, and exports.

---

## How Walkover Is Displayed

Walkover handling is designed to be **data-driven**, not hardcoded.

### Match Table
- Matches returned with an outcome of `walkover` are displayed clearly in the **Match Table**
- The `Result` column reflects the walkover outcome instead of a numeric score
- Match status remains consistent with existing UI states (completed, pending, etc.)

### CSV Export
- Walkover matches are exported correctly in CSV downloads
- The result column shows `Walkover` instead of a score
- No special-case logic was added in the export flow

This ensures that adding future outcomes (forfeit, bye) will not require UI refactors.

---

## UI Behavior

- Existing components (`MatchTable`, `Fixtures`) were reused
- No new UI components were introduced
- Outcome-based rendering depends purely on API response
- Numeric score logic remains unchanged for normal matches

---

## How to Run Frontend Locally

```bash
cd v0_frontend
npm install --legacy-peer-deps
npm run dev

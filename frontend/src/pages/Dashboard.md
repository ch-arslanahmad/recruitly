# Dashboard.tsx Review

# DO now

Exactly — simplest approach. One click, one API call, no extra buttons.

Need to:

1. Add status to Job.update() in the backend
2. Add api.recruiter.job.toggleStatus() in api.ts
3. Make the badge clickable in Dashboard.tsx

Start with that?

## What Works

- Clean stats card layout with inline SVGs
- Job table with status badges and applicant counts
- Proper TypeScript (`Stats` interface, `Job[]` typing)

## Issues

| Area           | Line(s)  | Problem                                                   |
| -------------- | -------- | --------------------------------------------------------- |
| Error handling | 22-27    | No `.catch()` on `getMy()` — API failure silently ignored |
| Dead link      | 153      | "View All" is `<a href="#">` — should point to `/my-jobs` |
| Dead button    | 157      | "Post New Job" has no `onClick`                           |
| Dead buttons   | 223, 237 | Edit & Delete icons have no `onClick`                     |
| Dead UI        | 264-278  | Quick Actions are plain `<li>` elements, not links        |
| Fake data      | 331-379  | Recent Activity is hardcoded ("Ahmed applied to...")      |

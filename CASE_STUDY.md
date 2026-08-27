# Case Study — Nexus AI

## The problem

Teams experimenting with "AI infrastructure" (inference nodes, model
endpoints, API keys) rarely have a lightweight, self-hosted place to
track what's deployed, who owns it, and what config/artifacts went into
each deployment — without paying for a full cloud console. Nexus AI is a
small, opinionated dashboard for that: sign up, deploy/manage "AI nodes"
from a per-user dashboard, attach config files or reference documents to
a deployment via file upload, and watch node status change in real time
as it happens — with an admin view across all users for whoever runs the
platform.

## Tech choices and why

- **React (Vite) + Tailwind CSS v4 + Zustand** on the frontend. Vite for
  fast local iteration; Zustand instead of Redux because the app's
  client state (auth token, nodes list, theme) is small and doesn't
  need Redux's boilerplate; Tailwind for speed of building a
  consistent, dark-first UI without hand-rolling a component library.
- **Node.js/Express + MongoDB (Mongoose)** on the backend. The core
  data — users, nodes, uploads — is document-shaped and doesn't need
  relational joins, so MongoDB was a natural fit, and Express keeps the
  REST surface small and easy to reason about.
- **JWT + bcrypt** for auth instead of sessions, since the frontend and
  backend are deployed separately (Vercel + Railway) and a stateless
  token avoids needing shared session storage across hosts.
- **Cloudinary** for file storage instead of local disk or S3. Local
  disk doesn't survive redeploys on Railway/Render's ephemeral
  filesystems, and Cloudinary's free tier + simple SDK was faster to
  wire up than configuring S3 IAM policies for a capstone-sized project.
- **Socket.io** for the real-time layer (live node create/update/delete
  events, simulated telemetry ticks). Chosen over raw WebSockets for
  its automatic reconnection and its room API, which made scoping
  events to a single user's session (rather than broadcasting every
  user's activity to everyone) a few lines of code instead of a custom
  protocol.
- **Role-based access (`user`/`admin`) baked into the JWT** rather than
  looked up per-request, so authorization checks on protected routes
  are a cheap comparison instead of an extra database round-trip.

## A challenge I hit, and how I solved it

**Problem:** several dashboard routes (`/analytics`, `/models`,
`/api-keys`) were reachable without logging in, while the rest of the
authenticated pages correctly redirected to `/login`. This happened
because those three routes were added later and the `isAuthenticated ?
<Page /> : <Navigate to="/login" />` guard pattern used everywhere else
was accidentally left off — each route was gated individually in
`App.jsx` rather than through a shared wrapper, so it was easy for a new
route to slip through ungated.

**Fix:** short term, every route was audited against the same
`isAuthenticated` guard so behavior is consistent again. The same gap
showed up again while adding the admin dashboard — a logged-in
non-admin hitting `/admin` needed a *different* fallback (back to their
own dashboard, not `/login`, since they are authenticated, just not
authorized) — which made the inconsistency risk obvious a second time.
Longer term, the fix that actually prevents this class of bug from
recurring is a small `<ProtectedRoute requiredRole="admin">` wrapper
component that every new authenticated route uses by construction,
instead of each route re-implementing its own inline ternary.

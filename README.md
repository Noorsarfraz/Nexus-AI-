# ⚡ Nexus AI

> **AI infrastructure deployment & monitoring platform** — deploy, manage, monitor, and administer AI nodes from a secure, real-time dashboard.


### 🚀 Live Demo

- **Frontend:** https://nexus-ai-virid-eta.vercel.app
- **Backend API:** https://nexus-ai-production-72d2.up.railway.app/api
- **Repository:** https://github.com/Noorsarfraz/Nexus-AI-

---

## ✨ What is Nexus AI?

Nexus AI brings AI node deployment, configuration files, ownership, monitoring, and administration into one focused platform.

### Core capabilities

- 🔐 **Authentication** — JWT + bcrypt with protected routes
- 🖥️ **Node Management** — full create, read, update, delete workflow
- 📁 **File Uploads** — configuration/reference files stored on Cloudinary
- ⚡ **Real-Time Monitoring** — Socket.io events and live telemetry
- 👑 **Role-Based Access** — `user` and `admin` permissions
- 📊 **Analytics** — dashboard metrics and charts with Recharts
- 🌓 **Dark / Light Mode** — persisted theme preference
- 🛡️ **Validation & UX** — client/server validation, loading, error, empty and success states
- 🧪 **Automated Testing** — backend, frontend, simulated E2E, and Cypress browser tests
- 🐳 **Docker** — local multi-service environment
- 🔄 **CI/CD** — GitHub Actions on pushes and pull requests

---

## 🧭 Application

### Public

`/` · `/login` · `/signup` · `/core-preview`

### Authenticated

`/dashboard` · `/deploy-node` · `/uploads` · `/analytics` · `/models` · `/api-keys` · `/billing` · `/profile` · `/settings`

### Admin

`/admin`

Authenticated users are protected by route guards; authenticated non-admin users cannot access admin functionality.

---

## 🏗️ Architecture

```text
┌──────────────────────────┐
│   React 19 + Vite        │
│   Tailwind + Zustand     │
│   React Router           │
└────────────┬─────────────┘
             │ HTTPS / REST / JWT
             ▼
┌──────────────────────────┐
│   Node.js + Express 5    │
│   REST API + Socket.io   │
│   JWT / bcrypt / Multer  │
└──────────┬───────┬───────┘
           │       │
       Mongoose  Cloudinary
           │       │
           ▼       ▼
     ┌─────────┐ ┌───────────┐
     │ MongoDB │ │ Cloudinary│
     │ Atlas   │ │ Files     │
     └─────────┘ └───────────┘
```

The frontend communicates with the Express API through `VITE_API_URL`. MongoDB stores users, nodes, and upload metadata; Cloudinary stores binary files. Socket.io runs alongside the API and sends events to each user's private room.

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19, Vite | Modern SPA |
| Styling | Tailwind CSS v4 | Responsive UI + theming |
| State | Zustand | Lightweight client state |
| Routing | React Router | Navigation + protected routes |
| Backend | Node.js, Express 5 | REST API |
| Database | MongoDB Atlas, Mongoose | Persistent application data |
| Auth | JWT, bcrypt | Authentication + authorization |
| Files | Multer, Cloudinary | Persistent uploads |
| Real-time | Socket.io | Live node/telemetry updates |
| Charts | Recharts | Analytics visualization |
| Testing | Jest, Supertest, Vitest, RTL, Cypress | Unit/API/E2E coverage |
| DevOps | Docker, GitHub Actions | Containers + CI |

---

## 🔐 Authentication & RBAC

Nexus AI uses JWT authentication with bcrypt password hashing.

**Signup**
- Validates credentials.
- Hashes passwords before storage.
- Creates the account in MongoDB.
- The first account on a fresh database becomes `admin`.
- `ADMIN_EMAILS` can define additional admin accounts.
- The client cannot self-promote by submitting a `role`.

**Protected API**

```text
Authorization: Bearer <JWT>
```

**Admin API**

```text
verifyToken → requireAdmin
```

Admin operations include user management, platform statistics, and platform-wide node/upload management.

---

## 🔄 CRUD & API

### AI Nodes

| Action | Endpoint |
|---|---|
| Create | `POST /api/nodes` |
| Read | `GET /api/nodes` |
| Update | `PUT /api/nodes/:id` |
| Delete | `DELETE /api/nodes/:id` |
| Deploy | `POST /api/nodes/deploy` |

### Users

| Action | Endpoint |
|---|---|
| Create | `POST /api/signup` |
| Read | `GET /api/admin/users` |
| Update role | `PUT /api/admin/users/:id/role` |
| Delete | `DELETE /api/admin/users/:id` |

### Uploads

| Action | Endpoint |
|---|---|
| Create | `POST /api/uploads` |
| Read | `GET /api/uploads` |
| Delete | `DELETE /api/uploads/:id` |

Nodes and uploads are associated with their owning user, while admin endpoints provide platform-level management.

---

## ⚡ Real-Time Features

Socket.io provides:

- `node:created`
- `node:updated`
- `node:deleted`
- Live telemetry ticks

Node changes are pushed to the user's private room, so open tabs/devices update without a manual refresh.

---

## 📁 File Upload Flow

```text
React Dropzone
      ↓
    Multer
      ↓
  Cloudinary
      ↓
MongoDB metadata
```

This avoids relying on ephemeral cloud-server storage and keeps upload metadata linked to the authenticated user.

---

## 🎨 UX & Validation

- Responsive dashboard and landing experience
- Dark/light theme persisted in `localStorage`
- Client-side validation
- Server-side validation
- Loading/skeleton states
- Error handling
- Empty states
- Success feedback
- Protected-route redirects

---

## 🧪 Testing

The project contains **28+ automated tests/spec cases**, exceeding the required 10-test minimum.

| Layer | Tools | Coverage |
|---|---|---|
| Backend API | Jest, Supertest, MongoDB Memory Server | Auth, CRUD, validation, errors |
| Frontend | Vitest, React Testing Library, User Event | Components, forms, interactions |
| Simulated E2E | Vitest + RTL | Login → node creation → dashboard |
| Browser E2E | Cypress | Signup → login → deploy → verify |

### Backend

`backend/tests/api.test.js`

Covers signup, login, auth failures, user plan access, node CRUD, validation, duplicate registration, and error paths.

```bash
cd backend
npm install
npm test
```

### Frontend

```bash
cd frontend
npm install
npm test
```

### Cypress

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cd frontend && npm run test:e2e
```

For interactive Cypress:

```bash
cd frontend
npx cypress open
```

> Cloudinary-dependent upload/deployment integration paths are not included in backend integration tests because they require live third-party services; they can be added later with mocked Cloudinary calls.

---

## 🚀 Local Setup

### Requirements

- Node.js 20+
- npm
- MongoDB / MongoDB Atlas
- Cloudinary account

### 1. Clone

```bash
git clone https://github.com/Noorsarfraz/Nexus-AI-.git
cd Nexus-AI-
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Backend:

```text
http://localhost:5001
```

Set your own values in `backend/.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_long_random_secret
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAILS=admin@example.com
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## ☁️ Deployment

### Backend — Railway

1. Deploy the `backend/` directory.
2. Use `npm install` as the build command.
3. Use `npm start` as the start command.
4. Configure `MONGO_URI`, `JWT_SECRET`, Cloudinary variables, `PORT`, and optional `ADMIN_EMAILS`.

**Live API:** https://nexus-ai-production-72d2.up.railway.app/api

### Frontend — Vercel

1. Deploy the `frontend/` directory.
2. Build command: `npm run build`
3. Output: `dist`
4. Set:

```env
VITE_API_URL=https://nexus-ai-production-72d2.up.railway.app/api
```

`frontend/vercel.json` provides the SPA rewrite required by React Router.

**Live app:** https://nexus-ai-virid-eta.vercel.app

---

## 🐳 Docker

The repository includes Dockerfiles for both services and a root `docker-compose.yml`.

```bash
docker compose up --build
```

Services:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5001
MongoDB  → localhost:27017
```

MongoDB data is persisted through a named Docker volume.

---

## 🔄 CI/CD

`.github/workflows/ci.yml` runs on every push and pull request to `main`.

CI performs:

1. Backend dependency installation
2. Backend Jest tests
3. Frontend dependency installation
4. Frontend Vitest tests
5. Frontend production build

---

## 📂 Project Structure

```text
Nexus-AI-/
├── backend/
│   ├── config/              # MongoDB + Cloudinary
│   ├── models/              # User, Node, Upload
│   ├── tests/               # Jest + Supertest
│   ├── server.js            # Express + Socket.io
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/           # Application views
│   │   ├── components/      # Reusable UI
│   │   ├── store/           # Zustand state
│   │   └── test/             # Simulated E2E
│   ├── cypress/e2e/          # Browser E2E
│   └── Dockerfile
├── .github/workflows/ci.yml
├── docker-compose.yml
├── CASE_STUDY.md
└── README.md
```

---

## 📌 Case Study

### Problem

AI infrastructure experiments can become difficult to track: deployed nodes, ownership, configuration files, and live status often end up scattered across different tools.

**Nexus AI** provides one focused dashboard for that workflow.

### Why these technologies?

- **React + Vite + Tailwind + Zustand** — fast, responsive UI with lightweight state management.
- **Node + Express + MongoDB** — simple REST architecture suited to document-shaped users, nodes, and uploads.
- **JWT + bcrypt** — stateless authentication for independently deployed frontend/backend services.
- **Cloudinary** — persistent file storage that survives cloud redeployments.
- **Socket.io** — room-based real-time updates with automatic reconnection.

### Challenge

As the dashboard grew, authentication behavior needed to remain consistent across many protected routes.

The solution was an authorization audit and a guard pattern separating **authentication** from **authorization**: unauthenticated users are sent to login, while authenticated non-admin users attempting `/admin` are returned to their own dashboard.

---

## 🏆 Requirement Coverage

| Requirement | Status |
|---|---|
| 4–5+ frontend views | ✅ |
| CRUD on related resources | ✅ |
| Real database persistence | ✅ |
| Complete authentication | ✅ |
| Protected routes | ✅ |
| Role-based permissions | ✅ |
| Client + server validation | ✅ |
| Loading/error/empty states | ✅ |
| Responsive UI | ✅ |
| Live frontend + backend | ✅ |
| Public GitHub repo | ✅ |
| 10+ tests | ✅ |
| Real-time features | ✅ |
| File uploads | ✅ |
| Dashboard charts | ✅ |
| Dark mode | ✅ |
| CI/CD | ✅ |
| Docker | ✅ |
| Case study | ✅ |

---

## 🔒 Security

Never commit:

```text
backend/.env
frontend/.env
```

Use `.env.example` templates and deployment-provider environment variables instead.

If credentials were ever exposed publicly, rotate the affected MongoDB, JWT, Cloudinary, and other third-party credentials immediately.

---

## 📜 Acknowledgments & Context

This project was developed as the final full-stack capstone project for the **Neurofive Solutions** internship program. 

It serves as a comprehensive portfolio piece demonstrating end-to-end web development, API design, database management, automated testing, and live deployment.
## Nexus-AI

AI neural-node deployment and monitoring platform: users sign up, deploy/manage "AI nodes" from a per-user dashboard, upload files, and view live telemetry.

### Live URLs

> Fill these in once deployed.

* **Frontend:** `<your frontend URL, e.g. https://nexus-ai.vercel.app>`
* **Backend API:** `<your backend URL, e.g. https://nexusaibackend-production.up.railway.app>`

### Architecture Overview

```
┌─────────────────┐        HTTPS / REST         ┌──────────────────┐
│   Frontend       │  ─────────────────────────▶ │   Backend         │
│   React + Vite   │  ◀───────────────────────── │   Node.js/Express │
│   (Vercel/       │        JSON + JWT            │   (Railway/       │
│    Netlify)       │                              │    Render)        │
└─────────────────┘                              └─────────┬────────┘
                                                             │
                                        ┌────────────────────┼────────────────────┐
                                        ▼                                         ▼
                                ┌───────────────┐                       ┌──────────────────┐
                                │  MongoDB Atlas │                       │    Cloudinary      │
                                │  (users, nodes,│                       │  (uploaded files/   │
                                │   uploads)      │                       │   images)           │
                                └───────────────┘                       └──────────────────┘
```

* **Frontend** — React 19 + Vite, Tailwind CSS v4, Zustand for state, React Router for client-side routing. Talks to the backend over `VITE_API_URL`.
* **Backend** — Express 5 REST API. Handles auth (JWT + bcrypt), per-user AI node CRUD, and file uploads (Multer → Cloudinary storage).
* **Database** — MongoDB (Atlas in production) via Mongoose.
* **File storage** — Cloudinary (no local disk storage in production).

### Deployment

**Backend (Railway/Render/etc.):**
1. Push this repo to GitHub.
2. Create a new service pointing at the `backend/` folder, build command `npm install`, start command `npm start`.
3. Set environment variables on the host (never commit real values): `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT`.

**Frontend (Vercel/Netlify):**
1. Create a new project pointing at the `frontend/` folder, build command `npm run build`, output directory `dist`.
2. Set environment variable `VITE_API_URL` to the deployed backend's `/api` URL.
3. Add a SPA rewrite rule (all routes → `/index.html`) so React Router routes work on refresh/direct navigation.

### Local Setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in your own MongoDB/JWT/Cloudinary values
npm install
npm start               # http://localhost:5001

# Frontend (new terminal)
cd frontend
npm install
npm run dev              # http://localhost:5173
```

## Automated Testing

The project includes automated tests covering the **backend API, frontend components, role-based authorization, and end-to-end user flows**.

| Layer                | Testing Tools                                                                 | Test Location                          |
| -------------------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| **Backend API**      | Jest, Supertest, MongoDB Memory Server                                        | `backend/tests/api.test.js`            |
| **Frontend**         | Vitest, React Testing Library, Testing Library User Event                     | `frontend/src/**/__tests__/*.test.jsx` |
| **Simulated E2E**    | Vitest, React Testing Library, mocked network, real Zustand store and routing | `frontend/src/test/e2e-flow.test.jsx`  |
| **Real Browser E2E** | Cypress                                                                       | `frontend/cypress/e2e/user-flow.cy.js` |

### Backend API Tests

The backend test suite contains **15 automated tests** covering the project's core API functionality.

Test coverage includes:

* `POST /api/signup`
* `POST /api/login`
* `GET /api/user/plan`
* `GET /api/nodes`
* `POST /api/nodes`
* `PUT /api/nodes/:id`
* `DELETE /api/nodes/:id`
* Missing required fields
* Duplicate email registration
* Incorrect login credentials
* Missing or invalid authentication tokens
* Attempting to delete a node more than once

The tests use **MongoDB Memory Server** to create a temporary in-memory MongoDB database. This keeps test data isolated from the application's real `nexus_ai` database and eliminates the need for a manually configured test database.

> **Note:** Cloudinary-dependent routes such as `/api/uploads` and `/api/nodes/deploy` are currently excluded from the backend integration tests because they require external third-party services. These routes can be covered in a future iteration using mocked Cloudinary services.

#### Run Backend Tests

```bash
cd backend
npm install
npm test
```

### Frontend Tests

The frontend test suite uses **Vitest, React Testing Library, and Testing Library User Event** to verify component rendering, user interactions, and form validation.

The suite covers:

* `Button`

  * Component rendering
  * Variant styling
  * Click interaction

* `EmptyState`

  * Heading and description rendering
  * Action button interaction

* `SignupPage`

  * Email and password fields
  * Successful signup flow
  * Backend error handling

* `DeployNodeForm`

  * Required node name validation
  * Minimum node name length
  * Required deployment date
  * Required access key
  * Required configuration file
  * Clearing validation errors after correcting input

The frontend currently contains **13 tests** covering these scenarios.

#### Run Frontend Tests

```bash
cd frontend
npm install
npm test
```

### End-to-End Testing

The project includes **two levels of end-to-end testing** to verify complete user workflows.

#### 1. Simulated E2E Test

The simulated E2E test runs as part of the regular Vitest test suite and does not require the backend or frontend development servers to be running.

It uses:

* Vitest
* React Testing Library
* Mocked network requests
* Real Zustand store
* Real application routing

The test simulates the following user journey:

**Login → Create an AI Node → Node Appears in Dashboard**

Test file:

```text
frontend/src/test/e2e-flow.test.jsx
```

Because network requests are mocked, this test is fast and suitable for automated CI environments.

#### 2. Real Browser E2E Test

The project also includes a **Cypress end-to-end test** that runs against the actual application in a real browser.

The test verifies the complete workflow:

**Signup → Login → Deploy a Node → Verify Node Appears**

Test file:

```text
frontend/cypress/e2e/user-flow.cy.js
```

#### Run Cypress Tests

Start the backend:

```bash
cd backend
npm start
```

Backend:

```text
http://localhost:5001
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Then open Cypress interactively:

```bash
cd frontend
npx cypress open
```

Or run the E2E tests in headless mode:

```bash
cd frontend
npm run test:e2e
```

## Case Study

### Problem
Nexus-AI provides a single workspace for users to deploy and monitor AI/server nodes, manage uploaded configuration files, and review operational analytics instead of keeping these workflows in disconnected tools.

### Technology choices
- **React + Vite + Tailwind CSS** for a fast, responsive dashboard experience.
- **Express + Node.js** for a lightweight REST API and authentication middleware.
- **MongoDB + Mongoose** for persistent user, node, and upload records.
- **JWT + bcrypt** for stateless authentication with protected API routes.
- **Cloudinary** for production file storage.
- **Vercel + Railway** for simple independent frontend/backend deployments.

### Challenge and solution
A key challenge was keeping user data isolated while moving from temporary application state to persistent storage. The solution was to model users, nodes, and uploads in MongoDB and attach each resource to the authenticated user's ID/email. Protected queries then filter by the authenticated user, while admin-only endpoints use a separate role authorization middleware.

### Testing Requirements

The automated testing implementation satisfies the following requirements:

* [x] **13 frontend tests** covering component rendering, user interactions, and form validation
* [x] **15 backend tests** covering core API endpoints and both successful and failure scenarios
* [x] **End-to-end user flow** covering login, node creation/deployment, and dashboard verification
* [x] **Simulated E2E testing** suitable for automated/CI environments
* [x] **Real-browser E2E testing** using Cypress
* [x] **Documented test execution commands** for backend, frontend, and E2E testing

This testing structure provides coverage across the application's **UI, business logic, API layer, authentication, validation, database interactions, routing, and complete user workflows**.

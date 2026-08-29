# ⵣ Language Challenge — Frontend

A modern, mobile-first **React + Vite + Tailwind CSS** frontend for the multi-language word challenge game. It supports **Tachelhit (Amazigh), French, English and German**, and consumes an already-deployed backend API.

The backend is the **source of truth** for game state: score, attempts, current question, lock times and completion are all computed server-side. The frontend only requests and displays the state returned by the API.

---

## ✨ Features

**Player side**
- Animated, mobile-first landing page with a neutral, language-agnostic visual identity.
- Open any challenge via its unique short link: `/challenge/abc123xyz`.
- Answer the challenge's 10 words one at a time with a live progress bar, remaining attempts (hearts) and score.
- Correct answer → +10 points. Wrong answer → lose a heart. 10 mistakes → challenge locks for 5 hours (server-enforced).
- Locked screen with a real-time `HH:MM:SS` countdown. When it hits zero the page re-requests the real state from the backend.
- Success screen with score, correct / wrong answers, accuracy, completion time and a confetti animation.

**Admin side**
- JWT login (`/admin/login`), token stored in `localStorage` and attached to protected requests.
- Dashboard with challenge statistics.
- Create, edit, list and delete challenges — choose the **target language** and exactly 10 words each.
- One-click copy of the challenge share link.

**Security**
- Correct answers are never sent to the frontend.
- Game state is never computed on the client.
- No credentials, secrets or backend internals live in this repo.

---

## 🧱 Technology stack

| Layer     | Choice                                   |
| --------- | ---------------------------------------- |
| Framework | React 18                                 |
| Build     | Vite 5                                   |
| Styling   | Tailwind CSS 3 (PostCSS + Autoprefixer)  |
| Routing   | React Router 7 (declarative mode)        |
| HTTP      | Axios (single centralized instance)      |
| Icons     | React Icons                              |

---

## 🚀 Installation

Requirements: **Node.js 18+** (tested with 20/22/25) and **npm**.

```bash
cd client
npm install
```

## ▶️ Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`. In development the Vite server proxies `/api` requests to the local backend (`http://localhost:5000`, see `vite.config.js`), so no environment variable is required locally.

## 📦 Production build

```bash
npm run build     # outputs to client/dist
npm run preview   # serve the production build locally
```

---

## 🔧 Environment variables

Create a `.env` file in the `client/` directory from the committed example:

```bash
cp .env.example .env
```

| Variable       | Required | Description                                                              |
| -------------- | -------- | ------------------------------------------------------------------------ |
| `VITE_API_URL` | For Vercel deploy | Base URL of the already-deployed backend API. |

```env
VITE_API_URL=https://YOUR-BACKEND-URL/api
```

> The client normalizes a trailing `/api`, so both `https://YOUR-BACKEND-URL` and `https://YOUR-BACKEND-URL/api` work. Leave it empty only when running against a local backend through the Vite proxy.
>
> `.env` files are never committed. Only `.env.example` is committed.

---

## 🔌 Backend API configuration

The frontend expects the deployed backend to expose these endpoints (relative to `VITE_API_URL`):

| Method | Endpoint                       | Auth            | Description                                   |
| ------ | ------------------------------ | --------------- | --------------------------------------------- |
| POST   | `/api/auth/login`              | public          | Admin login, returns a JWT                    |
| GET    | `/api/auth/me`                 | admin (Bearer)  | Current admin profile                         |
| GET    | `/api/challenges/stats`        | admin (Bearer)  | Dashboard statistics                          |
| GET    | `/api/challenges`              | admin (Bearer)  | List all challenges                           |
| POST   | `/api/challenges`              | admin (Bearer)  | Create a challenge (exactly 10 words)         |
| GET    | `/api/challenges/:id`          | admin (Bearer)  | Get challenge details (for editing)           |
| PUT    | `/api/challenges/:id`          | admin (Bearer)  | Update a challenge                            |
| DELETE | `/api/challenges/:id`          | admin (Bearer)  | Delete a challenge and its sessions           |
| GET    | `/api/challenges/:code/status` | public          | Validate a challenge link                     |
| POST   | `/api/challenges/:code/start`  | player token    | Start / resume a player session               |
| GET    | `/api/challenges/:code/state`  | player token    | Get current game state (never the answers)    |
| POST   | `/api/challenges/:code/answer` | player token    | Submit an answer; server validates and updates |

- Admin requests send `Authorization: Bearer <jwt>`.
- Player requests send `x-player-token` (returned when a session is started).

---

## 📁 Project structure

```
client/
├── .env.example          # committed env template (no secrets)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json           # SPA fallback rewrites for Vercel
├── vite.config.js        # Vite + dev proxy to local backend
└── src/
    ├── components/
    │   ├── Attempts.jsx
    │   ├── Countdown.jsx
    │   ├── Header.jsx
    │   ├── Loading.jsx
    │   ├── ProgressBar.jsx
    │   ├── ProtectedRoute.jsx
    │   └── QuestionCard.jsx
    ├── context/AuthContext.jsx
    ├── pages/
    │   ├── AdminDashboard.jsx
    │   ├── AdminLogin.jsx
    │   ├── Challenge.jsx
    │   ├── CreateChallenge.jsx
    │   ├── Home.jsx
    │   ├── Locked.jsx
    │   ├── ManageChallenges.jsx
    │   ├── NotFound.jsx
    │   └── Success.jsx
    ├── services/api.js   # single Axios instance + all API functions
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

---

## 🌐 Deployment (Vercel)

1. Push this `client/` folder to GitHub as its own repository.
2. In the Vercel dashboard click **Add New → Project** and import that repository.
3. Set **Root Directory** to `.` (or `client` if the repo contains both `client/` and `server/`).
4. Set the environment variable:

   | Name          | Value                          |
   | ------------- | ------------------------------ |
   | `VITE_API_URL` | `https://YOUR-BACKEND-URL/api` |

   Replace with the actual deployed backend URL (e.g. `https://your-backend.vercel.app/api`).

5. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
6. Make sure the backend CORS allows your frontend origin.

SPA routing is handled by `vercel.json`, which rewrites every path to `index.html`, so deep links like `/challenge/abc123` and `/admin/dashboard` work directly.

---

## 📦 Pushing to GitHub

```bash
git add .
git commit -m "Prepare frontend for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> `node_modules/`, `dist/` and any `.env` file are ignored and will not be pushed. If `node_modules` was committed before, run `git rm -r --cached node_modules` first.

---

## 🧰 Troubleshooting

- **Login fails** — make sure the backend is reachable at `VITE_API_URL` and that an admin account exists in the database.
- **Challenges load but player actions fail** — confirm the player endpoints accept the `x-player-token` header.
- **Deep links return 404 on Vercel** — `vercel.json` is present; if it was removed, re-add the rewrite rule for `/(.*) → /index.html`.
- **`VITE_API_URL` not applied** — Vite inlines env vars at build time; re-run `npm run build` after changing `.env`. Env variables without the `VITE_` prefix are never exposed to the browser.
- **CORS errors** — the backend must allow your frontend origin in its `CLIENT_URL` setting.

---

## 📄 License

MIT — free to use, modify and share. 🌍

# MedWaste Smart

**Smarter Medical Waste · Safer Healthcare**

An AI-assisted medical-waste collection and segregation platform built for
hospitals. It streamlines the full lifecycle — from waste identification and
segregation, through smart collection requests, QR-powered bin tracking, to
real-time analytics and reporting.

The application ships with a **complete localStorage-backed mock** so the
hackathon demo runs with **zero configuration** — no backend, no database, no
API keys. It can optionally be upgraded to real Firebase auth and Firestore.

---

## 🚀 Quick Start

```bash
# Install dependencies (requires Node ≥ 18)
pnpm install      # or: npm install

# Start the dev server
pnpm dev          # or: npm run dev

# Build for production
pnpm build        # or: npm run build

# Run the linter
pnpm lint         # or: npm run lint
```

> The app auto-opens at `http://localhost:5173`.

## 🔑 Demo Credentials

| Role      | Email                       | Password    |
|-----------|-----------------------------|-------------|
| Staff     | `staff@medwaste.demo`       | `staff123`  |
| Collector | `collector@medwaste.demo`   | `collector123` |
| Admin     | `admin@medwaste.demo`       | `admin123`  |

Click a demo card on the login page to auto-fill the form.

---

## 🎯 Features

### Staff Workflow
- **AI Waste Identification** — Upload a photo or pick a built-in example.
  A mock AI classifier identifies the waste type and recommends the correct
  colour-coded container.
- **Waste Category Guide** — Quick-reference cards for all 5 waste categories
  with safety instructions.
- **Collection Requests** — Submit priority collection requests with bin
  selection, fill-level, quantity, and notes.
- **Request Tracking** — Tabbed view of all requests with a status timeline
  showing each step of the collection workflow.
- **Waste Records** — Saved classification results persisted locally.

### Collector Workflow
- **QR Bin Scanning** — Scan a bin's QR code with the device camera
  (or enter a bin ID manually) to view bin details and its requests.
- **Collection Actions** — Accept, start, and complete collections with
  real-time status updates.
- **Dashboard** — Overview of available requests, active assignments, and
  collections completed today.

### Admin Dashboard
- **Bin Management** — View, add, edit, and delete bins. Generate QR codes
  for any bin and download them as PNG.
- **Analytics** — Interactive charts (pie, bar, line) for waste categories,
  request statuses, weekly collections, and fill-level distribution.
- **Tracking Center** — Full collection-request table with status tabs and
  search. Bin activity overview.
- **Reports** — Date-range filters, department breakdowns, risk bins, and
  collection history.
- **Profile** — Manage user details, theme preference, and account actions.

### Cross-Cutting Features
- **Role-based access control** — Protected routes enforce role membership.
- **Real-time notifications** — Bell icon with unread count; toasts for new
  requests; auto-dismiss after 10 s.
- **Dark mode** — Toggle between light and dark themes.
- **Responsive design** — Mobile-first layout with collapsible sidebar.

---

## 🏗️ Tech Stack

| Category      | Technology                          |
|---------------|-------------------------------------|
| Framework     | React 18 (hooks, context, lazy/Suspense) |
| Build         | Vite 5                              |
| Styling       | Tailwind CSS 3                      |
| Routing       | React Router DOM 6 (protected routes) |
| Icons         | Lucide React                        |
| Charts        | Recharts                            |
| QR Scanning   | html5-qrcode                        |
| QR Generation | qrcode                              |
| State Mgmt    | React Context API + localStorage    |
| Linting      | ESLint 9 (flat config)              |

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components (cards, forms, modals, charts)
├── context/        # React contexts (Auth, AppData, Notification, Theme)
├── data/           # Demo / seed data
├── hooks/          # Custom hooks (useLocalStorage)
├── layouts/        # Role-based dashboard layouts (Staff, Collector, Admin)
├── pages/          # Route pages (landing, auth, staff, collector, admin)
├── services/       # Service layer (dataStore, auth, bins, collections, etc.)
│   └── ai/         # Mock AI waste classifier
└── utils/          # Constants, helpers, navigation config, status utilities
```

## 🔧 Architecture Notes

- **Data layer**: A `dataStore.js` module provides localStorage-backed store
  objects. Services (`binService`, `collectionService`, `notificationService`,
  `wasteService`) check a `USE_MOCK_DATA` flag and either hit Firestore or the
  local store.
- **Auth**: `authService` validates credentials against a demo table and
  persists a 30-day session in localStorage.
- **Firebase**: Marked as `external` in the Vite build so the Firebase SDK is
  not bundled in demo mode. To enable, set `VITE_USE_MOCK_DATA=false` and
  provide real credentials in `.env`.

## 🌈 Waste Categories

| Color  | Container                            | Examples                          |
|--------|--------------------------------------|-----------------------------------|
| Yellow | Infectious waste bag                 | Soiled waste, microbiology        |
| Red    | Pathological / contaminated          | Contaminated recyclables          |
| White  | Sharps container (puncture-proof)    | Syringes, needles, scalpels       |
| Blue   | Glassware / metallic implants        | Glass vials, metal instruments    |
| General| General waste bin                    | Non-biomedical refuse             |

---

*MED WASTE SMART — Hackathon Prototype · No backend required.*

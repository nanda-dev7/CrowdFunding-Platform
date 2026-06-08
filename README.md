<div align="center">

# 🐾 AniRescue

### Animal Welfare Crowdfunding Platform

A full-stack MERN application connecting donors with verified campaigners running animal rescue operations, medical treatments, feeding drives, and more.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-Academic-orange?style=flat-square)

</div>

---

## About

AniRescue is a purpose-built crowdfunding platform for animal welfare. Verified campaigners can raise funds for rescue operations, medical care, vaccination drives, wildlife relocation, and shelter support. Donors browse campaigns, contribute directly, and track impact through real-time dashboards. Admins oversee the entire ecosystem through a dedicated control panel.

---

## Features

- **Role-based access** — Three distinct roles: `donor`, `campaigner`, `admin`, each with dedicated dashboards and permissions
- **Campaign lifecycle** — `pending → approved → completed` with admin review at each stage
- **Direct donations** — No payment gateway; funds are tracked directly in the database with coupon code support
- **Rich campaign pages** — Cover images, animal & vet details, expense breakdown, before/during/after photo timeline, and supporting documents
- **JWT authentication** — Secure access + refresh token flow via HTTP-only cookies, auto-refreshed on expiry
- **Media uploads** — Cloudinary integration for campaign images and documents via Multer
- **Notifications** — In-app notification feed for approvals, donations, and campaign updates
- **Urgency flags** — Campaigns can be marked `urgent` for time-sensitive rescues

---

## Tech Stack

**Backend** — Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · Cloudinary · Nodemailer · Multer

**Frontend** — React 19 · Vite · React Router v7 · Zustand · TanStack Query · Tailwind CSS · Framer Motion · Recharts · Axios

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repo

```bash
git clone https://github.com/nanda-dev7/CrowdFunding-Platform.git
cd CrowdFunding-Platform
```

### 2. Configure environment variables

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/anirescue
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**`AniRescue-Frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../AniRescue-Frontend && npm install
```

### 4. Run the app

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd AniRescue-Frontend && npm run dev
```

> **Health check:** `GET http://localhost:5000/health`

### Production build

```bash
cd AniRescue-Frontend && npm run build
```

In production, Express automatically serves the built frontend from `AniRescue-Frontend/dist`.

---

## Project Structure

```
CrowdFunding-Platform/
│
├── backend/                        # Express REST API
│   ├── API/                        # Standalone handler scripts (Login, Register, etc.)
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── cloudinary.js           # Cloudinary SDK setup
│   │   └── razorpay.js             # Razorpay config (legacy)
│   ├── controllers/                # Business logic
│   │   ├── auth.controller.js      # Register, login, logout, refresh
│   │   ├── campaign.controller.js  # Campaign CRUD + updates + documents
│   │   ├── donation.controller.js  # Donation processing
│   │   ├── admin.controller.js     # Admin operations & analytics
│   │   ├── campaigner.controller.js
│   │   ├── dashboard.controller.js # Personalized stats
│   │   ├── coupon.controller.js
│   │   └── notification.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification → req.user
│   │   ├── role.middleware.js      # Role-based access guard
│   │   ├── upload.middleware.js    # Multer file upload config
│   │   └── error.middleware.js     # Global error formatter
│   ├── models/
│   │   ├── user.js                 # User schema (donor/campaigner/admin)
│   │   ├── campaign.js             # Campaign schema (complex, nested)
│   │   ├── donation.js             # Donation records
│   │   ├── campaignerRequest.js    # Campaigner applications
│   │   ├── coupon.js               # Discount coupons
│   │   └── notification.js         # In-app notifications
│   ├── routes/                     # Express Router → controller mapping
│   │   ├── auth.routes.js
│   │   ├── campaign.routes.js
│   │   ├── donation.routes.js
│   │   ├── admin.routes.js
│   │   ├── campaigner.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── coupon.routes.js
│   │   └── notification.routes.js
│   ├── utils/
│   │   ├── generateTokens.js       # Sign JWT access + refresh tokens
│   │   ├── uploadToCloudinary.js   # Upload file buffer → Cloudinary URL
│   │   ├── createNotification.js   # Create notification document
│   │   ├── assignCoupon.js         # Reward coupon logic
│   │   ├── mailer.js               # Nodemailer transporter
│   │   ├── sendEmail.js            # Send transactional emails
│   │   └── verifyRazorpaySignature.js  # HMAC webhook verify (legacy)
│   ├── app.js                      # Express app — middleware + routes
│   ├── server.js                   # Entry point — DB connect + listen
│   └── test.http                   # REST Client test file
│
└── AniRescue-Frontend/             # React + Vite SPA
    ├── src/
    │   ├── api/
    │   │   ├── axios.js            # Axios instance + 401 auto-refresh interceptor
    │   │   ├── authApi.js
    │   │   ├── campaignApi.js
    │   │   ├── donationApi.js
    │   │   ├── adminApi.js
    │   │   ├── campaignerApi.js
    │   │   ├── dashboardApi.js
    │   │   └── notificationApi.js
    │   ├── animations/
    │   │   └── motionVariants.js   # Shared Framer Motion variants
    │   ├── components/
    │   │   ├── admin/              # AdminTabs, ApprovalTable, CampaignPreviewModal, etc.
    │   │   ├── campaign/           # CampaignCard, DonationPanel, Timeline, etc.
    │   │   ├── common/             # Button, Input, Modal, Badge, Skeleton, etc.
    │   │   ├── dashboard/          # StatCard, AnalyticsChart, NotificationPanel, etc.
    │   │   └── forms/              # CreateCampaignForm, EditCampaignModal, etc.
    │   ├── hooks/
    │   │   ├── useAuth.js          # Auth state + API calls
    │   │   ├── useNotifications.js
    │   │   ├── useShareCampaign.js # Web Share API wrapper
    │   │   └── useRazorpay.js      # Legacy payment hook
    │   ├── layouts/
    │   │   ├── MainLayout.jsx      # Navbar + footer shell
    │   │   └── DashboardLayout.jsx # Dashboard sidebar shell
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Campaigns.jsx
    │   │   ├── CampaignDetail.jsx
    │   │   ├── CreateCampaign.jsx
    │   │   ├── DonorDashboard.jsx
    │   │   ├── CampaignerDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ApplyCampaigner.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Unauthorized.jsx
    │   │   └── NotFound.jsx
    │   ├── routes/
    │   │   ├── AppRoutes.jsx       # All route definitions
    │   │   ├── ProtectedRoute.jsx  # Redirects unauthenticated users
    │   │   └── RoleRoute.jsx       # Redirects unauthorized roles
    │   ├── store/
    │   │   └── authStore.js        # Zustand auth slice
    │   ├── utils/
    │   │   ├── formatCurrency.js   # 5000 → ₹5,000
    │   │   ├── formatDate.js       # ISO → readable date
    │   │   ├── getDaysLeft.js      # Deadline countdown
    │   │   ├── calculateProgress.js # raised/goal → %
    │   │   └── getInitials.js      # "John Doe" → "JD"
    │   ├── App.jsx                 # Renders <AppRoutes />
    │   ├── main.jsx                # React root + providers
    │   └── styles.css              # Global resets + CSS variables
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## API Overview

All routes are prefixed with `/api`. Protected routes require a valid JWT cookie.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/auth/register` | Public | Create account |
| `POST` | `/auth/login` | Public | Login → set token cookies |
| `POST` | `/auth/logout` | 🔒 | Clear token cookies |
| `GET` | `/campaigns` | Public | List approved campaigns |
| `GET` | `/campaigns/:id` | Public | Campaign detail |
| `POST` | `/campaigns` | 🔒 Campaigner | Create campaign |
| `PATCH` | `/campaigns/:id` | 🔒 Campaigner | Edit campaign |
| `POST` | `/campaigns/:id/updates` | 🔒 Campaigner | Post timeline update |
| `POST` | `/donations` | 🔒 | Make a donation |
| `GET` | `/users/me/dashboard` | 🔒 | Personal dashboard stats |
| `GET` | `/users/me/donations` | 🔒 | Donation history |
| `POST` | `/campaigner/apply` | 🔒 | Apply to become campaigner |
| `GET` | `/admin/requests` | 🔒 Admin | Campaigner applications |
| `PATCH` | `/admin/campaigns/:id` | 🔒 Admin | Approve / reject campaign |
| `GET` | `/notifications` | 🔒 | User notifications |

---

## User Roles

| Role | How to get it | What they can do |
|------|--------------|-----------------|
| **Donor** | Default on register | Browse, donate, view history, use coupons |
| **Campaigner** | Apply via `/campaigner/apply` + admin approval | Create & manage campaigns, post updates |
| **Admin** | Manually set in DB | Approve users/campaigns, manage platform |

---

## Data Models

<details>
<summary><strong>User</strong></summary>

```
name, email, passwordHash (hidden), role (donor|campaigner|admin),
isVerifiedCampaigner, location, organization, refreshToken (hidden)
```
</details>

<details>
<summary><strong>Campaign</strong></summary>

```
title, campaignType, description, category, goalAmount, raisedAmount,
deadline, coverImage, status (pending|approved|rejected|completed),
urgencyLevel (normal|urgent), location, animalDetails, vetDetails,
groupWelfareDetails, verificationDetails, consentChecked, creator (→User),
updates[], supportingDocuments[], expenses[], donations[] (→Donation)
```
</details>

<details>
<summary><strong>Donation</strong></summary>

```
donor (→User), campaign (→Campaign), amount, couponUsed, createdAt
```
</details>

<details>
<summary><strong>CampaignerRequest</strong></summary>

```
user (→User), organization, reason, documents[],
status (pending|approved|rejected), reviewedBy (→User)
```
</details>

<details>
<summary><strong>Coupon</strong></summary>

```
code, discountPercent, maxUses, usedCount, expiresAt, isActive
```
</details>

<details>
<summary><strong>Notification</strong></summary>

```
user (→User), message, type, read (bool), createdAt
```
</details>

---

## Scripts

| Directory | Command | Description |
|-----------|---------|-------------|
| `backend` | `npm run dev` | Start with nodemon (hot reload) |
| `backend` | `npm start` | Start with node (production) |
| `AniRescue-Frontend` | `npm run dev` | Vite dev server |
| `AniRescue-Frontend` | `npm run build` | Production bundle → `dist/` |
| `AniRescue-Frontend` | `npm run preview` | Preview production build |
| `AniRescue-Frontend` | `npm run lint` | Run ESLint |

---

## Contributing

```bash
# 1. Fork and clone
git clone https://github.com/your-username/CrowdFunding-Platform.git

# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Commit with a conventional message
git commit -m "feat: add your feature"

# 4. Push and open a Pull Request
git push origin feature/your-feature
```

---

## License

Built as part of **ATP TEAM-9** academic coursework.

---

<div align="center">
Made with ❤️ for animals in need &nbsp;·&nbsp; <strong>AniRescue — Team 9</strong>
</div>

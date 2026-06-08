# CrowdFunding-Platform

We are building crowd funding platform for crowd funding.🐾 AniRescue — Animal Welfare Crowdfunding Platform

A full-stack MERN crowdfunding platform dedicated to animal rescue and welfare. Campaigners can create verified fundraising campaigns, donors can discover and support causes, and admins oversee the entire ecosystem.

📋 Table of Contents

Overview

Features

Tech Stack

Project Structure

Getting Started

Prerequisites

Environment Variables

Installation

Running the App

API Reference

User Roles

Data Models

Contributing

🌟 Overview

AniRescue is a purpose-built crowdfunding platform for animal welfare. It connects compassionate donors with verified campaigners running rescue operations, medical treatments, feeding drives, vaccination camps, and more. The platform features a three-tier role system (Donor, Campaigner, Admin) with JWT-based authentication, Cloudinary image hosting, email notifications, and a real-time donation flow.

✨ Features

🔐 Authentication & Authorization

Secure JWT access + refresh token flow with HTTP-only cookies

Role-based access control: donor, campaigner, admin

Password hashing with bcryptjs

Protected routes on both frontend and backend

📢 Campaign Management

Campaigners can create detailed campaigns with cover images, animal details, vet details, expense breakdowns, and supporting documents

Campaign types: Individual rescue, Group rescue, Medical treatment, Feeding drive, Vaccination drive, Wildlife relocation, Shelter/foster support, and more

Urgency flags (normal / urgent) for time-sensitive rescues

Campaign lifecycle: pending → approved / rejected → completed

Campaigners can post before/during/after photo updates

💰 Donation System

Direct database-driven donations (no payment gateway dependency)

Coupon code support for discounted donations

Animated success popup on donation completion

Full donation history for donors via dashboard

🛠️ Admin Panel

Review and approve/reject campaigner applications

Manage all campaigns (approve, reject, mark complete)

Platform-wide statistics and analytics dashboard

📊 Dashboards

Donor Dashboard: Donation history, total contributed, active campaigns followed

Campaigner Dashboard: Campaign stats, fundraising progress, update posting

Admin Dashboard: Platform KPIs, user management, pending approvals

🔔 Notifications

In-app notification system for campaign updates, approval status changes, and donation receipts

☁️ Media Uploads

Cloudinary integration for campaign cover images and supporting documents

Multer middleware for multipart form-data handling

🛠 Tech Stack

Backend

Technology

Purpose

Node.js + Express.js

REST API server

MongoDB + Mongoose

Database & ODM

JWT

Access & refresh token authentication

bcryptjs

Password hashing

Cloudinary

Image & file storage

Multer

File upload middleware

Nodemailer

Email notifications

cookie-parser

HTTP-only cookie handling

dotenv

Environment configuration

nodemon

Development auto-reload

Frontend

Technology

Purpose

React 19 + Vite

UI framework & build tool

React Router v7

Client-side routing

Zustand

Global state management

TanStack React Query

Server state & data fetching

Tailwind CSS v3

Utility-first styling

Framer Motion

Animations & transitions

Recharts

Data visualizations / charts

Axios

HTTP client

Lucide React

Icon library

React Hot Toast

Toast notifications

📁 Project Structure

CrowdFunding-Platform/
├── backend/                        # Express.js REST API
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── cloudinary.js           # Cloudinary setup
│   │   └── razorpay.js             # Payment config (legacy)
│   ├── controllers/
│   │   ├── auth.controller.js      # Register, login, logout, refresh
│   │   ├── campaign.controller.js  # CRUD + approval + updates
│   │   ├── donation.controller.js  # Donation processing
│   │   ├── admin.controller.js     # Admin operations
│   │   ├── campaigner.controller.js# Campaigner request handling
│   │   ├── dashboard.controller.js # Dashboard stats
│   │   ├── coupon.controller.js    # Coupon management
│   │   └── notification.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── role.middleware.js      # Role-based guards
│   │   ├── upload.middleware.js    # Multer config
│   │   └── error.middleware.js     # Global error handler
│   ├── models/
│   │   ├── user.js                 # User schema
│   │   ├── campaign.js             # Campaign schema
│   │   ├── donation.js             # Donation schema
│   │   ├── campaignerRequest.js    # Campaigner application schema
│   │   ├── coupon.js               # Coupon schema
│   │   └── notification.js         # Notification schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── campaign.routes.js
│   │   ├── donation.routes.js
│   │   ├── admin.routes.js
│   │   ├── campaigner.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── coupon.routes.js
│   │   └── notification.routes.js
│   ├── utils/                      # Helper utilities
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Server entry point
│   └── .env                        # Environment variables
│
└── AniRescue-Frontend/             # React + Vite frontend
    ├── src/
    │   ├── api/                    # Axios API call modules
    │   ├── animations/             # Framer Motion variants
    │   ├── components/
    │   │   ├── admin/              # Admin-specific components
    │   │   ├── campaign/           # Campaign cards, detail views
    │   │   ├── common/             # Shared UI components
    │   │   ├── dashboard/          # Dashboard widgets & charts
    │   │   └── forms/              # Form components
    │   ├── hooks/                  # Custom React hooks
    │   ├── layouts/                # Page layout wrappers
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
    │   ├── routes/                 # Route guards & definitions
    │   ├── store/                  # Zustand store slices
    │   ├── utils/                  # Frontend helper utilities
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js

🚀 Getting Started

Prerequisites

Ensure you have the following installed:

Node.js v18+ — Download

MongoDB (local) or a MongoDB Atlas connection URI

Cloudinary account — Sign up

Git

Environment Variables

backend/.env

Create a file at backend/.env with the following variables:

# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/anirescue

# JWT
JWT_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client
CLIENT_URL=http://localhost:5173

# Nodemailer (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

AniRescue-Frontend/.env

VITE_API_URL=http://localhost:5000/api

Installation

1. Clone the repository

git clone https://github.com/nanda-dev7/CrowdFunding-Platform.git
cd CrowdFunding-Platform

2. Install backend dependencies

cd backend
npm install

3. Install frontend dependencies

cd ../AniRescue-Frontend
npm install

Running the App

Start the backend (development)

cd backend
npm run dev

Server runs at http://localhost:5000

Start the frontend (development)

cd AniRescue-Frontend
npm run dev

Frontend runs at http://localhost:5173

Production build

cd AniRescue-Frontend
npm run build

In production, the Express server serves the built frontend from AniRescue-Frontend/dist

Health check

GET http://localhost:5000/health

📡 API Reference

All routes are prefixed with /api.

Method

Endpoint

Auth

Description

POST

/auth/register

❌

Register a new user

POST

/auth/login

❌

Login and receive tokens

POST

/auth/logout

✅

Logout and clear cookies

POST

/auth/refresh

✅

Refresh access token

GET

/campaigns

❌

List all approved campaigns

GET

/campaigns/:id

❌

Get campaign details

POST

/campaigns

✅ Campaigner

Create a campaign

PATCH

/campaigns/:id

✅ Campaigner

Update campaign

POST

/campaigns/:id/updates

✅ Campaigner

Post a campaign update

POST

/donations

✅ Donor

Make a donation

GET

/users/me/dashboard

✅

Get dashboard stats

GET

/users/me/donations

✅

Get donation history

GET

/users/me/coupons

✅

List available coupons

POST

/campaigner/apply

✅

Apply to become a campaigner

GET

/admin/requests

✅ Admin

List campaigner applications

PATCH

/admin/requests/:id

✅ Admin

Approve / reject application

PATCH

/admin/campaigns/:id

✅ Admin

Approve / reject campaign

GET

/notifications

✅

Get user notifications

👥 User Roles

Role

Capabilities

Donor

Browse campaigns, donate, view donation history, use coupons

Campaigner

Create & manage campaigns, post updates, view fundraising stats

Admin

Approve/reject campaigners & campaigns, manage platform, view analytics

New users register as Donor by default. To become a Campaigner, submit an application via /campaigner/apply. Admin role is assigned manually in the database.

🗄️ Data Models

User

name, email, passwordHash, role (donor/campaigner/admin),
isVerifiedCampaigner, location, organization, refreshToken

Campaign

title, campaignType, description, category, goalAmount, raisedAmount,
deadline, coverImage, status, urgencyLevel, location,
animalDetails, vetDetails, groupWelfareDetails, verificationDetails,
updates[], supportingDocuments[], expenses[], donations[]

Donation

donor (ref: User), campaign (ref: Campaign), amount, couponUsed, createdAt

CampaignerRequest

user (ref: User), organization, reason, documents[], status, reviewedBy

Notification

user (ref: User), message, type, read, createdAt

Coupon

code, discountPercent, maxUses, usedCount, expiresAt, isActive

🤝 Contributing

Fork the repository

Create your feature branch: git checkout -b feature/your-feature-name

Commit your changes: git commit -m "feat: add your feature"

Push to the branch: git push origin feature/your-feature-name

Open a Pull Request

📄 License

This project was built as part of ATP TEAM-9 academic coursework.

🗂️ Complete File & Folder Reference

A detailed explanation of every file and folder in this repository.

📁 Root Level — CrowdFunding-Platform/

File / Folder

Explanation

backend/

Contains the entire Node.js + Express REST API server

AniRescue-Frontend/

Contains the React + Vite frontend application

node_modules/

Root-level Node.js dependencies (shared dev tooling)

package.json

Root package config — may hold workspace or shared scripts

package-lock.json

Auto-generated lockfile for reproducible root installs

check_case.js

Utility script to detect filename casing mismatches (important for Linux/macOS deployments where the filesystem is case-sensitive)

README.md

Project documentation (this file)

.gitignore

Specifies files and folders Git should not track (e.g. node_modules, .env, dist)

.DS_Store

macOS system file — auto-generated by Finder, not needed in the project (can be gitignored)

📁 Backend — backend/

The Express.js REST API. Entry point is server.js.

Root Files

File

Explanation

server.js

Application entry point. Loads environment variables via dotenv, connects to MongoDB via connectDB(), then starts the Express HTTP server on PORT (default 5000)

app.js

Express app factory. Wires together all middleware (JSON parsing, cookies, CORS) and mounts all API route groups under /api. Also serves the built frontend in production mode

package.json

Backend dependencies and npm scripts (dev = nodemon, start = node)

package-lock.json

Lockfile ensuring consistent backend dependency versions across environments

test.http

HTTP request collection for manually testing API endpoints (compatible with VS Code REST Client extension)

.env

Secret configuration file. Stores MONGO_URI, JWT_SECRET, CLOUDINARY_*, CLIENT_URL, etc. Never committed to Git

backend/config/

Configuration modules for third-party services.

File

Explanation

db.js

Establishes and exports the MongoDB connection using mongoose.connect(). Called once at startup in server.js

cloudinary.js

Initializes and exports the Cloudinary SDK client using credentials from .env. Used by uploadToCloudinary.js

razorpay.js

Initializes the Razorpay SDK (legacy — payment gateway integration was later replaced with a direct donation flow)

backend/models/

Mongoose schemas that define the shape of documents stored in MongoDB.

File

Explanation

user.js

User schema. Fields: name, email, passwordHash, role (donor/campaigner/admin), isVerifiedCampaigner, location, organization, refreshToken. Includes a toJSON() override to strip sensitive fields

campaign.js

Campaign schema. The most complex model. Includes nested schemas for updates (before/during/after), supportingDocuments, expenses, and references to donations[]. Tracks raisedAmount, status, urgencyLevel, animalDetails, vetDetails, and groupWelfareDetails

donation.js

Donation schema. Records each donation with references to the donor (User) and campaign, the amount, and any couponUsed

campaignerRequest.js

Campaigner application schema. Stores a user's request to become a campaigner, including their organization, reason, supporting documents[], and status (pending/approved/rejected)

coupon.js

Coupon schema. Stores discount codes with discountPercent, maxUses, usedCount, expiresAt, and isActive flag

notification.js

Notification schema. Stores in-app alerts for users with a message, type, and read boolean

backend/controllers/

Business logic handlers. Each controller exports functions called by the route definitions.

File

Explanation

auth.controller.js

Handles register, login, logout, and refreshToken. Issues JWT access + refresh tokens stored in HTTP-only cookies

campaign.controller.js

Full CRUD for campaigns — create, list (with filters), get by ID, update, delete. Also handles posting timeline updates, uploading supportingDocuments, and updating expenses

donation.controller.js

Processes a donation: validates the campaign, applies any coupon, adds the amount to campaign.raisedAmount, creates a Donation document, and triggers a notification

admin.controller.js

Admin-only operations: list all users, approve/reject campaigner applications, approve/reject/complete campaigns, and fetch platform-wide analytics

campaigner.controller.js

Lets a donor submit a campaigner application and checks current application status

dashboard.controller.js

Aggregates and returns personalized stats — donation history and totals for donors; campaign performance for campaigners

coupon.controller.js

Lists coupons available to the current authenticated user

notification.controller.js

Fetches the current user's notifications and marks them as read

backend/routes/

Express Router files. Map HTTP method + URL path → controller function.

File

Explanation

auth.routes.js

POST /api/auth/register, /login, /logout, /refresh

campaign.routes.js

GET/POST /api/campaigns, GET/PATCH/DELETE /api/campaigns/:id, plus sub-routes for updates, documents, and expenses

donation.routes.js

POST /api/donations (make a donation), GET /api/donations/:campaignId (list donors)

admin.routes.js

Admin-gated routes for user management, campaigner approvals, and campaign moderation

campaigner.routes.js

POST /api/campaigner/apply, GET /api/campaigner/status

dashboard.routes.js

GET /api/users/me/dashboard (stats), GET /api/users/me/donations (history)

coupon.routes.js

GET /api/users/me/coupons

notification.routes.js

GET /api/notifications, PATCH /api/notifications/:id/read

backend/middleware/

Express middleware — functions that run between request and controller.

File

Explanation

auth.middleware.js

Verifies the JWT access token from the request cookie or Authorization header. Attaches req.user on success; returns 401 if missing or invalid

role.middleware.js

Role-based access guard. Takes an array of allowed roles (e.g. ["admin"]) and returns 403 Forbidden if req.user.role is not in the list

upload.middleware.js

Configures Multer for multipart/form-data file uploads. Sets file size limits and accepted MIME types

error.middleware.js

Global error handler (4-argument Express middleware). Formats all thrown errors into a consistent { message, stack } JSON response

backend/utils/

Pure helper functions shared across controllers.

File

Explanation

generateTokens.js

Creates and signs JWT access token (short-lived) and refresh token (long-lived) using secrets from .env

uploadToCloudinary.js

Accepts a file buffer or path, uploads it to Cloudinary, and returns the secure URL. Used by campaign image and document uploads

createNotification.js

Helper to create a Notification document in MongoDB for a given user, message, and type

assignCoupon.js

Business logic to assign a reward coupon to a user after a qualifying donation

mailer.js

Configures the Nodemailer transporter using SMTP credentials from .env

sendEmail.js

Sends a transactional email (e.g. campaign approved, donation received) using the mailer transporter

verifyRazorpaySignature.js

HMAC-based signature verification for Razorpay webhooks (legacy utility retained for reference)

backend/API/

Standalone API handler scripts (used for direct function-level testing or alternative invocation).

File

Explanation

Login.js

Self-contained login handler — validates credentials, compares bcrypt hash, and returns tokens

Register.js

Self-contained registration handler — validates input, hashes password, and creates a user

Logout.js

Clears the refresh token cookie to log the user out

RefreshToken.js

Validates the refresh token and issues a new access token

Profile.js

Returns the authenticated user's profile data

📁 Frontend — AniRescue-Frontend/

React 19 + Vite SPA. Entry point is src/main.jsx.

Root Files

File

Explanation

index.html

Vite HTML shell. Contains the <div id="root"> mount point and loads src/main.jsx as a module

vite.config.js

Vite build configuration — sets up @vitejs/plugin-react for JSX transform

tailwind.config.js

Tailwind CSS configuration — defines content paths, custom theme extensions (colors, fonts, etc.)

postcss.config.js

PostCSS config enabling Tailwind CSS and Autoprefixer plugins

eslint.config.js

ESLint flat config using eslint-plugin-react-hooks and eslint-plugin-react-refresh

package.json

Frontend dependencies and scripts (dev, build, preview, lint)

.env

Frontend environment variables — primarily VITE_API_URL pointing to the backend

src/ — Source Root

File

Explanation

main.jsx

App bootstrap. Creates the React root, wraps the app with BrowserRouter, QueryClientProvider (TanStack Query), and renders <Toaster> for global toast notifications

App.jsx

Top-level component. Renders <AppRoutes /> which handles all client-side routing

styles.css

Global CSS — base resets, custom CSS variables, and any global utility classes

src/api/

Axios-based API client modules. Each file groups calls to one backend resource.

File

Explanation

axios.js

Creates and exports a configured Axios instance with baseURL set to VITE_API_URL, withCredentials: true (for cookies), and a response interceptor that auto-refreshes the access token on 401 errors

authApi.js

Functions: login(), register(), logout(), refreshToken()

campaignApi.js

Functions: getCampaigns(), getCampaignById(), createCampaign(), updateCampaign(), postUpdate()

donationApi.js

Functions: makeDonation(), getCampaignDonors()

adminApi.js

Functions: getCampaignerRequests(), reviewRequest(), reviewCampaign(), getAllUsers()

campaignerApi.js

Functions: applyAsCampaigner(), getApplicationStatus()

dashboardApi.js

Functions: getDashboardStats(), getDonationHistory()

notificationApi.js

Functions: getNotifications(), markAsRead()

src/pages/

Full-page React components rendered by the router.

File

Explanation

Home.jsx

Landing page — hero section, featured campaigns, platform statistics, and call-to-action

Campaigns.jsx

Browse all approved campaigns with search and filter controls

CampaignDetail.jsx

Full detail view of a single campaign — header, donation panel, timeline, documents, recent donors

CreateCampaign.jsx

Campaign creation page — renders <CreateCampaignForm> for campaigners

DonorDashboard.jsx

Donor's personal dashboard — donation history, total donated, and notifications

CampaignerDashboard.jsx

Campaigner's dashboard — campaign analytics, fundraising progress, update management

AdminDashboard.jsx

Admin control panel — platform stats, pending approvals, user management

ApplyCampaigner.jsx

Multi-step form for donors to apply to become verified campaigners

Login.jsx

Login form with email/password inputs and JWT authentication flow

Register.jsx

User registration form with name, email, password, and role selection

Unauthorized.jsx

Displayed when a user tries to access a route they don't have permission for

NotFound.jsx

404 page shown for unmatched routes

src/components/

components/common/ — Reusable UI Primitives

File

Explanation

Button.jsx

Reusable button with variant props (primary, secondary, danger) and loading state

Input.jsx

Styled text input with label and error message support

Textarea.jsx

Multi-line text input with consistent styling

Select.jsx

Styled dropdown/select component

Modal.jsx

Accessible modal dialog with backdrop, close button, and Framer Motion entry animation

Badge.jsx

Small status pill — used for campaign status and urgency level labels

ProgressBar.jsx

Horizontal progress bar used to show fundraising completion percentage

CircularProgress.jsx

SVG-based circular progress indicator

EmptyState.jsx

Placeholder component shown when a list has no items

Skeleton.jsx

Loading skeleton placeholder for content that is still fetching

PageTransition.jsx

Wraps page content with a Framer Motion fade/slide animation on route change

components/campaign/ — Campaign-Specific UI

File

Explanation

CampaignCard.jsx

Card component showing campaign thumbnail, title, progress bar, and goal amount — used in the campaigns list

CampaignDetailHeader.jsx

Top section of the campaign detail page — title, category badge, urgency label, and cover image

CampaignFilters.jsx

Filter bar (category, urgency, search) for the campaigns listing page

CampaignerDetails.jsx

Shows the verified campaigner's name, organization, and location on the campaign detail page

DonationPanel.jsx

Sticky sidebar panel with amount input, coupon field, donate button, and animated success popup

MedicalDocuments.jsx

Displays uploaded vet reports and supporting documents with download links

RecentDonors.jsx

Shows the latest donors (avatar + name + amount) for a campaign

ShareCampaignButton.jsx

Button that copies the campaign URL to clipboard using the Web Share API

Timeline.jsx

Before/during/after visual timeline showing campaign progress updates with images

UrgentCampaignStrip.jsx

Horizontal scrolling strip of urgent campaigns shown on the home page

components/dashboard/ — Dashboard Widgets

File

Explanation

DashboardShell.jsx

Layout wrapper for all dashboard pages — provides the sidebar nav and main content area

StatCard.jsx

Summary card showing a single KPI (e.g. "Total Donated ₹5,000") with an icon and trend indicator

AnalyticsChart.jsx

Recharts line/bar chart wrapper showing donation trends over time

CampaignAnalytics.jsx

Detailed analytics panel for a specific campaign — raised vs goal, donor count, daily donations chart

DonationHistory.jsx

Table/list of a donor's past donations with campaign name, amount, and date

DonationsAndMessages.jsx

Combined panel showing recent donations and any donor messages on a campaign

NotificationPanel.jsx

In-app notification feed with unread badge and mark-as-read functionality

components/admin/ — Admin UI

File

Explanation

AdminTabs.jsx

Tab navigation bar for the admin dashboard (Campaigns / Campaigners / Users)

ApprovalTable.jsx

Table listing campaigns pending admin review with approve/reject action buttons

CampaignerApprovalTable.jsx

Table listing campaigner applications with applicant details and approve/reject controls

CampaignPreviewModal.jsx

Modal that shows a full campaign preview so the admin can review before approving or rejecting

UserTable.jsx

Table listing all registered platform users with their role and verification status

components/forms/ — Complex Form Components

File

Explanation

CreateCampaignForm.jsx

Large multi-section form for creating a new campaign — handles image upload, animal details, vet info, group welfare fields, and consent checkbox

EditCampaignModal.jsx

Modal form (pre-filled) for editing an existing campaign's details and images

MedicalDocumentUploadForm.jsx

Form for uploading vet reports or other supporting documents to a campaign

TimelineUpdateForm.jsx

Form to post a before/during/after update with text and optional image to a campaign's timeline

TransparencyExpenseForm.jsx

Form for campaigners to declare how funds will be spent (expense label + percentage breakdown)

src/hooks/

Custom React hooks that encapsulate reusable stateful logic.

File

Explanation

useAuth.js

Custom hook wrapping auth API calls and Zustand auth store — provides login(), logout(), register(), and user state to any component

useNotifications.js

Fetches and manages the current user's notifications; exposes markAsRead() and unread count

useShareCampaign.js

Hook that wraps the Web Share API / clipboard copy for sharing a campaign URL

useRazorpay.js

Legacy hook for Razorpay payment initiation (retained for reference; replaced by direct donation flow)

src/store/

Zustand global state stores.

File

Explanation

authStore.js

Zustand slice storing the authenticated user object and setUser() / clearUser() actions. Consumed by useAuth.js and route guards

src/routes/

Route definitions and access-control wrappers.

File

Explanation

AppRoutes.jsx

Central route map — defines all <Route> paths and maps them to page components, wrapped in the appropriate layout and guards

ProtectedRoute.jsx

HOC that checks if a user is logged in; redirects to /login if not authenticated

RoleRoute.jsx

HOC that checks user.role against an allowed list; redirects to /unauthorized if the role is not permitted

src/layouts/

Page layout wrapper components.

File

Explanation

MainLayout.jsx

The main app shell — renders the top navigation bar, footer, and <Outlet> for page content. Used by all public-facing pages

DashboardLayout.jsx

Dashboard-specific shell — renders the dashboard sidebar navigation and <Outlet> for dashboard page content

src/animations/

File

Explanation

motionVariants.js

Exports named Framer Motion animation variant objects (fadeIn, slideUp, stagger, etc.) reused across multiple components for consistent animations

src/utils/

Pure frontend helper functions.

File

Explanation

formatCurrency.js

Formats a number as Indian Rupees (e.g. 5000 → ₹5,000) using Intl.NumberFormat

formatDate.js

Formats a date string or timestamp into a human-readable format (e.g. "Jun 8, 2026")

getDaysLeft.js

Calculates the number of days remaining until a campaign's deadline

calculateProgress.js

Computes fundraising progress as a percentage: (raisedAmount / goalAmount) * 100

getInitials.js

Extracts initials from a user's name (e.g. "John Doe" → "JD") for avatar placeholders

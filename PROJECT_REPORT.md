# EliteHub — Complete Project Handover & Analysis Report
*Generated up to Phase I (Upload Polish)*

This document is a comprehensive summary of the **EliteHub** platform. It covers the complete frontend, backend, database structure, and integration details. You can provide this document to any AI agent to get them instantly up to speed on the entire codebase.

---

## 1. Core Architecture & Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (for animations)
- **Database:** Neon (Serverless Postgres)
- **ORM:** Prisma
- **Authentication:** Clerk (Strictly Clerk. NextAuth/Auth.js has been completely removed to avoid conflicts and maintain a single source of truth).
- **Payments:** Razorpay (Handles both one-off post unlocks and recurring monthly subscriptions).
- **Storage:** Cloudflare R2 (S3-compatible, used for secure media storage).

---

## 2. Database Structure (Prisma Schema)
The database has been normalized and heavily relational to support the platform's features.

- **`User`**: Core user model. Contains fields like `clerkId`, `role` ("Fan" or "Creator"), `handle`, `tickTier` (verification tiers: none, blue, gold), `subscriptionPrice`, and `razorpayPlanId`.
- **`Post`**: Represents content. Can be `photo` or `video`. Has a `visibility` field ("public" or "private") and a `price`. Media is stored via `mediaKey` pointing to R2.
- **`Subscription`**: Tracks active fan-to-creator monthly subscriptions. Links a `fanId` to a `creatorId`.
- **`Follow`**: Tracks free followers.
- **`Purchase`**: Tracks one-off product purchases (e.g., unlocking a private post).
- **`SubscriptionPayment`**: Tracks recurring revenue generated from active subscriptions (logged via Razorpay webhooks).
- **`Payout`**: Tracks manual payout requests made by creators to withdraw their earnings.
- **`Report`**: Moderation system allowing users to report posts.
- **`Notification`**: In-app notification system to alert users of new followers, purchases, or platform messages.

---

## 3. Backend (API Routes)
All APIs are strictly located in `src/app/api/`. 

- **Auth (`/api/auth/...`)**: Handled by Clerk middleware. We use a helper `src/lib/auth.ts -> getDbUser()` to seamlessly sync the Clerk user with the Neon DB on the fly.
- **Dashboard (`/api/dashboard`)**: Aggregates creator metrics. It successfully merges `Purchase` (one-off) and `SubscriptionPayment` (recurring) to output 100% accurate Total Earnings, Available Balance, Weekly Growth, 30-day charts, and a recent transactions ledger.
- **Checkout (`/api/checkout`)**: Interfaces with Razorpay. Creates Razorpay Orders for one-off post unlocks, and Razorpay Subscriptions (and dynamically creates Plans if they don't exist) for recurring creator subscriptions.
- **Webhooks (`/api/webhooks/razorpay`)**: Securely validates Razorpay signatures using HMAC SHA256. Listens to `payment.captured` for post unlocks and `subscription.charged` for logging recurring `SubscriptionPayment` rows. Also dispatches in-app notifications to creators upon successful payments.
- **Upload (`/api/upload`)**: Generates secure, short-lived AWS S3 Presigned URLs for direct-to-R2 uploads.
- **Media Serving (`/api/media/[postId]`)**: A secure proxy route that validates if a user actually owns a private post before returning the raw media URL from R2, preventing link sharing.
- **Admin (`/api/admin`)**: Role-gated APIs (protected by `process.env.ADMIN_CLERK_IDS`). Allows admins to view metrics, ban users, and delete reported posts.
- **Settings (`/api/settings/delete-account`)**: Handles GDPR/compliance account deletion by soft-deleting and anonymizing user data.

---

## 4. Frontend & User Interface
The UI is mobile-first, heavily utilizing dark mode (Glassmorphism, dark surfaces, yellow/gold accents) and Framer Motion for micro-animations.

- **Feed / Explore (`src/app/page.tsx` & `explore/page.tsx`)**: 
  - Dynamic ranking algorithm (`src/lib/ranking.ts`) surfaces trending content by scoring creators based on followers + purchases, mixed with a recency decay bonus.
  - Timestamps are formatted cleanly using a custom `timeAgo` utility.
- **Profile & Shop (`src/components/ProfileClient.tsx`)**:
  - Displays creator info. Includes a "Shop" tab that filters a creator's posts to show only items available for purchase.
  - Users can purchase items directly, or download items they already own.
- **Create Post (`src/app/create/page.tsx`)**:
  - Extremely polished upload flow. 
  - **Image Cropping:** Integrates `react-easy-crop` to force 4:5 aspect ratios before upload.
  - **Progress Bar:** Bypasses `fetch` in favor of `XMLHttpRequest` to provide real-time, 0-100% upload progress bars straight to Cloudflare R2.
- **Dashboard (`src/app/dashboard/page.tsx`)**:
  - Comprehensive analytics for creators.
  - The ledger accurately distinguishes between "Post Unlock" and "Subscription" earnings.
- **Settings & Purchases (`src/app/settings` & `/purchases`)**:
  - Fully functional SSR-compatible theme toggling.
  - A dedicated "My Purchases" page where fans can view and download content they've bought.
- **Admin Panel (`src/app/admin`)**:
  - Restricted to specific Clerk IDs.
  - Moderation queue for handling reports, banning users, and tracking global platform revenue.

---

## 5. Critical Context & Rules Enforced
- **India-First Compliance:** The platform strictly integrates Razorpay (INR).
- **No Web3/Crypto:** Zero crypto, tokens, or wallet connections exist in this codebase. It is a traditional fiat subscription model.
- **Strict DB Queries:** Aggregations and counts are fetched dynamically from the DB (no fake data or mock strings exist in the production components).
- **Environment Variables:** Rely heavily on Clerk keys, Neon connection strings, Cloudflare R2 credentials, and Razorpay API keys.

---

## 6. Current Phase Status
The project has successfully completed everything from **Phase 0 through Phase I**.
**We are currently waiting to begin Phase J (Final Polish + Testing).** 

If handed to a new AI agent, the agent should read `.ai-brain.md` and this document, then immediately prompt the user to start **Phase J**.

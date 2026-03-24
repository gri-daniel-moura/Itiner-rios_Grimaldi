# Rota Express: PDF Transport Itinerary Viewer

A complete, production-ready web application for HR to manage and share transport itinerary PDFs with employees. Built with mobile-first principles to ensure employees can easily check bus routes without needing to log in.

## Architecture
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Database:** [Neon Serverless Postgres](https://neon.tech/) using [Drizzle ORM](https://orm.drizzle.team/)
- **Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **PDF Viewer:** [react-pdf](https://projects.wojtekmaj.pl/react-pdf/)
- **Auth:** Custom edge-compatible JWT auth using `jose`

## Features
- **Public Employee Views (No Login)**
  - Location selector cards
  - List of active PDFs per location
  - Mobile-optimized PDF viewer with Zoom and Pan
  - Direct download links
- **HR Admin Panel (`/admin`)**
  - Secure credential login with HTTP-only cookies
  - Dashboard analytics
  - CRUD for Company Locations
  - Active/Inactive toggling for PDFs
  - Direct-to-Vercel-Blob client uploader bypassing standard Next.js 4.5mb limits

---

## Local Development Setup

### 1. Requirements
Ensure you have Node.js 18+ and `npm` installed.

### 2. Environment Variables
Copy the example environment file and fill in the values:
```bash
cp .env.example .env.local
```

You will need to procure the following values:
- `DATABASE_URL`: Create a free project on [Neon](https://neon.tech/) and copy the connection string.
- `BLOB_READ_WRITE_TOKEN`: Create a [Vercel Blob store](https://vercel.com/dashboard/stores) and copy the read/write token.
- `JWT_SECRET`: Any random 32-character secure string.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Your desired credentials for the MVP.

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Once your `DATABASE_URL` is set, run the Drizzle migrations to generate the tables:
```bash
npx drizzle-kit push
```
*(Alternatively, you can run the SQL generated in `/migrations` directly against your DB).*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the HR Portal.

---

## Production Deployment to Vercel

This app is heavily optimized for Vercel.

1. Push your code to a GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
5. Click **Deploy**.

Because we configured `pdfjs.GlobalWorkerOptions.workerSrc` to an external CDN, you don't need configuring custom webpack rules to bundle the web workers.

---

## Upgrading Auth for Production (SSO/OAuth)

The current MVP uses clear-text credentials mapped in `.env`. For a robust corporate setup, you should migrate to **NextAuth.js (Auth.js)** or **Clerk**.

**With NextAuth.js:**
1. Install `npm install next-auth`.
2. Delete `/api/admin/auth/route.ts` and `lib/auth.ts`.
3. Create `app/api/auth/[...nextauth]/route.ts` and configure providers (e.g., Azure AD for Microsoft 365, Google Workspace, Okta).
4. In `middleware.ts`, replace the custom JWT check with `export { default } from "next-auth/middleware"`.

## Swapping Storage Providers

Currently, files are sent directly to Vercel Blob to avoid serverless payload limits. If you must use AWS S3 or Azure Blob Storage:
1. Replace `@vercel/blob` implementations in `app/admin/upload/page.tsx` with an implementation utilizing `aws-sdk-s3` presigned URLs.
2. In `app/api/upload/route.ts`, generate and return the AWS S3 `createPresignedPost` details instead of the Vercel Blob token.
3. Once the React client finishes pushing to the AWS URL, call `app/api/pdfs` exactly as currently implemented.

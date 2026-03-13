# Cal.com Clone

A full-stack scheduling platform built with React, Vite, Node.js, Express, and PostgreSQL.

## Features
- Event Types Management
- Availability Settings
- Bookings Dashboard
- Public Booking Page
- Smart Time Slot Generation
- TailwindCSS beautifully styled UI

## Tech Stack
- **Frontend**: React.js, Vite, TailwindCSS, Axios, React Router, Zustand
- **Backend**: Node.js, Express.js, PostgreSQL, Prisma ORM, cors, date-fns

## Prerequisites
- Node.js installed
- PostgreSQL installed and running on your system

## Setup Instructions

### 1. Database Setup
Create a PostgreSQL database named `calclone` (or edit the `DATABASE_URL` in `backend/.env` to point to a valid db).
Ensure the URL inside `backend/.env` matches your postgres credentials.

### 2. Backend Setup
Navigate to the backend directory:
\`\`\`bash
cd cal-clone/backend
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
\`\`\`
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the frontend directory:
\`\`\`bash
cd cal-clone/frontend
npm install
npm run dev
\`\`\`
The frontend will run on `http://localhost:5173`.

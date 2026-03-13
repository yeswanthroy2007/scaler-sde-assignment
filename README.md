CalClone - Modern Scheduling Platform
CalClone is a full-stack scheduling application inspired by Cal.com. it allows users to manage their weekly availability, 
set specific date overrides, and provide a public booking page for others to schedule meetings. 
The platform handles complex timezone logic, custom booking questions, and automated email notifications.

Key Features

Availability Management:
Weekly Schedule: Set your standard hours for every day of the week (e.g., Mon-Fri, 9:00 AM - 5:00 PM).
Date Overrides: Perfect for vacations or one-off schedule changes. Block entire days or set custom hours for a specific calendar date.
Smart Time Filtering: The booking page automatically hides time slots that have already passed for the current day based on the visitor's local time.

Event Configuration:
Custom Event Types: Create different meeting types (15 min, 30 min, 60 min) with unique descriptions and durations.
Buffers: Add "Buffer Before" and "Buffer After" times to ensure you have a break between back-to-back meetings.
Custom Questions: Gather specific information from bookers (Company name, Website, etc.) using dynamic form fields.

Pro Booking Experience:
Public Booking Page: Clean, professional interface for users to select dates and times.
Instant Confirmation: Automated email notifications sent via SendGrid to both the organizer and the booker.
Floating Time Standard: Ensures that "9:00 AM" in the database is "9:00 AM" everywhere, preventing timezone shift confusion.

Tech Stack:
Frontend: React.js, Vite, Tailwind CSS (Styling), Lucide-React (Icons), Date-fns (Date logic).
Backend: Node.js, Express.js.
Database: PostgreSQL with Prisma ORM.
Cloud Database: Neon.tech (Serverless PostgreSQL).
Hosting: Vercel (Frontend & Backend).
Email Service: SendGrid API.

Project Structure:
```
cal-clone/
├── frontend/                # React Vite Application
│   ├── src/
│   │   ├── pages/           # Dashboard, Forms, and Public Booking pages
│   │   ├── services/        # API integration (Axios)
│   │   └── components/      # Reusable UI elements
│   └── vercel.json          # Frontend routing configuration
└── backend/                 # Express Server
    ├── prisma/              # Database Schema & Seed scripts
    ├── src/
    │   ├── controllers/     # Business logic for Bookings, Availability, etc.
    │   ├── services/        # Slot generation algorithms & Email services
    │   └── routes/          # API Endpoint definitions
    └── vercel.json          # Serverless deployment configuration
```

Installation & Setup:
1. Prerequisites
Node.js installed.
A PostgreSQL database (Local or Neon.tech).
SendGrid Account (for emails).
2. Backend Setup
bash
cd backend
npm install
Create a 
.env
 file in the backend folder:
env
DATABASE_URL="your_postgresql_connection_string"
SENDGRID_API_KEY="your_sendgrid_key"
EMAIL_FROM="your_verified_sender_email"
Sync database and start:
bash
npx prisma db push
npm run db:seed
npm run dev
3. Frontend Setup
bash
cd frontend
npm install
npm run dev

API Endpoints:
```
GET /api/events - Fetch all event types.
GET /api/availability - Get weekly schedule.
POST /api/date-overrides - Create/Update specific date exceptions.
GET /api/bookings/slots?date={date}&eventTypeId={id} - Get available time slots for a specific day.
```
Project Links:
GitHub Link: https://github.com/yeswanthroy2007/scaler-sde-assignment
Deployed Frontend: https://cal-clone-peach.vercel.app/
Deployed Backend: https://cal-clone-backend.vercel.app/

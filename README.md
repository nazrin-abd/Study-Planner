# Study Planner

I built this app to help students (including myself) stay on top of their academic life without juggling 5 different tools. Everything is in one place — your schedule, homework, notes, and even email reminders when deadlines are coming up.

Live: https://studyplanner-self-one.vercel.app/

---

## What you can do

- Add your weekly class schedule and see it laid out by day
- Keep track of homework and to-dos with deadlines
- Log study sessions to see how much time you're actually putting in
- Write notes and keep them saved
- See your overall progress — how many tasks done, how many hours studied
- Set reminders and get an email at the exact time you set

---

## How I built it

The app is built with Next.js for both the frontend and backend (API routes). User data is stored in a MySQL database hosted on Railway. Authentication uses JWT tokens stored in HTTP-only cookies, and passwords are hashed with bcryptjs. Email reminders are sent through Gmail using Nodemailer, with a cron job checking every minute for due reminders. The whole thing is deployed on Vercel.

---

## Running it locally

You'll need Node.js and a MySQL database. I used Railway for the database but anything works.

```bash
git clone https://github.com/nazrin-abd/Study-Planner.git
cd Study-Planner
npm install
```

Create a `.env.local` file:
```
JWT_SECRET=something_secret

MYSQLHOST=your_host
MYSQLPORT=your_port
MYSQLUSER=your_user
MYSQLPASSWORD=your_password
MYSQLDATABASE=railway

GMAIL_USER=your@gmail.com
GMAIL_PASS=your_app_password
```

Then run the SQL to create the tables (users, schedule, todos, study_sessions, notes, reminders) and start the dev server:

```bash
npm run dev
```

---

## Notes

This was a personal project so some things are still rough around the edges. Feel free to fork it and make it your own.

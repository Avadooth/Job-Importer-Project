# 🚀 Job Importer System

A scalable backend and admin panel that fetches jobs from XML-based APIs, processes them via background queues (BullMQ + Redis), stores them in MongoDB, and logs import history for transparency.

---

## 📌 Features

- Fetches jobs from multiple RSS/XML feeds
- Converts XML to JSON using fast-xml-parser
- Queues jobs for background processing with Redis + BullMQ
- Uses workers to upsert jobs into MongoDB (insert or update)
- Logs every import run with counts of new, updated, and failed jobs
- Runs every hour using `node-cron`
- Simple admin panel built in React/Next.js to view import logs

---

## 🔧 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React (Vite or Next.js) |
| Backend     | Node.js (Express) |
| Database    | MongoDB (Mongoose) |
| Queue       | BullMQ            |
| Queue Store | Redis (Cloud)     |
| Hosting     | Render.com        |
| Scheduler   | node-cron         |

---

## 📁 Project Structure

```
job-importer-project/
├── client/                 # Admin UI (React)
│   ├── src/
│   │   ├── pages/          # ImportHistory UI
│   │   ├── services/       # Axios logic
│   │   └── components/     # Reusable UI parts
│   └── public/
├── server/                 # Backend
│   ├── models/             # Mongoose schemas
│   ├── services/           # Job fetching, DB helpers
│   ├── queues/             # BullMQ setup
│   ├── jobs/               # Worker logic
│   ├── config/             # Redis, Mongo setup
│   ├── routes/             # Express APIs
│   └── cron.js             # Scheduler
├── docs/
│   └── architecture.md     # System Design
├── .env
├── README.md
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/Avadooth/job-importer-project.git
cd job-importer-project
```

### 2. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```


### 3. Run in Dev

Terminal 1 (Backend):

```bash
cd server
node index.js
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
```

---

## 🚀 Deployment (Render.com)

### Backend

- Create new Web Service
- Root directory: `server`
- Build command: `npm install`
- Start command: `node index.js`

### Frontend

- Create Static Site
- Root directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`

---

## 📊 Admin Panel (Frontend)

Route: `/import-history`

### Columns:

| Field      | Description                          |
|------------|--------------------------------------|
| Timestamp  | Time when import was triggered       |
| File Name  | Feed URL used                        |
| Total Jobs | Total jobs fetched from feed         |
| New        | Jobs newly inserted                  |
| Updated    | Jobs already in DB, now updated      |
| Failed     | Jobs that failed due to errors       |

---

## 📎 Assumptions

- Each feed returns valid XML.
- Jobs have a unique `guid` or `link`.
- Cron runs every hour, not manually triggered.
- Admin panel is internal (no authentication added).
- Redis Cloud and MongoDB Atlas are used in prod.

---

## 💡 Optional Enhancements

- Add Socket.IO for live updates on import history
- Retry logic using BullMQ’s exponential backoff
- Use `BATCH_SIZE` and `CONCURRENCY` as `.env` vars
- Dockerize both frontend and backend for production
- Add basic authentication to admin panel

---

## 📚 References

- [BullMQ Docs](https://docs.bullmq.io/)
- [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)
- [Render Deployment Docs](https://render.com/docs)

---

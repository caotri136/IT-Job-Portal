# 🧑‍💻 IT Job Portal

A full-stack IT job portal web application inspired by ITviec and VietnamWorks, built with NestJS and ReactJS. The platform supports two roles — **Candidate** and **Employer** — with features including job posting, resume management, CV upload, and a skill-based job matching algorithm.

---

## 🚀 Tech Stack

### Backend
- **NestJS** — RESTful API with multilayer architecture
- **PostgreSQL** — Relational database
- **TypeORM** — ORM with schema synchronization and database indexing
- **JWT** — Access/Refresh Token authentication
- **Bcrypt** — Password hashing
- **Nodemailer** — Email OTP verification
- **Cloudinary** — PDF CV upload and storage
- **Swagger/OpenAPI** — API documentation
- **Docker & Docker Compose** — Containerization

### Frontend
- **ReactJS + TypeScript** — UI framework
- **Vite** — Build tool
- **CSS Modules** — Component-scoped styling
- **Axios** — HTTP client with JWT interceptor

---

## ✨ Features

### Authentication
- Register with Email OTP verification
- Login with JWT Access Token (1h) + Refresh Token (7d)
- Forgot password via Email OTP + Reset Token (5m)
- Auto-logout on token expiry

### Candidate
- Create and manage multiple resumes with PDF CV upload (Cloudinary)
- Attach skills to each resume
- Apply to job posts with a specific resume
- View application status (Pending / Accepted / Rejected)
- **Skill-based job matching** — find jobs ranked by skill overlap with resume

### Employer
- Create a company or join an existing one
- Post, update, and delete job posts
- Attach required skills to each job post
- Review, accept, or reject candidate applications

### Job Discovery
- Filter job posts by level, role, job type, job scope, salary range, category
- Pagination support
- Hierarchical job categories (parent/child)

---

## 🗄️ Database Design

11 entities with normalized relational schema:
```
User ──ISA──► Candidate ──► Resume ──► ResumeSkill ──► Skill
         └──► Employer  ──► Company
                        └──► JobPost ──► JobSkill ──► Skill
                                    └──► JobCategory
Candidate + JobPost ──► Application
```

---

## 📁 Project Structure
```
backend/
├── src/
│   ├── auth/           # JWT auth, OTP, refresh token
│   ├── user/           # User entity and service
│   ├── candidate/      # Candidate profile
│   ├── employer/       # Employer profile
│   ├── company/        # Company management
│   ├── jobPost/        # Job post CRUD + filter + matching
│   ├── resume/         # Resume CRUD + Cloudinary upload
│   ├── application/    # Apply, accept, reject
│   ├── skill/          # Skill master data + seeding
│   ├── job_category/   # Hierarchical categories + seeding
│   ├── job_skill/      # Job ↔ Skill junction
│   ├── resume_skill/   # Resume ↔ Skill junction
│   ├── cloudinary/     # Cloudinary service
│   └── seed/           # Seed data for development
├── test/               # E2E tests (Jest + Supertest)
├── Dockerfile
└── docker-compose.yml

frontend/
├── src/
│   ├── pages/          # Login, Register, Verify, Homepage, ...
│   ├── api/            # Axios instance with JWT interceptor
│   └── components/
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Docker (optional)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/it-job-portal.git
cd it-job-portal
```

### 2. Setup environment variables

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=itjobportal

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_RESET_SECRET=your_reset_secret

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run with Docker
```bash
cd backend
docker-compose up --build
```

### 4. Run manually
```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### 5. Seed development data

Data is seeded automatically on first startup via `onApplicationBootstrap`:
- **Skills** (~160 skills across 13 categories)
- **Job Categories** (~75 categories with parent/child hierarchy)
- **Sample users, companies, job posts, resumes** (via SeedService)

To clear seed data:
```bash
npm run seed:clear
```

---

## 📖 API Documentation

Swagger UI available at:
```
http://localhost:3000/api
```

Key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register + send OTP |
| POST | `/auth/verify` | Verify OTP |
| POST | `/auth/login` | Login → JWT tokens |
| POST | `/company` | Create company → become Employer |
| POST | `/employer/join/:companyId` | Join existing company |
| GET | `/job-post` | Get all jobs with filter + pagination |
| GET | `/job-post/match/:resumeId` | Match jobs by skill overlap |
| POST | `/resume` | Create resume + upload PDF CV |
| POST | `/application/:jobPostId` | Apply to a job |

---

## 🧪 Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

E2E tests cover: Auth, Company, Employer, JobCategory, Skill, JobPost, Resume, Application — 38 test cases total.

---

## 🔍 Skill-Based Job Matching

The matching algorithm finds jobs ranked by skill overlap with a candidate's resume:
```sql
SELECT jp.*, COUNT(js.skillId) as matchCount
FROM job_post jp
JOIN job_skill js ON jp.id = js.jobId
WHERE js.skillId IN (
  SELECT skillId FROM resume_skill WHERE resumeId = :resumeId
)
GROUP BY jp.id
ORDER BY matchCount DESC
```

A resume with skills `[NestJS, PostgreSQL, Docker]` will rank a job requiring `[NestJS, PostgreSQL, Redis, Docker]` higher than one requiring `[React, TypeScript]`.

---

## 📄 License

MIT

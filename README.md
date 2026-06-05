# 🎓 IntelliCampus – AI-Powered Academic Management System

> An enterprise-grade, full-stack Academic Management System built for top-tier engineering colleges. Powered by a **Graph RAG AI chatbot**, real-time analytics, and seamless academic workflows — serving Students and Staff portals exclusively.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://docker.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Neo4j](https://img.shields.io/badge/Neo4j-Graph_DB-008CC1?logo=neo4j&logoColor=white)](https://neo4j.com/)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Portals](#portals)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Frontend Setup](#frontend-setup)
6. [Backend Setup](#backend-setup)
7. [AI Chatbot Architecture](#ai-chatbot-architecture)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Deployment](#deployment)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [Security](#security)

---

## 🌟 Overview

IntelliCampus is a centralized, responsive academic platform that replaces fragmented institutional tools with one unified system. Built for scale, it handles:

- **4,200+ students** and **180+ faculty members**
- Real-time attendance and marks tracking
- AI-powered Graph RAG chatbot for context-aware academic queries
- Role-based dashboards with zero-configuration UX
- End-to-end automation of academic workflows

---

## 🏛 Portals

### 👨‍🎓 Student Portal
| Module | Description |
|---|---|
| **Dashboard** | CGPA trend, attendance summary, deadlines, timetable |
| **Attendance** | Subject-wise tracking, leave & OD requests, shortage alerts |
| **Marks & Results** | CT1/CT2, assignments, practicals, CGPA/SGPA calculator |
| **Assignments & Notes** | View, submit, download — with deadline tracking |
| **Analytics** | Rank, performance charts, comparative insights |
| **Timetable** | Weekly class schedule with room info |
| **Inbox** | Circulars, exam notifications, placement updates |
| **Hall Ticket** | Eligibility check, fee status, hall ticket download |
| **Internships** | Browse openings, apply, track, upload reports |
| **GoCode** | Coding practice (Beginner → Competitive), QoD, leaderboard |
| **Reports** | Download attendance/marks/academic PDFs |
| **Profile** | Personal details, document verification |
| **AI Chatbot** | Graph RAG academic assistant |

### 👩‍🏫 Staff Portal
| Module | Description |
|---|---|
| **Dashboard** | Class overview, pending tasks, attendance analytics |
| **Attendance** | Mark/edit attendance, elective & counseling attendance |
| **Marks Entry** | CT, assignment, practical, retest marks entry |
| **Assignments** | Upload notes/tasks, grade submissions |
| **Announcements** | Publish circulars with audience targeting |
| **Leave & OD** | Approve/reject student leave, apply own leave to HOD |
| **Reports** | Attendance, marks, CGPA/PGPA, arrear reports |
| **Office Module** | Issue/collect student disciplinary IDs |
| **AI Chatbot** | Graph RAG academic assistant |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXPERIENCE LAYER (Frontend)                   │
│   React.js · Vite · Tailwind CSS · Recharts · React Router      │
│         Student Portal          Staff Portal                     │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS / REST API / WebSocket
┌───────────────────────▼─────────────────────────────────────────┐
│               API & ORCHESTRATION LAYER                          │
│         FastAPI · Uvicorn + Gunicorn · JWT / OAuth2              │
│              Rate Limiting · API Gateway · CORS                  │
└──────┬─────────────────────────┬────────────────────────────────┘
       │                         │
┌──────▼──────────┐   ┌──────────▼──────────────────────────────┐
│  INTELLIGENCE   │   │       CORE PLATFORM LAYER               │
│  LAYER (AI)     │   │  FastAPI · Celery · Redis/RabbitMQ      │
│                 │   │                                          │
│ • LLM (OpenAI / │   │  Academic Workflows:                     │
│   LLaMA/Mistral)│   │  • Attendance Automation                 │
│ • Sentence       │   │  • Marks Processing                     │
│   Transformers  │   │  • Report Generation                     │
│   (MiniLM)      │   │  • Notification Dispatch                 │
│ • FAISS/Pinecone│   │  • Assignment Lifecycle                  │
│ • Neo4j Graph DB│   │  • Leave Workflow                        │
└──────┬──────────┘   └──────────┬───────────────────────────────┘
       │                         │
┌──────▼─────────────────────────▼───────────────────────────────┐
│                       DATA LAYER                                 │
│  PostgreSQL (primary) · Redis (cache) · AWS S3 (files)          │
│  Elasticsearch (search) · Neo4j (knowledge graph)               │
└─────────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                            │
│  AWS/Azure/GCP · Docker · Kubernetes · GitHub Actions CI/CD     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### 1. Experience Layer — Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.3 | UI framework |
| **Vite** | 6.3 | Build tool & dev server |
| **Tailwind CSS** | 4.1 | Utility-first styling |
| **React Router** | 7.13 | Client-side routing |
| **Recharts** | 2.15 | Analytics & charts |
| **Lucide React** | 0.487 | Icon library |
| **Radix UI** | Latest | Accessible UI primitives |
| **Motion** | 12.x | Animations |

### 2. Intelligence Layer — AI Chatbot
| Technology | Purpose |
|---|---|
| **OpenAI GPT-4 / LLaMA 3 / Mistral** | LLM for response generation |
| **Sentence Transformers (MiniLM)** | Semantic embeddings |
| **FAISS / Pinecone** | Vector similarity search |
| **Neo4j** | Knowledge graph for academic entities |
| **LangChain** | RAG pipeline orchestration |

### 3. Core Platform Layer — Backend
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.111 | REST API framework |
| **Python** | 3.12 | Primary language |
| **Celery** | 5.x | Async task queue |
| **Redis** | 7.x | Message broker + cache |
| **RabbitMQ** | 3.x | Alternative message broker |
| **Pydantic** | 2.x | Data validation |

### 4. API & Orchestration Layer
| Technology | Purpose |
|---|---|
| **FastAPI** | API framework |
| **Uvicorn + Gunicorn** | ASGI server |
| **JWT / OAuth2** | Authentication & authorization |
| **python-jose** | JWT token handling |
| **Passlib** | Password hashing (bcrypt) |

### 5. Data Layer
| Technology | Purpose |
|---|---|
| **PostgreSQL 16** | Primary relational database |
| **SQLAlchemy** | ORM |
| **Alembic** | Database migrations |
| **Redis** | Session cache, rate limiting |
| **AWS S3 / Firebase Storage** | File & document storage |
| **Elasticsearch** | Full-text search (optional) |

### 6. Infrastructure Layer
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Kubernetes (K8s)** | Container orchestration |
| **AWS / Azure / GCP** | Cloud hosting |
| **GitHub Actions** | CI/CD pipeline |
| **Nginx** | Reverse proxy |
| **Prometheus + Grafana** | Monitoring & alerting |

---

## 🚀 Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-org/intellicampus.git
cd intellicampus

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

### Environment Variables (Frontend)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=IntelliCampus
```

---

## ⚙️ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker (separate terminal)
celery -A app.celery_app worker --loglevel=info

# Start Celery Beat scheduler (separate terminal)
celery -A app.celery_app beat --loglevel=info
```

### Environment Variables (Backend)
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/intellicampus
REDIS_URL=redis://localhost:6379/0

# Authentication
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI / LLM
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENV=us-east1-gcp
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=intellicampus-files
AWS_REGION=ap-south-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@college.edu
SMTP_PASSWORD=...
```

---

## 🤖 AI Chatbot Architecture

IntelliCampus implements a **Graph RAG (Retrieval-Augmented Generation)** chatbot that retrieves context from both a vector store and a knowledge graph before generating responses.

```
User Query
    │
    ▼
┌─────────────────────────────┐
│   Query Preprocessing        │
│   • Intent Classification    │
│   • Entity Extraction        │
│   • Role Context Injection   │
└────────────┬────────────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌─────────┐    ┌──────────────┐
│ Vector  │    │  Neo4j Graph │
│ Search  │    │   Query      │
│ (FAISS/ │    │              │
│Pinecone)│    │ Entities:    │
│         │    │ • Students   │
│ Embed   │    │ • Courses    │
│ with    │    │ • Faculty    │
│ MiniLM  │    │ • Schedules  │
└────┬────┘    └──────┬───────┘
     │                │
     └───────┬────────┘
             │ Retrieved Context
             ▼
┌─────────────────────────────┐
│   LLM (GPT-4 / LLaMA /     │
│   Mistral)                  │
│                             │
│   System Prompt:            │
│   "You are an academic      │
│   assistant. Answer only    │
│   academic queries..."      │
└────────────┬────────────────┘
             │
             ▼
        Response to User
```

### Supported Queries
- `"What is my attendance percentage?"`
- `"Show my internal marks."`
- `"When is the next exam?"`
- `"Am I eligible for exams?"`
- `"Any new announcements?"`
- `"What is the assignment deadline?"`
- `"Show my timetable."`
- `"What are the holidays this month?"`

### Rejection Rule
Irrelevant queries receive: *"This query is irrelevant to academic activities. Please ask an academic-related question."*

---

## 🗄 Database Schema

### Core Tables
```sql
-- Users
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL,          -- 'student' | 'staff'
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE students (
    id              UUID PRIMARY KEY REFERENCES users(id),
    roll_no         VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    department_id   UUID REFERENCES departments(id),
    year            SMALLINT NOT NULL,
    section         VARCHAR(5),
    batch_year      SMALLINT NOT NULL
);

-- Staff
CREATE TABLE staff (
    id              UUID PRIMARY KEY REFERENCES users(id),
    employee_id     VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    department_id   UUID REFERENCES departments(id),
    designation     VARCHAR(100)
);

-- Departments
CREATE TABLE departments (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code    VARCHAR(10) UNIQUE NOT NULL,
    name    VARCHAR(100) NOT NULL
);

-- Courses
CREATE TABLE courses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    department_id   UUID REFERENCES departments(id),
    credits         SMALLINT DEFAULT 4,
    type            VARCHAR(20)   -- 'theory' | 'lab' | 'elective'
);

-- Attendance
CREATE TABLE attendance (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID REFERENCES students(id),
    course_id   UUID REFERENCES courses(id),
    date        DATE NOT NULL,
    status      VARCHAR(10) NOT NULL,   -- 'present' | 'absent' | 'od' | 'leave'
    marked_by   UUID REFERENCES staff(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Marks
CREATE TABLE marks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID REFERENCES students(id),
    course_id   UUID REFERENCES courses(id),
    exam_type   VARCHAR(20) NOT NULL,  -- 'CT1' | 'CT2' | 'assignment' | 'practical'
    marks       NUMERIC(5,2) NOT NULL,
    max_marks   NUMERIC(5,2) NOT NULL,
    entered_by  UUID REFERENCES staff(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments
CREATE TABLE assignments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   UUID REFERENCES courses(id),
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    deadline    TIMESTAMPTZ NOT NULL,
    created_by  UUID REFERENCES staff(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id   UUID REFERENCES assignments(id),
    student_id      UUID REFERENCES students(id),
    file_url        TEXT,
    submitted_at    TIMESTAMPTZ DEFAULT NOW(),
    grade           NUMERIC(5,2),
    feedback        TEXT,
    is_late         BOOLEAN DEFAULT FALSE
);

-- Leave Requests
CREATE TABLE leave_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID REFERENCES students(id),
    leave_type      VARCHAR(30) NOT NULL,
    from_date       DATE NOT NULL,
    to_date         DATE NOT NULL,
    reason          TEXT NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',
    approved_by     UUID REFERENCES staff(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    body            TEXT NOT NULL,
    audience        VARCHAR(50) NOT NULL,
    is_urgent       BOOLEAN DEFAULT FALSE,
    created_by      UUID REFERENCES staff(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Timetable
CREATE TABLE timetable (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   UUID REFERENCES courses(id),
    staff_id    UUID REFERENCES staff(id),
    day         VARCHAR(10) NOT NULL,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    room        VARCHAR(20),
    section     VARCHAR(5)
);

-- Chatbot Logs
CREATE TABLE chatbot_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    query       TEXT NOT NULL,
    response    TEXT NOT NULL,
    intent      VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Students
```
GET    /api/v1/students/
GET    /api/v1/students/{id}
PUT    /api/v1/students/{id}
GET    /api/v1/students/{id}/profile
```

### Staff
```
GET    /api/v1/staff/
GET    /api/v1/staff/{id}
GET    /api/v1/staff/{id}/classes
```

### Attendance
```
GET    /api/v1/attendance/student/{id}
POST   /api/v1/attendance/mark
PUT    /api/v1/attendance/{id}
GET    /api/v1/attendance/report/{course_id}
GET    /api/v1/attendance/summary/{student_id}
```

### Marks
```
GET    /api/v1/marks/student/{id}
POST   /api/v1/marks/
PUT    /api/v1/marks/{id}
GET    /api/v1/marks/report/{course_id}
GET    /api/v1/marks/cgpa/{student_id}
```

### Assignments
```
GET    /api/v1/assignments/
POST   /api/v1/assignments/
GET    /api/v1/assignments/{id}
POST   /api/v1/assignments/{id}/submissions
GET    /api/v1/assignments/{id}/submissions
PUT    /api/v1/submissions/{id}/grade
```

### Leave
```
GET    /api/v1/leave/
POST   /api/v1/leave/
PUT    /api/v1/leave/{id}/approve
PUT    /api/v1/leave/{id}/reject
GET    /api/v1/leave/student/{id}
```

### Timetable
```
GET    /api/v1/timetable/student/{id}
GET    /api/v1/timetable/staff/{id}
GET    /api/v1/timetable/course/{id}
```

### Announcements
```
GET    /api/v1/announcements/
POST   /api/v1/announcements/
DELETE /api/v1/announcements/{id}
```

### Reports
```
GET    /api/v1/reports/attendance/{student_id}?format=pdf
GET    /api/v1/reports/marks/{student_id}?format=pdf
GET    /api/v1/reports/academic/{student_id}?format=pdf
GET    /api/v1/reports/class-attendance/{course_id}
```

### Internships
```
GET    /api/v1/internships/
GET    /api/v1/internships/student/{id}
POST   /api/v1/internships/{id}/apply
POST   /api/v1/internships/{id}/report
```

### GoCode
```
GET    /api/v1/gocode/problems/?track={beginner|intermediate|competitive}
GET    /api/v1/gocode/qod/
POST   /api/v1/gocode/problems/{id}/solve
GET    /api/v1/gocode/leaderboard/{section}
GET    /api/v1/gocode/student/{id}/progress
```

### AI Chatbot
```
POST   /api/v1/chatbot/query
GET    /api/v1/chatbot/history/{user_id}
GET    /api/v1/chatbot/suggestions
```

---

## 🐳 Deployment

### Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.9'

services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://backend:8000/api/v1

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    env_file: .env

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: intellicampus
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  celery_worker:
    build: ./backend
    command: celery -A app.celery_app worker --loglevel=info
    depends_on:
      - redis
      - postgres
    env_file: .env

  neo4j:
    image: neo4j:5.18
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/password

  elasticsearch:
    image: elasticsearch:8.13.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

volumes:
  postgres_data:
```

### Kubernetes (Production)

```bash
# Apply all manifests
kubectl apply -f k8s/

# Key manifests structure
k8s/
├── namespace.yaml
├── configmap.yaml
├── secrets.yaml
├── deployments/
│   ├── frontend.yaml
│   ├── backend.yaml
│   ├── celery-worker.yaml
│   └── celery-beat.yaml
├── services/
│   ├── frontend-svc.yaml
│   └── backend-svc.yaml
├── ingress/
│   └── ingress.yaml
└── hpa/
    └── backend-hpa.yaml    # Horizontal Pod Autoscaler
```

---

## ⚡ CI/CD Pipeline

```yaml
# .github/workflows/main.yml
name: IntelliCampus CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ── Frontend ──────────────────────────────────────────────
  frontend-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - run: npm run test --if-present

  # ── Backend ───────────────────────────────────────────────
  backend-ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        options: --health-cmd pg_isready
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests/ --cov

  # ── Docker Build & Push ───────────────────────────────────
  docker-build:
    needs: [frontend-ci, backend-ci]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - run: |
          docker build -t intellicampus/frontend:latest ./frontend
          docker build -t intellicampus/backend:latest ./backend
          docker push intellicampus/frontend:latest
          docker push intellicampus/backend:latest

  # ── Deploy to K8s ─────────────────────────────────────────
  deploy:
    needs: docker-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/setup-kubectl@v3
      - run: kubectl apply -f k8s/
      - run: kubectl rollout status deployment/frontend
      - run: kubectl rollout status deployment/backend
```

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| **Authentication** | JWT Access Tokens (30 min) + Refresh Tokens (7 days) |
| **Authorization** | Role-Based Access Control (RBAC) — Student / Staff |
| **Password Security** | bcrypt hashing with salt rounds |
| **API Security** | Rate limiting (slowapi), CORS, HTTPS-only |
| **Data Encryption** | TLS 1.3 in transit, AES-256 at rest (AWS S3) |
| **Compliance** | FERPA / GDPR — data minimization, consent tracking |
| **Audit Logs** | All sensitive actions logged with timestamp + user ID |
| **Backup** | Automated daily PostgreSQL dumps to S3 |

---

## 📁 Project Structure

```
intellicampus/
├── 📁 frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── student/   # 12 student pages
│   │   │   │   │   └── staff/     # 8 staff pages
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── FloatingChatbot.tsx
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx
│   │   │   └── routes.tsx
│   │   └── styles/
│   └── package.json
│
├── 📁 backend/                   # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── students.py
│   │   │       ├── staff.py
│   │   │       ├── attendance.py
│   │   │       ├── marks.py
│   │   │       ├── assignments.py
│   │   │       ├── leave.py
│   │   │       ├── reports.py
│   │   │       ├── internships.py
│   │   │       ├── gocode.py
│   │   │       └── chatbot.py
│   │   ├── models/               # SQLAlchemy models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── services/             # Business logic
│   │   ├── ai/                   # Graph RAG chatbot
│   │   │   ├── embeddings.py
│   │   │   ├── retriever.py
│   │   │   ├── graph_query.py
│   │   │   └── llm.py
│   │   ├── celery_app.py
│   │   ├── database.py
│   │   └── main.py
│   ├── alembic/                  # DB migrations
│   ├── tests/
│   └── requirements.txt
│
├── 📁 k8s/                       # Kubernetes manifests
├── 📁 .github/workflows/         # GitHub Actions CI/CD
├── docker-compose.yml
└── README.md
```

---

## 🧑‍💻 Development Guide

```bash
# Quick start (Docker)
docker-compose up --build

# Access points
# Frontend:   http://localhost:5173
# Backend:    http://localhost:8000
# API Docs:   http://localhost:8000/docs  (Swagger UI)
# Redoc:      http://localhost:8000/redoc
# Neo4j:      http://localhost:7474
```

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| **Student** | rahul.sharma@college.edu | student@123 |
| **Staff** | priya.nair@college.edu | staff@123 |

---

## 📄 License

MIT License — © 2026 IntelliCampus · Engineering College

---

> Built with ❤️ using React, FastAPI, PostgreSQL, Neo4j, and OpenAI — for a smarter academic future.
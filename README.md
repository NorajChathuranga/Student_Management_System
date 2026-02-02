# EduPortal — Student Management System

EduPortal is a full‑stack student management system built with a Spring Boot REST API and a React (Vite) single‑page application. It supports role‑based workflows for administrators, teachers, and students.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Run Locally](#run-locally)
- [API](#api)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Role‑based access control (ADMIN, TEACHER, STUDENT)
- Class and subject management
- Student enrollment and teacher assignment
- Attendance tracking (single & bulk)
- Marks/grades entry (single & bulk)
- Admin dashboard statistics

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.2.2
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- MySQL

**Frontend**
- React 18, TypeScript, Vite
- Tailwind CSS + shadcn/ui
- Axios, React Router

## Architecture

- **Frontend**: React SPA (Vite) calling the backend over HTTP.
- **Backend**: Spring Boot REST API secured with JWT.
- **Database**: MySQL via JPA/Hibernate (schema managed by `spring.jpa.hibernate.ddl-auto`).

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

### Configuration

#### Backend (Spring Boot)

Backend configuration lives in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

Recommended environment overrides:

```bash
# MySQL
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/eduportal
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# JWT
JWT_SECRET=change_this_in_production
JWT_EXPIRATION=86400000

# CORS (comma-separated)
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Notes:
- The current datasource URL includes `createDatabaseIfNotExist=true`, so the database can be created automatically if MySQL is running.
- For real deployments, always rotate `JWT_SECRET` and disable verbose security logging.

#### Frontend (Vite)

Set the API base URL using Vite env vars:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Prefer `frontend/.env.local` for local development.

### Run Locally

**Backend**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend: http://localhost:8080

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## API

Base path: `/api`

**Auth**
- `POST /api/auth/signup` — Register a user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/me` — Current user profile

**Core resources**
- Users: `/api/users`, `/api/users/students`, `/api/users/teachers`
- Classes: `/api/classes`
- Subjects: `/api/subjects`
- Teacher assignment: `/api/teacher-classes`
- Student enrollment: `/api/student-classes`
- Attendance: `/api/attendance`
- Marks: `/api/marks`
- Dashboard stats: `/api/dashboard/stats`

## Project Structure

```
backend/   # Spring Boot API
frontend/  # React (Vite) SPA
README.md
```

## License

MIT — see [LICENSE](LICENSE).

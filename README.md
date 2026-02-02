# EduPortal - Student Management System

A full-stack student management system with React frontend and Spring Boot backend.

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.2
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Axios
- React Router

## Prerequisites

1. **Java 17** or higher
2. **Node.js 18** or higher
3. **MySQL 8.0** or higher
4. **Maven 3.8** or higher

## Database Setup

1. Install and start MySQL server
2. Create a database named `eduportal`:
   ```sql
   CREATE DATABASE eduportal;
   ```
3. Update the credentials in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create a `.env` file (optional, defaults to localhost:8080):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

The frontend will start on `http://localhost:5173`

## User Roles

The system supports three user roles:

1. **ADMIN** - Full access to all features
   - Manage classes, subjects, students, and teachers
   - View dashboard statistics
   - Assign teachers to classes
   - Enroll students in classes

2. **TEACHER** - Class and student management
   - View assigned classes
   - Mark attendance
   - Enter student marks/grades

3. **STUDENT** - View personal information
   - View enrolled classes
   - View attendance records
   - View marks and grades

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/students` - Get all students
- `GET /api/users/teachers` - Get all teachers

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class (Admin)
- `PUT /api/classes/{id}` - Update class (Admin)
- `DELETE /api/classes/{id}` - Delete class (Admin)

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject (Admin)
- `PUT /api/subjects/{id}` - Update subject (Admin)
- `DELETE /api/subjects/{id}` - Delete subject (Admin)

### Teacher Classes
- `GET /api/teacher-classes/my-classes` - Get teacher's assigned classes
- `POST /api/teacher-classes` - Assign teacher to class (Admin)
- `DELETE /api/teacher-classes/{id}` - Remove assignment (Admin)

### Student Classes
- `GET /api/student-classes/my-classes` - Get student's enrolled classes
- `POST /api/student-classes` - Enroll student (Admin)
- `DELETE /api/student-classes/{id}` - Unenroll student (Admin)

### Attendance
- `GET /api/attendance/my-attendance` - Get student's attendance
- `GET /api/attendance/class/{classId}?date=YYYY-MM-DD` - Get class attendance
- `POST /api/attendance` - Mark attendance (Teacher)
- `POST /api/attendance/bulk` - Mark bulk attendance (Teacher)

### Marks
- `GET /api/marks/my-marks` - Get student's marks
- `GET /api/marks/class/{classId}/subject/{subjectId}` - Get class marks
- `POST /api/marks` - Add mark (Teacher)
- `POST /api/marks/bulk` - Add bulk marks (Teacher)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Admin)

## Default Users

After starting the application, you can register new users through the signup page. The first user with ADMIN role will have full access.

## Project Structure

```
├── backend/
│   ├── src/main/java/com/eduportal/
│   │   ├── config/         # Security & CORS configuration
│   │   ├── controller/     # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── exception/      # Custom exceptions
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # JWT & auth filters
│   │   └── service/        # Business logic
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # API client & utilities
│   │   └── pages/          # Page components
│   └── package.json
│
└── README.md
```

## License

MIT License

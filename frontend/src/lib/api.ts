import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  signup: (data: { fullName: string; email: string; password: string; role: string; phone?: string }) =>
    api.post('/auth/signup', data),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getStudents: () => api.get('/users/students'),
  getTeachers: () => api.get('/users/teachers'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: { fullName?: string; phone?: string }) =>
    api.put(`/users/${id}`, null, { params: data }),
  delete: (id: string) => api.delete(`/users/${id}`),
  toggleStatus: (id: string) => api.patch(`/users/${id}/toggle-status`),
};

// Classes API
export const classesApi = {
  getAll: () => api.get('/classes'),
  getById: (id: string) => api.get(`/classes/${id}`),
  create: (data: { name: string; description?: string; gradeLevel?: string; academicYear?: string }) =>
    api.post('/classes', data),
  update: (id: string, data: { name: string; description?: string; gradeLevel?: string; academicYear?: string }) =>
    api.put(`/classes/${id}`, data),
  delete: (id: string) => api.delete(`/classes/${id}`),
};

// Subjects API
export const subjectsApi = {
  getAll: () => api.get('/subjects'),
  getById: (id: string) => api.get(`/subjects/${id}`),
  create: (data: { name: string; code?: string; description?: string }) =>
    api.post('/subjects', data),
  update: (id: string, data: { name: string; code?: string; description?: string }) =>
    api.put(`/subjects/${id}`, data),
  delete: (id: string) => api.delete(`/subjects/${id}`),
};

// Teacher Classes API
export const teacherClassesApi = {
  getMyClasses: () => api.get('/teacher-classes/my-classes'),
  getTeacherClasses: (teacherId: string) => api.get(`/teacher-classes/teacher/${teacherId}`),
  getClassTeachers: (classId: string) => api.get(`/teacher-classes/class/${classId}`),
  assign: (data: { teacherId: string; classId: string; subjectId?: string }) =>
    api.post('/teacher-classes', data),
  remove: (id: string) => api.delete(`/teacher-classes/${id}`),
};

// Student Classes API
export const studentClassesApi = {
  getMyClasses: () => api.get('/student-classes/my-classes'),
  getStudentClasses: (studentId: string) => api.get(`/student-classes/student/${studentId}`),
  getStudentsByClass: (classId: string) => api.get(`/student-classes/class/${classId}`),
  getClassStudents: (classId: string) => api.get(`/student-classes/class/${classId}`),
  enroll: (data: { studentId: string; classId: string }) =>
    api.post('/student-classes', data),
  unenroll: (id: string) => api.delete(`/student-classes/${id}`),
  unenrollFromClass: (studentId: string, classId: string) =>
    api.delete(`/student-classes/student/${studentId}/class/${classId}`),
};

// Attendance API
export const attendanceApi = {
  getMyAttendance: () => api.get('/attendance/my-attendance'),
  getMyStats: () => api.get('/attendance/my-stats'),
  getStudentAttendance: (studentId: string) => api.get(`/attendance/student/${studentId}`),
  getStudentStats: (studentId: string) => api.get(`/attendance/student/${studentId}/stats`),
  getByClassAndDate: (classId: string, date: string) =>
    api.get(`/attendance/class/${classId}`, { params: { date } }),
  mark: (data: { studentId: string; classId: string; date: string; status: string; notes?: string }) =>
    api.post('/attendance', data),
  markBulk: (records: Array<{ studentId: string; classId: string; date: string; status: string }>) =>
    api.post('/attendance/bulk', records),
  delete: (id: string) => api.delete(`/attendance/${id}`),
};

// Marks API
export const marksApi = {
  getMyMarks: () => api.get('/marks/my-marks'),
  getMyAverage: () => api.get('/marks/my-average'),
  getStudentMarks: (studentId: string) => api.get(`/marks/student/${studentId}`),
  getStudentAverage: (studentId: string) => api.get(`/marks/student/${studentId}/average`),
  getClassSubjectMarks: (classId: string, subjectId: string) =>
    api.get(`/marks/class/${classId}/subject/${subjectId}`),
  getClassSubjectAverage: (classId: string, subjectId: string) =>
    api.get(`/marks/class/${classId}/subject/${subjectId}/average`),
  add: (data: {
    studentId: string;
    classId: string;
    subjectId: string;
    examType: string;
    score: number;
    maxScore?: number;
    examDate?: string;
    notes?: string;
  }) => api.post('/marks', data),
  createBulk: (marks: Array<{
    studentId: string;
    classId: string;
    subjectId: string;
    examType: string;
    score: number;
    maxScore: number;
    examDate: string;
  }>) => api.post('/marks/bulk', marks),
  update: (id: string, data: {
    studentId: string;
    classId: string;
    subjectId: string;
    examType: string;
    score: number;
    maxScore?: number;
    examDate?: string;
    notes?: string;
  }) => api.put(`/marks/${id}`, data),
  delete: (id: string) => api.delete(`/marks/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

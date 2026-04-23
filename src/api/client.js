import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ta_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ta_token');
      localStorage.removeItem('ta_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ───────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ── Courses ────────────────────────────────────────
export const fetchCourses = (params) => api.get('/courses', { params });
export const fetchCourseById = (id) => api.get(`/courses/${id}`);

// ── Enrollments ────────────────────────────────────
export const enrollCourse = (courseId) => api.post('/enrollments', { courseId });
export const fetchMyEnrollments = () => api.get('/enrollments/my');
export const updateCourseProgress = (courseId, progress) => api.put(`/enrollments/${courseId}/progress`, { progress });
export const unenrollCourse = (courseId) => api.delete(`/enrollments/${courseId}`);

// ── Chapters ───────────────────────────────────────
export const fetchChapters = (courseId) => api.get(`/chapters/${courseId}`);
export const toggleChapterComplete = (chapterId) => api.post(`/chapters/${chapterId}/complete`);

// ── Admin ──────────────────────────────────────────
export const createCourseAdmin = (data) => api.post('/courses', data);
export const updateCourseAdmin = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourseAdmin = (id) => api.delete(`/courses/${id}`);
export const fetchAllUsersAdmin = () => api.get('/auth/users');
export const fetchAllEnrollmentsAdmin = () => api.get('/enrollments/all');

export default api;

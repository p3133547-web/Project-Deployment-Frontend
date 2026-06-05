/**
 * IntelliCampus API client — connects to the FastAPI backend.
 * Base URL: http://localhost:8000/api/v1
 *
 * Auth flow:
 *  – Login stores `access_token` in localStorage.
 *  – The axios instance automatically attaches it as a Bearer header.
 *  – On 401 the token is cleared and the user is redirected to /login.
 */
import axios from 'axios';

// ── Base axios instance ──────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Types ───────────────────────────────────────────────────────────────────

export interface UserOut {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  // Convenience aliases used by frontend pages
  name?: string;
  department?: string;
  designation?: string;
  roll_no?: string;
  employee_id?: string;
  year?: number;
  section?: string;
  avatar_url?: string;
}

export interface SubjectOut {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester?: number;
  is_lab?: boolean;
}

export interface AttendanceSummary {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  percentage: number;
  attended: number;
  total_classes: number;
}

export interface MarkOut {
  id: string;
  student_id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
}

export interface CGPASummary {
  cgpa: number;
  sgpa: number[];
  total_credits: number;
  rank?: number;
}

export interface AnnouncementOut {
  id: string;
  title: string;
  body: string;
  audience: string;
  is_urgent: boolean;
  is_pinned?: boolean;
  created_at: string;
}

export interface AssignmentOut {
  id: string;
  title: string;
  subject_name?: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'graded';
}

export interface LeaveOut {
  id: string;
  student_id?: string;
  student_name?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface InternshipOut {
  id: string;
  company: string;
  role: string;
  duration: string;
  stipend?: string;
  deadline: string;
  description?: string;
}

export interface ApplicationOut {
  id: string;
  internship_id: string;
  status: string;
  applied_at: string;
}

// ── Helper: normalise a backend UserResponse into the richer UserOut shape ──

function normaliseUser(u: any): UserOut {
  return {
    ...u,
    name: u.full_name,
    designation: u.role === 'student' ? 'Student' : u.role === 'staff' ? 'Faculty' : 'Administrator',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.username)}`,
    // department / roll_no / year / section — not stored in DB yet, defaulted gracefully
    department: u.department ?? 'N/A',
    roll_no: u.roll_no ?? undefined,
  };
}

// ── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Register (if not exist) then login.  Stores tokens in localStorage.
   */
  login: async (email: string, password: string, _role: string) => {
    const username = email.split('@')[0];

    // Attempt silent registration — ignore 409 (already exists)
    try {
      await api.post('/auth/register', {
        email,
        username,
        full_name: username,
        password,
        role: _role === 'staff' ? 'staff' : _role === 'admin' ? 'admin' : 'student',
      });
    } catch (e: any) {
      if (e.response?.status !== 409) {
        // Unexpected: try login anyway
      }
    }

    const res = await api.post('/auth/login', { username, password });
    const { access_token, refresh_token } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return {
      data: { access_token, refresh_token },
    };
  },

  me: async () => {
    const res = await api.get('/users/me');
    return { data: normaliseUser(res.data) };
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// ── Users API ───────────────────────────────────────────────────────────────

export const usersApi = {
  listStudents: async (department?: string) => {
    const res = await api.get('/users/students', {
      params: department ? { department } : {},
    });
    return { data: res.data.map(normaliseUser) };
  },

  getProfile: async (_id: string) => {
    // There is no /users/:id endpoint yet — return own profile
    const res = await api.get('/users/me');
    return { data: normaliseUser(res.data) };
  },
};

// ── Attendance API ──────────────────────────────────────────────────────────

export const attendanceApi = {
  getSubjects: async (params: { department?: string } = {}) => {
    const res = await api.get('/attendance/subjects', { params });
    return { data: res.data as SubjectOut[] };
  },

  getMySummary: async () => {
    const res = await api.get('/attendance/my-summary');
    return { data: res.data as AttendanceSummary[] };
  },

  markBulk: async (data: {
    subject_id: string;
    date: string;
    records: Array<{ student_id: string; status: string }>;
  }) => {
    const res = await api.post('/attendance/mark-bulk', data);
    return { data: res.data };
  },

  getRecords: async (subjectId: string, date?: string) => {
    const res = await api.get(`/attendance/records/${subjectId}`, {
      params: date ? { record_date: date } : {},
    });
    return { data: res.data };
  },
};

// ── Marks API ───────────────────────────────────────────────────────────────

export const marksApi = {
  enterMarksBulk: async (data: {
    subject_id: string;
    exam_type: string;
    records: Array<{ student_id: string; marks_obtained: number; max_marks: number }>;
  }) => {
    const res = await api.post('/marks/bulk', data);
    return { data: res.data };
  },

  getMarks: async (studentId: string) => {
    const res = await api.get(`/marks/student/${studentId}`);
    return { data: res.data as MarkOut[] };
  },

  getMyMarks: async () => {
    const res = await api.get('/marks/my-marks');
    return { data: res.data as MarkOut[] };
  },

  getMyCGPA: async () => {
    const res = await api.get('/marks/my-cgpa');
    return { data: res.data as CGPASummary };
  },
};

// ── Announcements API ───────────────────────────────────────────────────────

export const announcementsApi = {
  getAll: async () => {
    const res = await api.get('/announcements/');
    return { data: res.data as AnnouncementOut[] };
  },

  create: async (data: {
    title: string;
    body: string;
    audience?: string;
    is_urgent?: boolean;
    is_pinned?: boolean;
  }) => {
    const res = await api.post('/announcements/', data);
    return { data: res.data as AnnouncementOut };
  },

  delete: async (id: string) => {
    await api.delete(`/announcements/${id}`);
  },
};

// ── Assignments API ─────────────────────────────────────────────────────────

export const assignmentsApi = {
  getAll: async () => {
    const res = await api.get('/assignments/');
    return { data: res.data as AssignmentOut[] };
  },

  create: async (data: {
    title: string;
    description?: string;
    subject_id?: string;
    deadline: string;
  }) => {
    const res = await api.post('/assignments/', data);
    return { data: res.data as AssignmentOut };
  },

  submit: async (id: string) => {
    const res = await api.post(`/assignments/${id}/submit`);
    return { data: res.data };
  },
};

// ── Leave API ───────────────────────────────────────────────────────────────

export const leaveApi = {
  getPending: async () => {
    const res = await api.get('/leaves/pending');
    return { data: res.data as LeaveOut[] };
  },

  getMy: async () => {
    const res = await api.get('/leaves/my');
    return { data: res.data as LeaveOut[] };
  },

  create: async (data: {
    leave_type: string;
    from_date: string;
    to_date: string;
    reason: string;
  }) => {
    const res = await api.post('/leaves/', data);
    return { data: res.data };
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected') => {
    const res = await api.patch(`/leaves/${id}`, { status });
    return { data: res.data as LeaveOut };
  },
};

// ── Internships API ─────────────────────────────────────────────────────────

export const internshipsApi = {
  getAll: async () => {
    const res = await api.get('/internships/');
    return { data: res.data as InternshipOut[] };
  },

  create: async (data: {
    company: string;
    role: string;
    duration: string;
    stipend?: string;
    deadline: string;
    description?: string;
  }) => {
    const res = await api.post('/internships/', data);
    return { data: res.data as InternshipOut };
  },

  apply: async (id: string) => {
    const res = await api.post(`/internships/${id}/apply`);
    return { data: res.data as ApplicationOut };
  },

  myApplications: async () => {
    const res = await api.get('/internships/my-applications');
    return { data: res.data as ApplicationOut[] };
  },
};

// ── GoCode API (stub — no backend endpoint yet) ─────────────────────────────

export const goCodeApi = {
  listProblems: async () => ({ data: [] }),
  getLeaderboard: async () => ({ data: [] }),
};

// ── Chatbot API ─────────────────────────────────────────────────────────────

export const chatbotApi = {
  query: async (text: string, sessionId?: string) => {
    return api.post('/chat/', {
      message: text,
      conversation_id: sessionId,
      use_rag: true,
    });
  },
};

export default api;

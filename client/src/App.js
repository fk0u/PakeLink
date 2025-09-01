import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout, checkAuth } from './features/auth/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Student Pages
import StudentRegistration from './pages/students/StudentRegistration';
import StudentList from './pages/students/StudentList';
import StudentDetail from './pages/students/StudentDetail';

// Company Pages
import CompanyRegistration from './pages/companies/CompanyRegistration';
import CompanyList from './pages/companies/CompanyList';
import CompanyDetail from './pages/companies/CompanyDetail';

// Journal Pages
import JournalEntry from './pages/journals/JournalEntry';
import JournalList from './pages/journals/JournalList';

// Attendance Pages
import AttendanceEntry from './pages/attendance/AttendanceEntry';
import AttendanceList from './pages/attendance/AttendanceList';

// Consultation Pages
import ConsultationEntry from './pages/consultations/ConsultationEntry';
import ConsultationList from './pages/consultations/ConsultationList';

// Other Pages
import Regulations from './pages/Regulations';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    } else if (!loading && isAuthenticated && roles.length > 0 && !roles.includes(user.role)) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate, location, user, roles]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated && (roles.length === 0 || roles.includes(user.role)) ? children : null;
};

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/students/register"
          element={
            <ProtectedRoute roles={['admin', 'school_supervisor']}>
              <StudentRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <StudentDetail />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/companies/register"
          element={
            <ProtectedRoute roles={['admin', 'school_supervisor']}>
              <CompanyRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <CompanyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/:id"
          element={
            <ProtectedRoute>
              <CompanyDetail />
            </ProtectedRoute>
          }
        />

        {/* Journal Routes */}
        <Route
          path="/journals/new"
          element={
            <ProtectedRoute roles={['student']}>
              <JournalEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journals"
          element={
            <ProtectedRoute>
              <JournalList />
            </ProtectedRoute>
          }
        />

        {/* Attendance Routes */}
        <Route
          path="/attendance/new"
          element={
            <ProtectedRoute roles={['company_supervisor']}>
              <AttendanceEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendanceList />
            </ProtectedRoute>
          }
        />

        {/* Consultation Routes */}
        <Route
          path="/consultations/new"
          element={
            <ProtectedRoute roles={['student']}>
              <ConsultationEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultations"
          element={
            <ProtectedRoute>
              <ConsultationList />
            </ProtectedRoute>
          }
        />

        {/* Other Routes */}
        <Route
          path="/regulations"
          element={
            <ProtectedRoute>
              <Regulations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={['admin', 'school_supervisor']}>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

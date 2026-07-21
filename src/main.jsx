import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { AuthProvider } from './app/lib/AuthProvider.jsx';
import Spinner from './app/components/Spinner.jsx';
import './index.css';

// The product app is code-split from the marketing landing so visitors to "/"
// don't download the whole authenticated app.
const RequireAuth = lazy(() => import('./app/RequireAuth.jsx'));
const AppShell = lazy(() => import('./app/AppShell.jsx'));
const Login = lazy(() => import('./app/pages/Login.jsx'));
const AuthCallback = lazy(() => import('./app/pages/AuthCallback.jsx'));
const Onboarding = lazy(() => import('./app/pages/Onboarding.jsx'));
const Dashboard = lazy(() => import('./app/pages/Dashboard.jsx'));
const CalendarPage = lazy(() => import('./app/pages/CalendarPage.jsx'));
const Courses = lazy(() => import('./app/pages/Courses.jsx'));
const AssignmentDetail = lazy(() => import('./app/pages/AssignmentDetail.jsx'));
const ImportPage = lazy(() => import('./app/pages/ImportPage.jsx'));
const Classes = lazy(() => import('./app/pages/Classes.jsx'));
const ClassDetail = lazy(() => import('./app/pages/ClassDetail.jsx'));
const Settings = lazy(() => import('./app/pages/Settings.jsx'));
const Billing = lazy(() => import('./app/pages/Billing.jsx'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});

const Loading = () => (
  <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
    <Spinner label="Loading…" />
  </div>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Marketing landing page */}
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/app/auth/callback" element={<AuthCallback />} />

              {/* Product (auth-gated) */}
              <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
                <Route index element={<Dashboard />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="courses" element={<Courses />} />
                <Route path="assignments/:id" element={<AssignmentDetail />} />
                <Route path="import" element={<ImportPage />} />
                <Route path="classes" element={<Classes />} />
                <Route path="classes/:id" element={<ClassDetail />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/billing" element={<Billing />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

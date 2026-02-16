import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import UserDetail from './pages/UserDetail';
import RoutinesPage from './pages/Routines';
import RoutineForm from './pages/RoutineForm';
import PurchasesPage from './pages/Purchases';
import PostsPage from './pages/Posts';
import SettingsPage from './pages/Settings';

function DefaultRedirect() {
  const { admin } = useAuthStore();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (admin.role === 'sales') {
    return <Navigate to="/routines" replace />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - super_admin only */}
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <DefaultRedirect />
            </ProtectedRoute>
          }
        />

        {/* Users - super_admin only */}
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <UserDetail />
            </ProtectedRoute>
          }
        />

        {/* Routines - both roles */}
        <Route path="routines" element={<RoutinesPage />} />
        <Route path="routines/new" element={<RoutineForm />} />
        <Route path="routines/:id/edit" element={<RoutineForm />} />

        {/* Purchases - super_admin only */}
        <Route
          path="purchases"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PurchasesPage />
            </ProtectedRoute>
          }
        />

        {/* Posts - super_admin only */}
        <Route
          path="posts"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PostsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings - super_admin only */}
        <Route
          path="settings"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

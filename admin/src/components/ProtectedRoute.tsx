import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { AdminRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { admin, token } = useAuthStore();

  if (!token || !admin) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && admin.role !== requiredRole && admin.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            권한이 없습니다
          </h2>
          <p className="text-gray-500">
            이 페이지에 접근할 수 있는 권한이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

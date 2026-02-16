import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Badge from './ui/Badge';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: ('super_admin' | 'sales')[];
}

const navItems: NavItem[] = [
  {
    to: '/',
    label: '대시보드',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['super_admin'],
  },
  {
    to: '/users',
    label: '사용자 관리',
    icon: <Users className="w-5 h-5" />,
    roles: ['super_admin'],
  },
  {
    to: '/routines',
    label: '루틴 관리',
    icon: <BookOpen className="w-5 h-5" />,
    roles: ['super_admin', 'sales'],
  },
  {
    to: '/purchases',
    label: '구매 관리',
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['super_admin'],
  },
  {
    to: '/posts',
    label: '게시물 관리',
    icon: <FileText className="w-5 h-5" />,
    roles: ['super_admin'],
  },
  {
    to: '/settings',
    label: '관리자 설정',
    icon: <Settings className="w-5 h-5" />,
    roles: ['super_admin'],
  },
];

const pageTitles: Record<string, string> = {
  '/': '대시보드',
  '/users': '사용자 관리',
  '/routines': '루틴 관리',
  '/routines/new': '루틴 등록',
  '/purchases': '구매 관리',
  '/posts': '게시물 관리',
  '/settings': '관리자 설정',
};

export default function Layout() {
  const { admin, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const filteredNavItems = navItems.filter(
    (item) => admin && item.roles.includes(admin.role)
  );

  const getPageTitle = (): string => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith('/users/')) return '사용자 상세';
    if (path.match(/\/routines\/.*\/edit/)) return '루틴 수정';
    return 'HTB Admin';
  };

  const getRoleBadge = () => {
    if (!admin) return null;
    if (admin.role === 'super_admin') {
      return <Badge variant="info" size="sm">최고 관리자</Badge>;
    }
    return <Badge variant="default" size="sm">영업 담당</Badge>;
  };

  return (
    <div className="flex h-screen bg-htb-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-htb-dark flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-white font-bold text-lg">HTB Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? 'text-primary bg-white/5 border-l-2 border-primary ml-0'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }
              `}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {admin?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {admin?.name || '관리자'}
              </p>
              <div className="mt-0.5">{getRoleBadge()}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

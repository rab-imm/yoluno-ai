/**
 * Dashboard Page
 *
 * Main parent dashboard with child management.
 */

import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  Map,
} from 'lucide-react';

// Dashboard sub-pages (placeholder components)
function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Yoluno</h1>
      <p className="text-muted-foreground">
        Select a child profile to get started, or create a new one.
      </p>
    </div>
  );
}

function ChildrenPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Children</h1>
      <p className="text-muted-foreground">Manage your child profiles here.</p>
    </div>
  );
}

function StoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stories</h1>
      <p className="text-muted-foreground">View and manage generated stories.</p>
    </div>
  );
}

function JourneysPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Learning Journeys</h1>
      <p className="text-muted-foreground">Track learning progress and journeys.</p>
    </div>
  );
}

function SafetyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Safety Settings</h1>
      <p className="text-muted-foreground">Configure content safety and guardrails.</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your account settings.</p>
    </div>
  );
}

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/children', label: 'Children', icon: Users },
  { path: '/dashboard/stories', label: 'Stories', icon: BookOpen },
  { path: '/dashboard/journeys', label: 'Journeys', icon: Map },
  { path: '/dashboard/safety', label: 'Safety', icon: Shield },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardPage() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Yoluno</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                item.path === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.path);

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('w-full justify-start gap-3', isActive && 'bg-secondary')}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/journeys" element={<JourneysPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

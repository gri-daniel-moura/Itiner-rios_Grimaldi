import AdminNav from '@/components/AdminNav';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Check if we are on the login page (which should not render the sidebar)
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminNav />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

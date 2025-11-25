
'use client';

import type {ReactNode} from 'react';
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {SidebarNav} from '@/components/layout/sidebar-nav';
import {Header} from '@/components/layout/header';
import {useUser} from '@/firebase/auth/use-user';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Loader2} from 'lucide-react';

export default function AppLayout({children}: {children: ReactNode}) {
  const {user, loading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarNav />
        <SidebarInset>
          <Header />
          <div className="flex-1 p-4 sm:p-6 md:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

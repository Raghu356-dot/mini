
import type {ReactNode} from 'react';
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {SidebarNav} from '@/components/layout/sidebar-nav';
import {Header} from '@/components/layout/header';

export default function AppLayout({children}: {children: ReactNode}) {
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

    
'use client';
import {usePathname} from 'next/navigation';
import {SidebarTrigger} from '@/components/ui/sidebar';

const pageTitles: {[key: string]: string} = {
  '/analysis': 'Threat Analysis',
  '/settings': 'Settings',
  '/history': 'History',
  '/methodology': 'Methodology',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Threat Analysis';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4"></div>
    </header>
  );
}

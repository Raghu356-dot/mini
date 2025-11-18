'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {BrainCircuit, BotMessageSquare} from 'lucide-react';

const navItems = [{href: '/analysis', icon: BrainCircuit, label: 'Threat Analysis'}];

export function SidebarNav() {
  const pathname = usePathname();
  const {open} = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <BotMessageSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          {open && <h1 className="text-2xl font-bold font-headline text-foreground">CyberMind</h1>}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2"></SidebarFooter>
    </Sidebar>
  );
}

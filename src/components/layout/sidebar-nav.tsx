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
} from '@/components/ui/sidebar';
import {BrainCircuit, History, ShieldAlert} from 'lucide-react';

const navItems = [
  {href: '/analysis', icon: BrainCircuit, label: 'Threat Analysis'},
  {href: '/incidents', icon: ShieldAlert, label: 'Incident Response'},
  {href: '/history', icon: History, label: 'History'},
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4"></SidebarHeader>
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

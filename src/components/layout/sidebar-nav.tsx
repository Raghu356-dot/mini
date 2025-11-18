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
import {LayoutDashboard, BrainCircuit, LogOut, BotMessageSquare} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {mockUser} from '@/lib/data';

const navItems = [
  {href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'},
  {href: '/analysis', icon: BrainCircuit, label: 'Threat Analysis'},
];

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
          {open && (
            <h1 className="text-2xl font-bold font-headline text-foreground">CyberMind</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div
          className={`flex items-center gap-3 transition-all duration-200 p-2 rounded-lg ${
            open ? '' : 'bg-transparent'
          }`}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {open && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm truncate">{mockUser.name}</span>
              <span className="text-xs text-muted-foreground truncate">{mockUser.email}</span>
            </div>
          )}
        </div>
        <Link href="/login" passHref legacyBehavior>
          <SidebarMenuButton asChild>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarMenuButton>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}


'use client';
import {usePathname, useRouter} from 'next/navigation';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {useAuth, useFirebaseConfigError} from '@/firebase';
import {signOut} from 'firebase/auth';
import {useToast} from '@/hooks/use-toast';
import {LogOut} from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';

const pageTitles: {[key: string]: string} = {
  '/analysis': 'Threat Analysis',
  '/history': 'History',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Analysis';
  const auth = useAuth();
  const router = useRouter();
  const {toast} = useToast();
  const configError = useFirebaseConfigError();
  const { clearMockUser } = useUser();

  const handleSignOut = async () => {
    if (configError) {
      clearMockUser();
      toast({
        title: 'Signed Out (Mock)',
        description: 'You have been successfully signed out.',
      });
      router.push('/login');
      return;
    }
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sign out</span>
        </Button>
      </div>
    </header>
  );
}

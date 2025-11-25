
'use client';

import {useUser} from '@/firebase/auth/use-user';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Loader2} from 'lucide-react';

export default function RootPage() {
  const {user, loading} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/analysis');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

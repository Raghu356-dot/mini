
'use client';
import { useEffect, useState, useContext, createContext } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth, useFirebaseConfigError } from '@/firebase';

// Define a type for the mock user that is compatible with Firebase's User
type MockUser = Pick<User, 'uid' | 'email' | 'displayName' | 'photoURL'>;

interface UserContextValue {
  user: User | MockUser | null;
  loading: boolean;
  setMockUser: (user: MockUser | null) => void;
  clearMockUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const configError = useFirebaseConfigError();
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to set a mock user in state
  const setMockUser = (mockUser: MockUser | null) => {
    if (configError) {
      setUser(mockUser);
      setLoading(false);
    }
  };
  
  // Function to clear the mock user
  const clearMockUser = () => {
    if (configError) {
      setUser(null);
    }
  };

  useEffect(() => {
    // If Firebase is not configured, we don't need to listen to auth state.
    // The user will be managed by `setMockUser`.
    if (configError) {
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, configError]);

  return (
    <UserContext.Provider value={{ user, loading, setMockUser, clearMockUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

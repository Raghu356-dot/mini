'use client';
import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  limit,
  startAfter,
  orderBy,
  endBefore,
  limitToLast,
  type Query,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

interface UseCollectionOptions<T> {
  query?: [string, '==', any];
  orderBy?: [string, 'asc' | 'desc'];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
}

export function useCollection<T extends DocumentData>(
  q: Query<DocumentData> | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      setData([]);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}

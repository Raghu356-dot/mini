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
  collectionPath: string | null,
  options: UseCollectionOptions<T> = {}
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const optionsRef = useRef(options);

  useEffect(() => {
    if (!firestore || !collectionPath) {
      setLoading(false);
      return;
    }

    const {
      query: queryConstraint,
      orderBy: orderByConstraint,
      limit: limitConstraint,
      startAfter: startAfterConstraint,
      endBefore: endBeforeConstraint,
    } = optionsRef.current;

    const constraints = [];
    if (queryConstraint) constraints.push(where(...queryConstraint));
    if (orderByConstraint) constraints.push(orderBy(...orderByConstraint));
    if (startAfterConstraint) constraints.push(startAfter(startAfterConstraint));
    if (endBeforeConstraint) constraints.push(endBefore(endBeforeConstraint), limitToLast(limitConstraint || 25));
    else if (limitConstraint) constraints.push(limit(limitConstraint));

    const q: Query<DocumentData> = query(collection(firestore, collectionPath), ...constraints);

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
  }, [firestore, collectionPath]);

  return { data, loading, error };
}

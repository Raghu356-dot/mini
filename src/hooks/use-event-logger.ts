'use client';
import {useState, useEffect, useCallback} from 'react';
import type {LoggedEvent} from '@/lib/types';

const STORAGE_KEY = 'loggedEvents';

export function useEventLogger() {
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);

  useEffect(() => {
    try {
      const storedEvents = window.localStorage.getItem(STORAGE_KEY);
      if (storedEvents) {
        setLoggedEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Failed to read events from localStorage', error);
    }
  }, []);

  const addEvent = useCallback((agent: string, description: string) => {
    const newEvent: LoggedEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agent,
      description,
    };
    setLoggedEvents(prev => {
      const updatedEvents = [newEvent, ...prev];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Failed to save events to localStorage', error);
      }
      return updatedEvents;
    });
  }, []);

  const clearEvents = useCallback(() => {
    setLoggedEvents([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear events from localStorage', error);
    }
  }, []);

  return {loggedEvents, addEvent, clearEvents};
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { QuizHistoryEntry } from '@/lib/types';

const HISTORY_STORAGE_KEY = 'quizHistory';

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Failed to read history from localStorage", error);
        setHistory([]);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  const addHistoryEntry = useCallback((entry: QuizHistoryEntry) => {
    if (typeof window === 'undefined') return;

    try {
      const updatedHistory = [entry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
  }, []);

  return { history: isInitialized ? history : [], addHistoryEntry, clearHistory, isInitialized };
}

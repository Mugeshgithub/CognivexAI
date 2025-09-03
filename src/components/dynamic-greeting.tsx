'use client';

import { useState, useEffect } from 'react';
import { generateGreeting, type DynamicGreetingOutput } from '@/ai/flows/dynamic-greeting';
import { Skeleton } from '@/components/ui/skeleton';

export default function DynamicGreeting() {
  const [greeting, setGreeting] = useState<DynamicGreetingOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        setLoading(true);
        const result = await generateGreeting();
        setGreeting(result);
      } catch (error) {
        console.error('Failed to generate greeting:', error);
        setGreeting({ greeting: 'Welcome to the future of AI.' });
      } finally {
        setLoading(false);
      }
    };
    fetchGreeting();
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2 mt-2" />
      </>
    );
  }

  return <p className="text-lg text-muted-foreground sm:text-xl">{greeting?.greeting}</p>;
}

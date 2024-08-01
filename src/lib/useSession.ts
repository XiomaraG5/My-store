import { useState, useEffect } from 'react';
import { Session } from 'next-auth';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('/api/session');
      if (response.ok) {
        const data = await response.json();
        setSession(data.session||{});
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  return { session, loading };
}

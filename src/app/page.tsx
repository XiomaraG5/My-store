'use client'

import { useSession } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Client from "./(Private)/client/Client";
import Seller from "./(Private)/seller/Seller";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

function PrivatePage() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    } else if (session) {
      setUser(session.user as User);
    }
  }, [loading, session, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/login');
    } else {
      alert('Failed to log out');
    }
  };

  return (
    <div className="h-full w-full  bg-gradient-to-r from-slate-500 to-slate-800">
    <div>
      <h1>Welcome, {user?.name || ""}</h1>
      <button onClick={handleLogout}>Sign out</button>
    </div>
    <div>
      {user?.role ==="customer" &&
      (<Client user={user}/>)}
      {user?.role ==="seller" &&
      (<Seller user={user}/>)}
    </div>
    </div>
  );
}

export default PrivatePage;

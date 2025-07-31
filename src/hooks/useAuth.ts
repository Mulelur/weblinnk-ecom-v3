// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, type User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return { user };
}

import type { User as FirebaseAuthUser } from "firebase/auth";

// Custom fields you store in Firestore alongside the auth profile
export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean | null;
  // add your own app-specific fields here:
  //   role?: "admin" | "editor" | "viewer";
  //   createdAt: Date;
  email: string | null;
  // etc.
}

export interface AppUser extends FirebaseAuthUser, User {}

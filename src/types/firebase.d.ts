declare module 'firebase/app' {
  import { FirebaseApp } from '@firebase/app';
  export * from '@firebase/app';
  export function initializeApp(config: any): FirebaseApp;
}

declare module 'firebase/auth' {
  import { Auth, User } from '@firebase/auth';
  export * from '@firebase/auth';
  export function getAuth(app?: any): Auth;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<{ user: User }>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<{ user: User }>;
  export function signOut(auth: Auth): Promise<void>;
  export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void): () => void;
}

import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { auth } from '../config/firebase';
import type { Firestore } from 'firebase/firestore';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number | Timestamp;
  updatedAt?: number | Timestamp;
  userId?: string;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  createdAt: number;
  isAI: boolean;
}

const getFirestore = (): Firestore => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return db;
};

export const createChatSession = async (title: string = 'New Chat'): Promise<ChatSession | null> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const firestore = getFirestore();
    const now = Timestamp.now();
    const chatSession = {
      title,
      createdAt: now,
      updatedAt: now,
      userId: user.uid,
      messages: [],
    };

    const docRef = await addDoc(collection(firestore, 'chatSessions'), chatSession);
    return {
      id: docRef.id,
      ...chatSession,
      createdAt: now.toMillis(), // Convert to number for the app
      updatedAt: now.toMillis(), // Convert to number for the app
    };
  } catch (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const firestore = getFirestore();
    const q = query(
      collection(firestore, 'chatSessions'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
      } as ChatSession;
    });
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return [];
  }
};

export const updateChatSession = async (sessionId: string, messages: Message[]): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const firestore = getFirestore();
    const sessionRef = doc(firestore, 'chatSessions', sessionId);
    
    await updateDoc(sessionRef, {
      messages,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating chat session:', error);
    throw error; // Throw error to handle it in the UI
  }
};

export const updateSessionTitle = async (sessionId: string, title: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const firestore = getFirestore();
    const sessionRef = doc(firestore, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      title,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating session title:', error);
    return false;
  }
};

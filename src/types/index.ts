export interface Activity {
  id: number;
  title: string;
  active: boolean;
  url?: string;
  thumbnail?: string;
  type?: 'video' | 'document' | 'audio';
  createdAt?: string;
}

export interface Space {
  id: number;
  name: string;
  count: number;
  description?: string;
}

export interface Chapter {
  time: string;
  title: string;
  description: string;
}

export interface Flashcard {
  id: number;
  question: string;
  type: string;
  status: 'pending' | 'reset' | 'completed';
}

export interface LearningContent {
  id: string;
  title: string;
  url?: string;
  chapters: Chapter[];
  flashcards: Flashcard[];
  studyProgress: number;
}

export interface UserProfile {
  email: string;
  plan: string;
  name?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}
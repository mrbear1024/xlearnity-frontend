export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatContextData {
  contentTitle?: string;
  contentType?: string;
  videoUrl?: string;
  currentTime?: number;
}
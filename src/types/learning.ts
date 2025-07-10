// 学习内容类型定义
export interface BaseContent {
  id: string;
  title: string;
  type: ContentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoContent extends BaseContent {
  type: 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  chapters?: Chapter[];
  transcript?: TranscriptSegment[];
}

export interface PDFContent extends BaseContent {
  type: 'pdf';
  fileUrl: string;
  pages?: PDFPage[];
  bookmarks?: Bookmark[];
}

export interface MarkdownContent extends BaseContent {
  type: 'markdown';
  content: string;
  sections?: MarkdownSection[];
}

export interface ChatContent extends BaseContent {
  type: 'chat';
  messages: ChatMessage[];
}

export type LearningContent = VideoContent | PDFContent | MarkdownContent | ChatContent;
export type ContentType = 'video' | 'pdf' | 'markdown' | 'chat';

// 通用数据结构
export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
}

export interface PDFPage {
  pageNumber: number;
  content: string;
  annotations?: Annotation[];
}

export interface Bookmark {
  id: string;
  title: string;
  pageNumber: number;
  position: { x: number; y: number };
}

export interface MarkdownSection {
  id: string;
  title: string;
  level: number;
  content: string;
  lineStart: number;
  lineEnd: number;
}

export interface Annotation {
  id: string;
  type: 'highlight' | 'note' | 'bookmark';
  position: { x: number; y: number; width: number; height: number };
  content: string;
  color?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// 学习会话接口
export type LastPosition = number | { page: number; line: number } | null;

export interface LearningSession {
  id: string;
  contentId: string;
  contentType: ContentType;
  userId?: string;
  progress: number;
  lastPosition?: LastPosition;
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  content: string;
  position?: LastPosition;
  type: 'note' | 'highlight' | 'question';
  createdAt: Date;
}

// 学习工具接口
export interface LearningTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  supportedTypes: ContentType[];
  component: React.ComponentType<object>;
}

// AI 助手相关接口
export interface AIAssistantCapability {
  name: string;
  description: string;
  supportedTypes: ContentType[];
  icon: string;
  component: React.ComponentType<object>;
}
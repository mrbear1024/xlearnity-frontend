import { useState, useCallback, useMemo } from 'react';
import { LearningContent, ContentType, LearningSession } from '@/types/learning';

// 内容管理器钩子 - 使用控制反转原则
export const useContentManager = () => {
  const [currentContent, setCurrentContent] = useState<LearningContent | null>(null);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载内容的抽象方法
  const loadContent = useCallback(async (contentId: string, type: ContentType) => {
    setLoading(true);
    setError(null);
    
    try {
      // 这里将根据内容类型调用不同的加载策略
      const content = await loadContentByType(contentId, type);
      setCurrentContent(content);
      
      // 创建或恢复学习会话
      const session = await createOrRestoreSession(content);
      setCurrentSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载内容失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新学习进度
  const updateProgress = useCallback(async (progress: number, position?: any) => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      progress,
      lastPosition: position,
      updatedAt: new Date(),
    };
    
    setCurrentSession(updatedSession);
    // 这里会调用 API 保存进度
    await saveSessionProgress(updatedSession);
  }, [currentSession]);

  // 添加笔记
  const addNote = useCallback(async (content: string, position?: any, type: 'note' | 'highlight' | 'question' = 'note') => {
    if (!currentSession) return;
    
    const note = {
      id: generateId(),
      content,
      position,
      type,
      createdAt: new Date(),
    };
    
    const updatedSession = {
      ...currentSession,
      notes: [...currentSession.notes, note],
      updatedAt: new Date(),
    };
    
    setCurrentSession(updatedSession);
    await saveSessionProgress(updatedSession);
  }, [currentSession]);

  return {
    currentContent,
    currentSession,
    loading,
    error,
    loadContent,
    updateProgress,
    addNote,
    // 计算属性
    contentType: currentContent?.type,
    isVideoContent: currentContent?.type === 'video',
    isPDFContent: currentContent?.type === 'pdf',
    isMarkdownContent: currentContent?.type === 'markdown',
    isChatContent: currentContent?.type === 'chat',
  };
};

// 内容加载策略 - 控制反转实现
const contentLoaders: Record<ContentType, (id: string) => Promise<LearningContent>> = {
  video: async (id: string) => {
    // 视频内容加载逻辑
    const response = await fetch(`/api/content/video/${id}`);
    return response.json();
  },
  pdf: async (id: string) => {
    // PDF 内容加载逻辑
    const response = await fetch(`/api/content/pdf/${id}`);
    return response.json();
  },
  markdown: async (id: string) => {
    // Markdown 内容加载逻辑
    const response = await fetch(`/api/content/markdown/${id}`);
    return response.json();
  },
  chat: async (id: string) => {
    // 聊天内容加载逻辑
    const response = await fetch(`/api/content/chat/${id}`);
    return response.json();
  },
};

async function loadContentByType(id: string, type: ContentType): Promise<LearningContent> {
  const loader = contentLoaders[type];
  if (!loader) {
    throw new Error(`不支持的内容类型: ${type}`);
  }
  return loader(id);
}

async function createOrRestoreSession(content: LearningContent): Promise<LearningSession> {
  // 创建或恢复学习会话的逻辑
  return {
    id: generateId(),
    contentId: content.id,
    contentType: content.type,
    progress: 0,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function saveSessionProgress(session: LearningSession): Promise<void> {
  // 保存会话进度的逻辑
  await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  });
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useChat } from "@/contexts/ChatContext";
import { useVideoLearning } from "@/hooks/useVideoLearning";
import { ChatMessage } from "@/types/chat";

export const useLearningSpace = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'video';
  const initialMessage = searchParams.get('message') || '';
  const sessionId = searchParams.get('sessionId');

  const [activeTab, setActiveTab] = useState("chapters");
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  
  // 跟踪是否已经处理过初始消息
  const initialMessageProcessed = useRef(false);
  const lastInitialMessage = useRef<string | null>(null);

  // 使用聊天上下文
  const { 
    state: chatState, 
    createSession, 
    switchSession, 
    sendMessage,
    generateSessionTitle 
  } = useChat();

  // 使用视频学习hook
  const videoLearning = useVideoLearning();

  // 处理聊天会话
  useEffect(() => {
    if (mode === 'chat') {
      if (sessionId) {
        switchSession(sessionId);
      } else if (initialMessage && !initialMessageProcessed.current && initialMessage !== lastInitialMessage.current) {
        // 只有当前没有处理过这个初始消息时才创建新会话
        const newSession = createSession(initialMessage);
        generateSessionTitle(newSession.id);
        initialMessageProcessed.current = true;
        lastInitialMessage.current = initialMessage;
      }
    }
  }, [mode, sessionId, initialMessage, switchSession, createSession, generateSessionTitle]);

  // 当模式或会话ID改变时重置初始消息处理标志
  useEffect(() => {
    if (mode !== 'chat' || sessionId) {
      initialMessageProcessed.current = false;
      lastInitialMessage.current = null;
    }
  }, [mode, sessionId]);

  // 获取当前聊天消息
  const chatMessages = mode === 'chat' ? chatState.currentMessages : [
    {
      id: `default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "ai" as const,
      content: "Content processing completed successfully",
      timestamp: new Date()
    }
  ];

  // 设置聊天消息
  const setChatMessages = (messages: ChatMessage[]) => {
    // 这个功能现在由ChatContext处理
    console.log('setChatMessages called with:', messages);
  };

  const isLoading = mode !== 'chat' && videoLearning.isLoading;
  const title = mode === 'chat' ? "AI学习助手" : videoLearning.title;

  return {
    mode,
    activeTab,
    setActiveTab,
    isAddContentDialogOpen,
    setIsAddContentDialogOpen,
    activeRightTab,
    setActiveRightTab,
    chatMessage,
    setChatMessage,
    chatMessages,
    setChatMessages,
    isLoading,
    title,
    chatSessions: chatState.sessions,
    currentSessionId: chatState.currentSessionId,
    setCurrentSessionId: switchSession,
    
    // 视频学习相关
    ...videoLearning,
  };
};

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatMessage, ChatSession } from '@/types/chat';

// 聊天状态接口
interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
}

// 聊天动作类型
type ChatAction =
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'ADD_SESSION'; payload: ChatSession }
  | { type: 'UPDATE_SESSION'; payload: { id: string; updates: Partial<ChatSession> } }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'SET_CURRENT_SESSION'; payload: string | null }
  | { type: 'SET_CURRENT_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_CURRENT_SESSION' }
  | { type: 'RESET_STATE' };

// 初始状态
const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  currentMessages: [],
  isLoading: false,
  error: null,
  isTyping: false,
};

// 状态reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    
    case 'ADD_SESSION':
      return { 
        ...state, 
        sessions: [action.payload, ...state.sessions] 
      };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id
            ? { ...session, ...action.payload.updates }
            : session
        )
      };
    
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload),
        currentSessionId: state.currentSessionId === action.payload ? null : state.currentSessionId,
        currentMessages: state.currentSessionId === action.payload ? [] : state.currentMessages
      };
    
    case 'SET_CURRENT_SESSION':
      const session = state.sessions.find(s => s.id === action.payload);
      return {
        ...state,
        currentSessionId: action.payload,
        currentMessages: session ? session.messages : []
      };
    
    case 'SET_CURRENT_MESSAGES':
      return { ...state, currentMessages: action.payload };
    
    case 'ADD_MESSAGE':
      const updatedMessages = [...state.currentMessages, action.payload];
      return {
        ...state,
        currentMessages: updatedMessages,
        sessions: state.currentSessionId ? state.sessions.map(session =>
          session.id === state.currentSessionId
            ? { ...session, messages: updatedMessages, updatedAt: new Date() }
            : session
        ) : state.sessions
      };
    
    case 'UPDATE_MESSAGE':
      const messagesAfterUpdate = state.currentMessages.map(msg =>
        msg.id === action.payload.id
          ? { ...msg, ...action.payload.updates }
          : msg
      );
      return {
        ...state,
        currentMessages: messagesAfterUpdate,
        sessions: state.currentSessionId ? state.sessions.map(session =>
          session.id === state.currentSessionId
            ? { ...session, messages: messagesAfterUpdate, updatedAt: new Date() }
            : session
        ) : state.sessions
      };
    
    case 'DELETE_MESSAGE':
      const messagesAfterDelete = state.currentMessages.filter(msg => msg.id !== action.payload);
      return {
        ...state,
        currentMessages: messagesAfterDelete,
        sessions: state.currentSessionId ? state.sessions.map(session =>
          session.id === state.currentSessionId
            ? { ...session, messages: messagesAfterDelete, updatedAt: new Date() }
            : session
        ) : state.sessions
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'CLEAR_CURRENT_SESSION':
      return {
        ...state,
        currentSessionId: null,
        currentMessages: []
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
};

// 上下文接口
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  // 便捷方法
  createSession: (initialMessage?: string) => ChatSession;
  switchSession: (sessionId: string) => void;
  sendMessage: (content: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  deleteSession: (sessionId: string) => void;
  clearCurrentSession: () => void;
  generateSessionTitle: (sessionId: string) => Promise<void>;
}

// 创建上下文
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 上下文提供者组件
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // 从localStorage加载会话
  useEffect(() => {
    const storedSessions = localStorage.getItem('chat_sessions');
    if (storedSessions) {
      const sessions = JSON.parse(storedSessions).map((session: ChatSession) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
    }
  }, []);

  // 保存会话到localStorage
  useEffect(() => {
    if (state.sessions.length > 0) {
      localStorage.setItem('chat_sessions', JSON.stringify(state.sessions));
    }
  }, [state.sessions]);

  // 创建新会话
  const createSession = (initialMessage?: string): ChatSession => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "新会话",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (initialMessage) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: initialMessage,
        timestamp: new Date()
      };
      newSession.messages.push(userMessage);
    }

    dispatch({ type: 'ADD_SESSION', payload: newSession });
    dispatch({ type: 'SET_CURRENT_SESSION', payload: newSession.id });
    
    return newSession;
  };

  // 切换会话
  const switchSession = (sessionId: string) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: sessionId });
  };

  // 发送消息
  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // 如果没有当前会话，创建新会话
    if (!state.currentSessionId) {
      createSession(content);
      return;
    }

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_TYPING', payload: true });

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "感谢您的问题！我正在处理您的请求...",
        timestamp: new Date()
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      dispatch({ type: 'SET_TYPING', payload: false });
    }, 1000);
  };

  // 更新会话标题
  const updateSessionTitle = (sessionId: string, title: string) => {
    dispatch({ 
      type: 'UPDATE_SESSION', 
      payload: { id: sessionId, updates: { title } }
    });
  };

  // 删除会话
  const deleteSession = (sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: sessionId });
  };

  // 清空当前会话
  const clearCurrentSession = () => {
    dispatch({ type: 'CLEAR_CURRENT_SESSION' });
  };

  // 生成会话标题
  const generateSessionTitle = async (sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session || session.messages.length === 0) return;

    const firstUserMessage = session.messages.find(msg => msg.type === 'user');
    if (!firstUserMessage) return;

    // 模拟AI生成标题
    const generatedTitle = `会话: ${firstUserMessage.content.substring(0, 20)}...`;
    
    setTimeout(() => {
      updateSessionTitle(sessionId, generatedTitle);
    }, 2000);
  };

  const contextValue: ChatContextType = {
    state,
    dispatch,
    createSession,
    switchSession,
    sendMessage,
    updateSessionTitle,
    deleteSession,
    clearCurrentSession,
    generateSessionTitle,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// 自定义hook
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// 导出上下文
export { ChatContext }; 
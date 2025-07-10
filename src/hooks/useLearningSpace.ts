import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript, useAddRecentActivity } from "@/hooks/useApi";
import { extractVideoId } from "@/utils/youtube";
import { ChatMessage, ChatSession } from "@/types/chat";

export const useLearningSpace = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';
  const mode = searchParams.get('mode') || 'video';
  const initialMessage = searchParams.get('message') || '';
  const sessionId = searchParams.get('sessionId'); // New: Get sessionId from URL

  const [activeTab, setActiveTab] = useState("chapters");
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [realTimeChapters, setRealTimeChapters] = useState<VideoChapter[]>([]);
  const [realTimeTranscript, setRealTimeTranscript] = useState<VideoTranscript[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const storedSessions = localStorage.getItem('chat_sessions');
    return storedSessions ? JSON.parse(storedSessions) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (mode === 'chat') {
      if (sessionId) {
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
          return session.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      } else {
        const storedMessages = sessionStorage.getItem('chat_history');
        if (storedMessages) {
          return JSON.parse(storedMessages).map((msg: ChatMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      }
    }

    const messages: ChatMessage[] = [
      {
        id: "1",
        type: "ai",
        content: mode === 'chat' ? "我是YouLearn的AI助手，很高兴为您提供学习帮助！您想了解什么呢？" : "Content processing completed successfully",
        timestamp: new Date()
      }
    ];
    
    if (initialMessage) {
      messages.unshift({
        id: "0",
        type: "user",
        content: initialMessage,
        timestamp: new Date()
      });
    }
    
    return messages;
  });

  // Save chat messages to sessionStorage whenever they change
  useEffect(() => {
    if (mode === 'chat') {
      sessionStorage.setItem('chat_history', JSON.stringify(chatMessages));

      // Update current session in localStorage
      if (currentSessionId) {
        setChatSessions(prevSessions => prevSessions.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: chatMessages, updatedAt: new Date() } 
            : session
        ));
      }
    }
  }, [chatMessages, mode, currentSessionId]);

  // Persist chat sessions to localStorage
  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Create new session if in chat mode and no sessionId is present
  useEffect(() => {
    if (mode === 'chat' && !sessionId && chatMessages.length > 0 && !currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "新会话", // Placeholder title
        messages: chatMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChatSessions(prevSessions => [newSession, ...prevSessions]);
      setCurrentSessionId(newSession.id);
    }
  }, [mode, sessionId, chatMessages, currentSessionId]);

  // Simulate title generation
  const generateSessionTitle = useCallback(async (messages: ChatMessage[], sessionId: string) => {
    // In a real application, this would call an AI service
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    const generatedTitle = firstUserMessage ? `会话: ${firstUserMessage.content.substring(0, 20)}...` : "新会话";

    setTimeout(() => {
      setChatSessions(prevSessions => prevSessions.map(session => 
        session.id === sessionId 
          ? { ...session, title: generatedTitle } 
          : session
      ));
    }, 2000); // Simulate API call delay
  }, []);

  // Trigger title generation when a new session is created or first message is sent
  useEffect(() => {
    if (currentSessionId && chatMessages.length > 1 && chatSessions.find(s => s.id === currentSessionId)?.title === "新会话") {
      generateSessionTitle(chatMessages, currentSessionId);
    }
  }, [currentSessionId, chatMessages, chatSessions, generateSessionTitle]);

  const videoId = extractVideoId(videoUrl);

  const { data: videoInfo, isLoading: videoInfoLoading } = useYouTubeVideoInfo(videoUrl);
  const { data: chapters, isLoading: chaptersLoading } = useVideoChapters(videoId || 'default');
  const { data: transcript, isLoading: transcriptLoading } = useVideoTranscript(videoId || 'default');
  const addRecentActivityMutation = useAddRecentActivity();

  const handleTitleLoaded = (title: string) => {
    setVideoTitle(title);
    if (videoUrl && mode !== 'chat') {
      addRecentActivityMutation.mutate({
        title: title,
        url: videoUrl
      });
    }
  };

  const handleChaptersLoaded = (chapters: VideoChapter[]) => {
    setRealTimeChapters(chapters);
  };

  const handleTranscriptLoaded = (transcript: VideoTranscript[]) => {
    setRealTimeTranscript(transcript);
  };

  useEffect(() => {
    if (videoInfo?.title && videoUrl && mode !== 'chat' && !videoTitle) {
      setVideoTitle(videoInfo.title);
      addRecentActivityMutation.mutate({
        title: videoInfo.title,
        url: videoUrl
      });
    }
  }, [videoInfo?.title, videoUrl, mode, videoTitle, addRecentActivityMutation]);

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  const handleChapterClick = (startSeconds: number) => {
    if (videoId) {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.src.includes('youtube.com')) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`;
        window.open(youtubeUrl, '_blank');
      }
    }
  };

  const handleTranscriptClick = (startSeconds: number) => {
    handleChapterClick(startSeconds);
  };

  const isLoading = mode !== 'chat' && (videoInfoLoading || chaptersLoading);
  const title = mode === 'chat' ? "AI学习助手" : (videoTitle || videoInfo?.title || "加载中...");

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
    videoTitle,
    realTimeChapters,
    realTimeTranscript,
    chatMessages,
    setChatMessages,
    videoInfo,
    videoInfoLoading,
    chapters,
    chaptersLoading,
    transcript,
    transcriptLoading,
    handleTitleLoaded,
    handleChaptersLoaded,
    handleTranscriptLoaded,
    embedUrl,
    handleChapterClick,
    handleTranscriptClick,
    isLoading,
    title,
    videoUrl,
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
  };
};

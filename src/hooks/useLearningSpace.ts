import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript, useAddRecentActivity } from "@/hooks/useApi";
import { extractVideoId } from "@/utils/youtube";
import { ChatMessage } from "@/types/chat";
import { VideoChapter, VideoTranscript } from "@/types/youtube";

export const useLearningSpace = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';
  const mode = searchParams.get('mode') || 'video';
  const initialMessage = searchParams.get('message') || '';

  const [activeTab, setActiveTab] = useState("chapters");
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [realTimeChapters, setRealTimeChapters] = useState<VideoChapter[]>([]);
  const [realTimeTranscript, setRealTimeTranscript] = useState<VideoTranscript[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
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
    videoUrl
  };
};

import { useState, useEffect, useCallback } from "react";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript, useAddRecentActivity } from "@/hooks/useApi";
import { extractVideoId } from "@/utils/youtube";
import { apiService } from "@/services/api";

export const useVideoLearning = (contentId?: string | null, videoUrl?: string) => {
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [realTimeChapters, setRealTimeChapters] = useState<any[]>([]);
  const [realTimeTranscript, setRealTimeTranscript] = useState<any[]>([]);
  
  const videoId = extractVideoId(videoUrl || '');
  
  const { data: videoInfo, isLoading: videoInfoLoading } = useYouTubeVideoInfo(videoUrl || '');
  const { data: chapters, isLoading: chaptersLoading } = useVideoChapters(videoId || 'default');
  const { data: transcript, isLoading: transcriptLoading } = useVideoTranscript(videoId || 'default');
  const addRecentActivityMutation = useAddRecentActivity();

  // 重置状态函数
  const resetState = useCallback(() => {
    setVideoTitle("");
    setRealTimeChapters([]);
    setRealTimeTranscript([]);
  }, []);

  const handleTitleLoaded = useCallback((title: string) => {
    setVideoTitle(title);
    if (videoUrl) {
      addRecentActivityMutation.mutate({
        title: title,
        url: videoUrl
      });
    }
  }, [videoUrl, addRecentActivityMutation]);

  const handleChaptersLoaded = useCallback((chapters: any[]) => {
    setRealTimeChapters(chapters);
  }, []);

  const handleTranscriptLoaded = useCallback((transcript: any[]) => {
    setRealTimeTranscript(transcript);
  }, []);

  // 当contentId或videoUrl改变时重置状态并重新加载
  useEffect(() => {
    resetState();
    
    if (!contentId) return;
    
    async function fetchContent() {
      try {
        const content = await apiService.getContent(contentId);
        
        // 拉取字幕
        if (content.meta.captions_url) {
          const captionsRes = await fetch(content.meta.captions_url);
          const captionsData = await captionsRes.json();
          setRealTimeTranscript(captionsData);
        } else {
          setRealTimeTranscript([]);
        }

        // 拉取章节
        if (content.meta.video_info_url) {
          const videoInfoRes = await fetch(content.meta.video_info_url);
          const videoInfoData = await videoInfoRes.json();
          setRealTimeChapters(videoInfoData.chapters || []);
          setVideoTitle(videoInfoData.title);
        } else {
          setRealTimeChapters([]);
        }
      } catch (error) {
        console.error("拉取内容失败: ", error);
        setRealTimeTranscript([]);
        setRealTimeChapters([]);
      }
    }
    
    fetchContent();
  }, [contentId, resetState]);

  useEffect(() => {
    if (videoInfo?.title && videoUrl && !videoTitle) {
      setVideoTitle(videoInfo.title);
      addRecentActivityMutation.mutate({
        title: videoInfo.title,
        url: videoUrl
      });
    }
  }, [videoInfo?.title, videoUrl, videoTitle, addRecentActivityMutation]);

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  const handleChapterClick = useCallback((startSeconds: number) => {
    if (videoId) {
      // 处理章节点击逻辑
    }
  }, [videoId]);

  const handleTranscriptClick = useCallback((startSeconds: number) => {
    // handleChapterClick(startSeconds);
  }, [handleChapterClick]);

  const isLoading = videoInfoLoading || chaptersLoading;
  const title = videoTitle || videoInfo?.title || "加载中...";

  return {
    videoUrl,
    videoId,
    videoTitle,
    realTimeChapters,
    realTimeTranscript,
    videoInfo,
    videoInfoLoading,
    chapters: realTimeChapters,
    chaptersLoading,
    transcript: realTimeTranscript,
    transcriptLoading,
    handleTitleLoaded,
    handleChaptersLoaded,
    handleTranscriptLoaded,
    embedUrl,
    handleChapterClick,
    handleTranscriptClick,
    isLoading,
    title,
  };
}; 
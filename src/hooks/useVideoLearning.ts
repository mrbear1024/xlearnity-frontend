import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript, useAddRecentActivity } from "@/hooks/useApi";
import { extractVideoId } from "@/utils/youtube";

export const useVideoLearning = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';
  
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [realTimeChapters, setRealTimeChapters] = useState<any[]>([]);
  const [realTimeTranscript, setRealTimeTranscript] = useState<any[]>([]);
  
  const videoId = extractVideoId(videoUrl);
  
  const { data: videoInfo, isLoading: videoInfoLoading } = useYouTubeVideoInfo(videoUrl);
  const { data: chapters, isLoading: chaptersLoading } = useVideoChapters(videoId || 'default');
  const { data: transcript, isLoading: transcriptLoading } = useVideoTranscript(videoId || 'default');
  const addRecentActivityMutation = useAddRecentActivity();

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
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.src.includes('youtube.com')) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`;
        window.open(youtubeUrl, '_blank');
      }
    }
  }, [videoId]);

  const handleTranscriptClick = useCallback((startSeconds: number) => {
    handleChapterClick(startSeconds);
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
  };
}; 
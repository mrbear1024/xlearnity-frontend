import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript, useAddRecentActivity } from "@/hooks/useApi";
import { extractVideoId } from "@/utils/youtube";
import { apiService } from "@/services/api"; // 确保有正确的 apiService 引入

export const useVideoLearning = () => {
  const [searchParams] = useSearchParams();
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [realTimeChapters, setRealTimeChapters] = useState<any[]>([]);
  const [realTimeTranscript, setRealTimeTranscript] = useState<any[]>([]);
  
  const contentId = searchParams.get("content_id");
  let videoUrl = searchParams.get('url') || '';
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
    console.log('transcript：：：', transcript);
    setRealTimeTranscript(transcript);
  }, []);

  useEffect(() => {
    if (!contentId) return;
    async function fetchContent() {
      const content = await apiService.getContent(contentId);
      // 拉取字幕
      if (content.meta.captions_url) {
        fetch(content.meta.captions_url)
          .then(res => res.json())
          .then(data => {
            setRealTimeTranscript(data);
          })
          .catch(error => {
            console.error("拉取 captionsUrl 失败: ", error);
            setRealTimeTranscript([]); 
          });
      }else {
        setRealTimeTranscript([]);
      }

      // 拉取章节
      if (content.meta.video_info_url) {
        fetch(content.meta.video_info_url)
          .then(res => res.json())
          .then(data => {
            setRealTimeChapters(data.chapters || []);
            setVideoTitle(data.title);
          })
          .catch(error => {
            console.error("拉取 videoInfoUrl 失败: ", error);
            setRealTimeChapters([]); // 改为空数组而不是 null
            setVideoTitle(null);
          });
          if (videoUrl.length == 0) {
            videoUrl = content.meta.video_url;
          }
      }else {
        setRealTimeChapters([]);
      }

      
    }
    fetchContent();
  }, [contentId]);


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
      // const iframe = document.querySelector('iframe');
      // if (iframe && iframe.src.includes('youtube.com')) {
      //   const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`;
      //   window.open(youtubeUrl, '_blank');
      // }
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
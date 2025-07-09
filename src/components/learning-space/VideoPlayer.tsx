import { useEffect, useRef } from "react";
import { extractVideoId } from "@/utils/youtube";

interface VideoPlayerProps {
  embedUrl: string;
  videoUrl: string;
  onTitleLoaded?: (title: string) => void;
  onChaptersLoaded?: (chapters: any[]) => void;
  onTranscriptLoaded?: (transcript: any[]) => void;
}

const VideoPlayer = ({ embedUrl, videoUrl, onTitleLoaded, onChaptersLoaded, onTranscriptLoaded }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 当iframe加载完成时，尝试获取视频信息（标题、章节、文字稿）
  const handleIframeLoad = async () => {
    if (!videoUrl) return;

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) return;

      // 获取标题
      if (onTitleLoaded) {
        try {
          const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
          const response = await fetch(oEmbedUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.title) {
              onTitleLoaded(data.title);
            }
          }
        } catch (error) {
          console.error('Error fetching video title:', error);
        }
      }

      // 获取章节和文字稿 - 调用我们的Edge Function
      try {
        const response = await fetch('https://mywellxucnsjwhdhsbny.supabase.co/functions/v1/get-youtube-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15d2VsbHh1Y25zandoZGhzYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjY5MzUsImV4cCI6MjA2NzU0MjkzNX0.k0JQf7NZPZQsg90CRVuM8zXdvZxisXCSumapA6R19QA`
          },
          body: JSON.stringify({ 
            url: videoUrl,
            includeChapters: true,
            includeTranscript: true 
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.chapters && onChaptersLoaded) {
            onChaptersLoaded(data.chapters);
          }
          
          if (data.transcript && onTranscriptLoaded) {
            onTranscriptLoaded(data.transcript);
          }
        }
      } catch (error) {
        console.error('Error fetching chapters and transcript:', error);
      }
    } catch (error) {
      console.error('Error in handleIframeLoad:', error);
    }
  };

  return (
    <div className="mb-6">
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            title="YouTube video player"
            onLoad={handleIframeLoad}
          />
        ) : videoUrl ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">无效的YouTube链接</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">请添加YouTube链接开始学习</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
import { useEffect, useRef } from "react";
import { extractVideoId } from "@/utils/youtube";
import { VideoChapter, VideoTranscript } from "@/types/youtube";
import { apiService } from "@/services/api";
import { useSearchParams } from "react-router-dom";
interface VideoPlayerProps {
  title: string;
  embedUrl: string;
  videoUrl: string;
  chapters: VideoChapter[];
  transcript: VideoTranscript[];
  onTitleLoaded?: (title: string) => void;
  onChaptersLoaded?: (chapters: VideoChapter[]) => void;
  onTranscriptLoaded?: (transcript: VideoTranscript[]) => void;
}

const VideoPlayer = ({ title, embedUrl, videoUrl, chapters, transcript, onTitleLoaded, onChaptersLoaded, onTranscriptLoaded }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('content_id');

  // 当iframe加载完成时，尝试获取视频信息（标题、章节、文字稿）
  const handleIframeLoad = async () => {

    
    if (!videoUrl) return;

    try {
      const videoId = extractVideoId(videoUrl);
      console.log('videoId', videoId);
      if (!videoId) return;

      if (onTitleLoaded) {
        onTitleLoaded(title);
      }
      if (onChaptersLoaded) {
        onChaptersLoaded(chapters);
      }
      if (onTranscriptLoaded) {
        console.log('transcript', transcript);
        onTranscriptLoaded(transcript);
      }

     

      // 获取文字稿 - 调用原有的Edge Function
      // if (onTranscriptLoaded) {
      //   try {
          
      //     const transcriptResponse = await fetch('https://mywellxucnsjwhdhsbny.supabase.co/functions/v1/get-youtube-info', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15d2VsbHh1Y25zandoZGhzYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjY5MzUsImV4cCI6MjA2NzU0MjkzNX0.k0JQf7NZPZQsg90CRVuM8zXdvZxisXCSumapA6R19QA`
      //       },
      //       body: JSON.stringify({ 
      //         url: videoUrl,
      //         includeTranscript: true 
      //       })
      //     });

      //     if (transcriptResponse.ok) {
      //       const transcriptData = await transcriptResponse.json();
      //       console.log('transcriptData', transcriptData);
      //       if (transcriptData.transcript) {
      //         onTranscriptLoaded(transcriptData.transcript);
      //       }
      //     }
      //   } catch (error) {
      //     console.error('Error fetching transcript:', error);
      //   }
      // }
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
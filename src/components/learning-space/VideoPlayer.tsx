import { useEffect, useRef } from "react";
import { extractVideoId } from "@/utils/youtube";

interface VideoPlayerProps {
  embedUrl: string;
  videoUrl: string;
  onTitleLoaded?: (title: string) => void;
}

const VideoPlayer = ({ embedUrl, videoUrl, onTitleLoaded }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 当iframe加载完成时，尝试获取视频标题
  const handleIframeLoad = async () => {
    if (!videoUrl || !onTitleLoaded) return;

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) return;

      // 由于跨域限制，我们无法直接从iframe读取内容
      // 但可以使用YouTube的oEmbed API来获取视频信息
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
      
      const response = await fetch(oEmbedUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.title) {
          onTitleLoaded(data.title);
        }
      }
    } catch (error) {
      console.error('Error fetching video title from oEmbed:', error);
      
      // 备用方案：尝试从YouTube页面获取标题
      try {
        const response = await fetch(`https://www.youtube.com/watch?v=${extractVideoId(videoUrl)}`, {
          mode: 'no-cors'
        });
        // 由于no-cors模式，我们无法读取响应内容，但可以触发其他逻辑
      } catch (err) {
        console.error('Fallback title fetch failed:', err);
      }
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
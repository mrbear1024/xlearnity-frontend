interface VideoPlayerProps {
  embedUrl: string;
  videoUrl: string;
}

const VideoPlayer = ({ embedUrl, videoUrl }: VideoPlayerProps) => {
  return (
    <div className="mb-6">
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            title="YouTube video player"
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
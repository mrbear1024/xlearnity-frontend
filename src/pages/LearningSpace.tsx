import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript } from "@/hooks/useApi";
import { extractVideoId } from "@/utils/youtube";
import Sidebar from "@/components/Sidebar";
import AddContentDialog from "@/components/AddContentDialog";
import LearningSpaceHeader from "@/components/learning-space/LearningSpaceHeader";
import VideoPlayer from "@/components/learning-space/VideoPlayer";
import ContentTabs from "@/components/learning-space/ContentTabs";
import AIAssistantSidebar from "@/components/learning-space/AIAssistantSidebar";
import LoadingSkeleton from "@/components/learning-space/LoadingSkeleton";

const LearningSpace = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';
  const [activeTab, setActiveTab] = useState("chapters");
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Content processing completed successfully"
    }
  ]);
  
  // 获取视频ID
  const videoId = extractVideoId(videoUrl);
  
  // 使用API钩子获取YouTube相关数据
  const { data: videoInfo, isLoading: videoInfoLoading } = useYouTubeVideoInfo(videoUrl);
  const { data: chapters, isLoading: chaptersLoading } = useVideoChapters(videoId || 'default');
  const { data: transcript, isLoading: transcriptLoading } = useVideoTranscript(videoId || 'default');

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  // 处理章节点击，跳转到对应时间
  const handleChapterClick = (startSeconds: number) => {
    if (videoId) {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.src.includes('youtube.com')) {
        // 在新窗口打开YouTube视频，并跳转到指定时间
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`;
        window.open(youtubeUrl, '_blank');
      }
    }
  };

  // 处理字幕点击，跳转到对应时间
  const handleTranscriptClick = (startSeconds: number) => {
    handleChapterClick(startSeconds);
  };

  if (videoInfoLoading || chaptersLoading) {
    return <LoadingSkeleton />;
  }

  const title = videoInfo?.title || "加载中...";

  return (
    <div className="min-h-screen bg-background">
      <LearningSpaceHeader title={title} />

      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar onAddContent={() => setIsAddContentDialogOpen(true)} />
        
        {/* Main Content Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Main Content */}
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="p-6">
              <VideoPlayer embedUrl={embedUrl} videoUrl={videoUrl} />
              
              <ContentTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                chapters={chapters}
                transcript={transcript}
                chaptersLoading={chaptersLoading}
                transcriptLoading={transcriptLoading}
                onChapterClick={handleChapterClick}
                onTranscriptClick={handleTranscriptClick}
              />
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Right Sidebar - AI Learning Assistant */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <AIAssistantSidebar
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatMessages={chatMessages}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Add Content Dialog */}
      <AddContentDialog 
        open={isAddContentDialogOpen} 
        onOpenChange={setIsAddContentDialogOpen}
      />
    </div>
  );
};

export default LearningSpace;
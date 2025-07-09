import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript, useAddRecentActivity } from "@/hooks/useApi";
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
  const mode = searchParams.get('mode') || 'video'; // 新增：支持不同模式
  const initialMessage = searchParams.get('message') || '';
  const [activeTab, setActiveTab] = useState("chapters");
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(() => {
    // 如果有初始消息，则添加到聊天记录中
    const messages = [
      {
        id: 1,
        type: "ai",
        content: mode === 'chat' ? "我是YouLearn的AI助手，很高兴为您提供学习帮助！您想了解什么呢？" : "Content processing completed successfully"
      }
    ];
    
    if (initialMessage) {
      messages.unshift({
        id: 0,
        type: "user",
        content: initialMessage
      });
    }
    
    return messages;
  });
  
  // 获取视频ID
  const videoId = extractVideoId(videoUrl);
  
  // 使用API钩子获取YouTube相关数据
  const { data: videoInfo, isLoading: videoInfoLoading } = useYouTubeVideoInfo(videoUrl);
  const { data: chapters, isLoading: chaptersLoading } = useVideoChapters(videoId || 'default');
  const { data: transcript, isLoading: transcriptLoading } = useVideoTranscript(videoId || 'default');
  const addRecentActivityMutation = useAddRecentActivity();

  // 当视频信息加载完成后，自动添加到近期活动
  useEffect(() => {
    if (videoInfo && videoUrl && mode !== 'chat') {
      addRecentActivityMutation.mutate({
        title: videoInfo.title,
        url: videoUrl
      });
    }
  }, [videoInfo, videoUrl, mode]);

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

  // 在聊天模式下不需要加载视频相关数据
  if (mode !== 'chat' && (videoInfoLoading || chaptersLoading)) {
    return <LoadingSkeleton />;
  }

  const title = mode === 'chat' ? "AI学习助手" : (videoInfo?.title || "加载中...");

  return (
    <div className="min-h-screen bg-background">
      <LearningSpaceHeader title={title} />

      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar onAddContent={() => setIsAddContentDialogOpen(true)} />
        
        {/* Main Content Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* 在聊天模式下隐藏主内容区域 */}
          {mode !== 'chat' && (
            <>
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
            </>
          )}

          {/* Right Sidebar - AI Learning Assistant - 在聊天模式下占据全宽 */}
          <ResizablePanel 
            defaultSize={mode === 'chat' ? 100 : 30} 
            minSize={mode === 'chat' ? 100 : 20} 
            maxSize={mode === 'chat' ? 100 : 50}
          >
            <AIAssistantSidebar
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
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
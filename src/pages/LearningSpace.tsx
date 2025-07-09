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
          {/* Main Content */}
          <ResizablePanel defaultSize={mode === 'chat' ? 70 : 70} minSize={30}>
            <div className="p-6">
              {/* 在聊天模式下隐藏视频播放器和内容标签 */}
              {mode !== 'chat' && (
                <>
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
                </>
              )}
              
              {/* 在聊天模式下显示欢迎界面 */}
              {mode === 'chat' && (
                <div className="flex items-center justify-center h-full min-h-[60vh]">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.405L3 21l1.405-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">开始与AI助手对话</h2>
                    <p className="text-muted-foreground mb-6">
                      我可以帮助您学习任何主题，回答问题，或者协助您分析学习内容。请在右侧聊天区域开始对话。
                    </p>
                  </div>
                </div>
              )}
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
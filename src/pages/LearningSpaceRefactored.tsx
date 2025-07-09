import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ContentType } from "@/types/learning";
import { LayoutConfig } from "@/types/ui";
import { useContentManager } from "@/hooks/useContentManager";
import Sidebar from "@/components/Sidebar";
import AddContentDialog from "@/components/AddContentDialog";
import LearningSpaceHeader from "@/components/learning-space/LearningSpaceHeader";
import ContentRenderer from "@/components/learning/ContentRenderer";
import LearningToolsPanel from "@/components/learning/LearningToolsPanel";
import ResponsiveLayout from "@/components/common/ResponsiveLayout";
import LoadingSkeleton from "@/components/learning-space/LoadingSkeleton";

const LearningSpaceRefactored = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';
  const mode = (searchParams.get('mode') || 'video') as ContentType;
  const initialMessage = searchParams.get('message') || '';
  
  // 状态管理
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(() => {
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

  // 使用内容管理器
  const {
    currentContent,
    currentSession,
    loading,
    error,
    loadContent,
    updateProgress,
    addNote,
    contentType,
    isChatContent,
  } = useContentManager();

  // 布局配置 - 根据内容类型调整
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => ({
    showSidebar: true,
    showRightPanel: true,
    layout: mode === 'chat' ? 'dual' : 'triple',
    rightPanelWidth: mode === 'chat' ? 100 : 30,
  }));

  // 初始化内容加载
  useEffect(() => {
    if (mode === 'chat') {
      // 聊天模式下创建虚拟内容
      const chatContent = {
        id: 'chat-session',
        title: "AI学习助手",
        type: 'chat' as const,
        messages: chatMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // 这里应该调用 loadContent，但为了演示，我们直接设置布局
      setLayoutConfig(prev => ({
        ...prev,
        layout: 'dual',
        rightPanelWidth: 100,
      }));
    } else if (videoUrl) {
      // 视频模式下加载视频内容
      loadContent('video-' + extractVideoId(videoUrl), 'video');
    }
  }, [mode, videoUrl, loadContent]);

  // 处理聊天消息发送
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        type: "user",
        content: chatMessage.trim()
      };
      
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "感谢您的问题！我正在处理您的请求..."
      };
      
      setChatMessages([...chatMessages, userMessage, aiMessage]);
      setChatMessage('');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">加载失败</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const title = mode === 'chat' ? "AI学习助手" : (currentContent?.title || "学习空间");

  return (
    <div className="min-h-screen bg-background">
      <LearningSpaceHeader title={title} />

      <ResponsiveLayout
        config={layoutConfig}
        onLayoutChange={setLayoutConfig}
        sidebar={
          <Sidebar onAddContent={() => setIsAddContentDialogOpen(true)} />
        }
        main={
          <div className="p-6">
            {currentContent ? (
              <ContentRenderer
                content={currentContent}
                onProgressUpdate={updateProgress}
              />
            ) : (
              // 聊天模式或没有内容时显示的占位符
              mode === 'chat' ? (
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
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">请选择学习内容</p>
                </div>
              )
            )}
          </div>
        }
        rightPanel={
          layoutConfig.showRightPanel && (
            <LearningToolsPanel
              contentType={contentType || mode}
              activeTab={activeToolTab}
              onTabChange={setActiveToolTab}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          )
        }
      />
      
      {/* Add Content Dialog */}
      <AddContentDialog 
        open={isAddContentDialogOpen} 
        onOpenChange={setIsAddContentDialogOpen}
      />
    </div>
  );
};

// 工具函数
function extractVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}

export default LearningSpaceRefactored;
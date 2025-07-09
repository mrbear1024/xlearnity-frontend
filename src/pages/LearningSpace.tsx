import { useState } from "react";
import { ArrowLeft, Clock, FileText, User, MoreHorizontal, ChevronLeft, ChevronRight, BookOpen, Zap, Brain, Eye, Send, MessageCircle, CreditCard, BarChart3, FileEdit, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useYouTubeVideoInfo, useVideoChapters, useVideoTranscript } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { extractVideoId } from "@/utils/youtube";
import Sidebar from "@/components/Sidebar";
import { Dialog } from "@/components/ui/dialog";
import AddContentDialog from "@/components/AddContentDialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const LearningSpace = () => {
  const navigate = useNavigate();
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

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

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
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <header className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </header>

        <div className="flex">
          <div className="flex-1 p-6">
            <Skeleton className="aspect-video w-full rounded-lg mb-6" />
            <div className="flex items-center gap-4 mb-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
          
          <div className="w-80 border-l border-border p-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const title = videoInfo?.title || "加载中...";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-primary/10 text-primary border-primary/30">
              升级
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar onAddContent={() => setIsAddContentDialogOpen(true)} />
        
        {/* Main Content Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Main Content */}
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="p-6">
          {/* Video Section */}
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

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="chapters" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                章节
              </TabsTrigger>
              <TabsTrigger value="transcript" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                文字稿
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="space-y-4">
              {chaptersLoading ? (
                // 章节加载骨架屏
                [...Array(4)].map((_, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-12 h-6 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                chapters?.map((chapter, index) => (
                  <div 
                    key={index} 
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleChapterClick(chapter.startSeconds)}
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        {chapter.time}
                      </Badge>
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{chapter.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="transcript">
              <div className="border border-border rounded-lg p-6">
                {transcriptLoading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex gap-3">
                        <Skeleton className="w-12 h-4" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : transcript && transcript.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-medium mb-4">视频字幕</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {transcript.map((item, index) => (
                        <div 
                          key={index}
                          className="flex gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleTranscriptClick(item.startSeconds)}
                        >
                          <Badge variant="outline" className="text-xs">
                            {item.time}
                          </Badge>
                          <p className="text-sm leading-relaxed flex-1">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">暂无字幕信息</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Right Sidebar - AI Learning Assistant */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <div className="h-full flex flex-col">
              {/* AI Assistant Header */}
              <div className="p-4 border-b border-border">
                <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="chat" className="flex flex-col items-center gap-1 text-xs">
                      <MessageCircle className="h-4 w-4" />
                      聊天
                    </TabsTrigger>
                    <TabsTrigger value="flashcards" className="flex flex-col items-center gap-1 text-xs">
                      <CreditCard className="h-4 w-4" />
                      抽认卡
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="flex flex-col items-center gap-1 text-xs">
                      <BarChart3 className="h-4 w-4" />
                      测验
                    </TabsTrigger>
                    <TabsTrigger value="summary" className="flex flex-col items-center gap-1 text-xs">
                      <FileEdit className="h-4 w-4" />
                      摘要
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col">
                <Tabs value={activeRightTab} className="flex-1 flex flex-col">
                  {/* Chat Tab */}
                  <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
                    <div className="flex-1 flex flex-col">
                      {/* AI Assistant Welcome */}
                      <div className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
                      </div>

                      {/* Learning Tools Grid */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-xs">小测验</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                            <Brain className="h-4 w-4" />
                            <span className="text-xs">思维导图</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">语音模式</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs">抽认卡</span>
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                            <FileEdit className="h-3 w-3" />
                            <span className="text-xs">抽认卡</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            <span className="text-xs">搜索</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">时间表</span>
                          </Button>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-3">
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-border">
                        <div className="flex gap-2">
                          <Input
                            placeholder="问什么都可以..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                // Handle send message
                                console.log('Send message:', chatMessage);
                                setChatMessage('');
                              }
                            }}
                          />
                          <Button size="icon" className="flex-shrink-0">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Flashcards Tab */}
                  <TabsContent value="flashcards" className="flex-1 m-0 p-4">
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">抽认卡</h3>
                      <p className="text-sm text-muted-foreground mb-4">基于视频内容创建学习卡片</p>
                      <Button>生成抽认卡</Button>
                    </div>
                  </TabsContent>

                  {/* Quiz Tab */}
                  <TabsContent value="quiz" className="flex-1 m-0 p-4">
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">测验</h3>
                      <p className="text-sm text-muted-foreground mb-4">测试您对视频内容的理解</p>
                      <Button>开始测验</Button>
                    </div>
                  </TabsContent>

                  {/* Summary Tab */}
                  <TabsContent value="summary" className="flex-1 m-0 p-4">
                    <div className="text-center py-12">
                      <FileEdit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">摘要</h3>
                      <p className="text-sm text-muted-foreground mb-4">获取视频的关键要点总结</p>
                      <Button>生成摘要</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
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
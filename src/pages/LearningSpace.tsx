import { useState } from "react";
import { ArrowLeft, Clock, FileText, User, MoreHorizontal, ChevronLeft, ChevronRight, BookOpen, Zap, Brain, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            
            {/* Video Controls */}
            <div className="flex items-center gap-4 mt-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">聊天</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">抽认卡</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">测验</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="text-sm">精要</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm">说明</span>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
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

          {/* Right Sidebar */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <div className="p-6 space-y-6">
              {/* Study Progress */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">学习进度</h3>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">观看进度</span>
                    <span className="text-sm font-medium">{videoInfo ? '0%' : '--'}</span>
                  </div>
                  <Progress value={0} className="mb-3" />
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{videoInfo?.viewCount || '--'}</div>
                    <div className="text-xs text-muted-foreground">总观看次数</div>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90">
                  继续学习
                </Button>
              </div>

              {/* Video Info */}
              <div>
                <h3 className="font-medium mb-3">视频信息</h3>
                {videoInfoLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : videoInfo ? (
                  <div className="text-sm space-y-2">
                    <p><span className="text-muted-foreground">频道:</span> {videoInfo.channelName}</p>
                    <p><span className="text-muted-foreground">发布:</span> {videoInfo.publishedAt}</p>
                    <p className="text-muted-foreground leading-relaxed">{videoInfo.description}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">暂无视频信息</p>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">快捷操作</h3>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    生成学习笔记
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Brain className="w-4 h-4 mr-2" />
                    创建思维导图
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    生成测验题
                  </Button>
                </div>
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
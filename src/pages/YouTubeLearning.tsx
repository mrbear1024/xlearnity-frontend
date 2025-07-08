import { useState } from "react";
import { ArrowLeft, Clock, FileText, User, MoreHorizontal, ChevronLeft, ChevronRight, BookOpen, Zap, Brain, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const YouTubeLearning = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';
  const [activeTab, setActiveTab] = useState("chapters");
  const [studyProgress, setStudyProgress] = useState(0);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  const chapters = [
    { time: "00:00", title: "LangChain简介", description: "人工程师的LangChain指南旨在将学习者从基础理解提升到熟练使用该框架。课程开始时对LangChain进行了概述，讨论其目的及适用案例。" },
    { time: "00:35", title: "LangChain生态系统概述", description: "讨论将涵盖使用LangChain的优缺点，不仅关注框架本身，还包括围绕它的更广泛生态系统。将提供对LangChain的介绍及示例，同时比较旧的方法与当前的0.3版本，以说明技术的发展。" },
    { time: "01:20", title: "环境设置", description: "设置开发环境和必要的依赖项。" },
    { time: "02:45", title: "第一个LangChain应用", description: "构建你的第一个简单的LangChain应用程序。" }
  ];

  const flashcards = [
    { id: 1, question: "Introduction to LangChain", type: "未研习", status: "pending" },
    { id: 2, question: "LangChain Architecture", type: "重置", status: "reset" },
    { id: 3, question: "Chain Components", type: "未研习", status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">LangChain Mastery in 2025 | Full 5 Hour Course</h1>
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
        {/* Main Content */}
        <div className="flex-1 p-6">
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">无效的YouTube链接</p>
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
              {chapters.map((chapter, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
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
              ))}
            </TabsContent>

            <TabsContent value="transcript">
              <div className="border border-border rounded-lg p-6">
                <p className="text-muted-foreground">文字稿内容将在这里显示...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-border p-6 space-y-6">
          {/* Study Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">今天的贡献</h3>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold mb-1">0</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">未研习</div>
                  <div className="text-primary">
                    <Zap className="h-6 w-6 mx-auto" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">重置</div>
                  <div className="text-muted-foreground">
                    <Brain className="h-6 w-6 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90">
              学习卡
            </Button>
          </div>

          {/* Study Speed */}
          <div>
            <h3 className="font-medium mb-3">甲板速度</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-muted-foreground rounded-full h-2 w-1/4"></div>
              </div>
              <span className="text-sm text-muted-foreground">未研习</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 w-3/4"></div>
              </div>
              <span className="text-sm text-primary">重置</span>
            </div>
          </div>

          {/* Flashcards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">抽认卡 (152)</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">全部概括</Button>
                <Button variant="secondary" size="sm">已完成</Button>
              </div>
            </div>
            <div className="space-y-2">
              {flashcards.map((card) => (
                <div key={card.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{card.question}</div>
                  </div>
                  <Badge variant={card.status === 'pending' ? 'secondary' : 'outline'} className="text-xs">
                    {card.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeLearning;
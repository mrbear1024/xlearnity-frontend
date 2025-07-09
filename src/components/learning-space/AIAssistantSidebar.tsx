import { Send, MessageCircle, CreditCard, BarChart3, FileEdit, Sparkles, BookOpen, Brain, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatMessage {
  id: number;
  type: string;
  content: string;
}

interface AIAssistantSidebarProps {
  activeRightTab: string;
  setActiveRightTab: (tab: string) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
}

const AIAssistantSidebar = ({
  activeRightTab,
  setActiveRightTab,
  chatMessage,
  setChatMessage,
  chatMessages
}: AIAssistantSidebarProps) => {
  const handleSendMessage = () => {
    console.log('Send message:', chatMessage);
    setChatMessage('');
  };

  return (
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

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="flex-1 m-0 p-4">
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">抽认卡</h3>
                <p className="text-sm text-muted-foreground mb-4">基于视频内容创建学习卡片</p>
                <Button>生成抽认卡</Button>
              </div>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="flex-1 m-0 p-4">
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">测验</h3>
                <p className="text-sm text-muted-foreground mb-4">测试您对视频内容的理解</p>
                <Button>开始测验</Button>
              </div>
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="flex-1 m-0 p-4">
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <FileEdit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">摘要</h3>
                <p className="text-sm text-muted-foreground mb-4">获取视频的关键要点总结</p>
                <Button>生成摘要</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistantSidebar;
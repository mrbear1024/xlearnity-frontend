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
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" className="flex-shrink-0" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

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
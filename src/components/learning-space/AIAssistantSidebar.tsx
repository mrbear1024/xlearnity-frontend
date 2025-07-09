import { MessageCircle, CreditCard, BarChart3, FileEdit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ChatTab from "./components/ChatTab";
import FlashcardsTab from "./components/FlashcardsTab";
import QuizTab from "./components/QuizTab";
import SummaryTab from "./components/SummaryTab";

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
  setChatMessages: (messages: ChatMessage[]) => void;
}

const AIAssistantSidebar = ({
  activeRightTab,
  setActiveRightTab,
  chatMessage,
  setChatMessage,
  chatMessages,
  setChatMessages
}: AIAssistantSidebarProps) => {
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // 添加用户消息
      const userMessage = {
        id: Date.now(),
        type: "user",
        content: chatMessage.trim()
      };
      
      // 模拟AI回复
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "感谢您的问题！我正在处理您的请求..."
      };
      
      setChatMessages([...chatMessages, userMessage, aiMessage]);
      setChatMessage('');
    }
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
          <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
            <ChatTab
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>

          <TabsContent value="flashcards" className="flex-1 flex flex-col m-0 p-0">
            <FlashcardsTab />
          </TabsContent>

          <TabsContent value="quiz" className="flex-1 flex flex-col m-0 p-0">
            <QuizTab />
          </TabsContent>

          <TabsContent value="summary" className="flex-1 flex flex-col m-0 p-0">
            <SummaryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistantSidebar;
import { MessageCircle, CreditCard, BarChart3, FileEdit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ChatTab from "./components/ChatTab";
import FlashcardsTab from "./components/FlashcardsTab";
import QuizTab from "./components/QuizTab";
import SummaryTab from "./components/SummaryTab";
import { ChatMessage } from "@/types/chat";

interface AIAssistantSidebarProps {
  activeRightTab: string;
  setActiveRightTab: (tab: string) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  mode: string; // Add mode prop
}

const AIAssistantSidebar = ({
  activeRightTab,
  setActiveRightTab,
  chatMessage,
  setChatMessage,
  chatMessages,
  setChatMessages,
  mode // Destructure mode
}: AIAssistantSidebarProps) => {
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // 添加用户消息
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: chatMessage.trim(),
        timestamp: new Date()
      };
      
      // 模拟AI回复
      // const aiMessage: ChatMessage = {
      //   id: (Date.now() + 1).toString(),
      //   type: "ai",
      //   content: "感谢您的问题！我正在处理您的请求...",
      //   timestamp: new Date()
      // };
      
      setChatMessages([...chatMessages, userMessage]);
      setChatMessage('');
    }
  };

  return (

    <div className="flex-1 flex flex-col h-full min-h-0">
      <Tabs
        value={activeRightTab}
        onValueChange={setActiveRightTab}
        // 让 Tabs 组件自身也成为一个 flex 容器，来管理其子元素的布局
      >
        {/* 1. 头部区域：只包含选项卡按钮。它的大小是固定的，不会伸展。 */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex flex-col items-center gap-1 text-xs">
              <MessageCircle className="h-4 w-4" />
              聊天
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex flex-col items-center gap-1 text-xs">
              <FileEdit className="h-4 w-4" />
              摘要
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 2. 内容区域：这部分将伸展并填满头部之外的剩余所有空间。 */}
        {/* 包裹聊天选项卡的 TabsContent。flex-1 让它占据所有可用空间。min-h-0 防止其内容溢出时破坏布局。*/}
        <TabsContent value="chat" >
          <ChatTab
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            isChatOnlyMode={mode === 'chat'}
          />
        </TabsContent>

        {/* 包裹摘要选项卡的 TabsContent。 */}
        <TabsContent value="summary" className="flex-1 flex flex-col m-0 p-0 min-h-0 h-full">
          <SummaryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistantSidebar;
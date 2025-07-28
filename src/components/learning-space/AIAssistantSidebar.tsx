import { MessageCircle, FileEdit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatTab from "./components/ChatTab";
import SummaryTab from "./components/SummaryTab";
import { ChatMessage } from "@/types/chat";

interface AIAssistantSidebarProps {
  activeRightTab: string;
  setActiveRightTab: (tab: string) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  mode: string;
}

const AIAssistantSidebar = ({
  activeRightTab,
  setActiveRightTab,
  chatMessage,
  setChatMessage,
  chatMessages,
  setChatMessages,
  mode
}: AIAssistantSidebarProps) => {
  // handleSendMessage function can remain the same
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: chatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, userMessage]);
      setChatMessage('');
    }
  };

  return (
    // 1. 设置为 flex 列布局，并确保它占满父容器的高度
    <div className="flex flex-col h-full">
      <Tabs
        value={activeRightTab}
        onValueChange={setActiveRightTab}
        // 2. 让 Tabs 组件也成为一个 flex 容器，以便管理其子项的布局
        className="flex flex-col flex-1 min-h-0"
      >
        {/* 3. 头部区域：大小固定，不伸展 */}
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

        {/* 4. 内容区域：这部分将伸展并填满剩余空间 */}
        {/* 移除了冲突的 h-full 和 overflow-y-auto，只保留 flex-1 和 min-h-0 */}
        <TabsContent value="chat" className="flex-1 min-h-0 m-0 p-0">
          <ChatTab
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            isChatOnlyMode={mode === 'chat'}
          />
        </TabsContent>

        <TabsContent value="summary" className="flex-1 min-h-0">
          <SummaryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistantSidebar;

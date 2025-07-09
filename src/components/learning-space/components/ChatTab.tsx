import { Sparkles } from "lucide-react";
import LearningToolsGrid from "./LearningToolsGrid";
import ChatInput from "./ChatInput";

interface ChatMessage {
  id: number;
  type: string;
  content: string;
}

interface ChatTabProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
  onSendMessage: () => void;
}

const ChatTab = ({ chatMessage, setChatMessage, chatMessages, onSendMessage }: ChatTabProps) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* AI Assistant Welcome */}
      <div className="p-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
      </div>

      {/* Learning Tools Grid */}
      <LearningToolsGrid />

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
      <ChatInput
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default ChatTab;

import { Sparkles, Square } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LearningToolsGrid from "./LearningToolsGrid";
import ChatInput from "./ChatInput";
import { useChatSSE } from "@/hooks/useChatSSE";
import { ChatMessage } from "@/types/chat";

interface ChatTabProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  context?: string; // 学习内容上下文
  isChatOnlyMode?: boolean; // 新增：是否为纯聊天模式
}

const ChatTab = ({ chatMessage, setChatMessage, context, isChatOnlyMode }: ChatTabProps) => {
  const {
    messages,
    sendMessage,
    clearMessages,
    stopGeneration,
    isLoading,
    isConnected,
  } = useChatSSE({ 
    context,
    initialMessages: [
      {
        id: '1',
        type: 'ai',
        content: '我是YouLearn的AI助手，很高兴为您提供学习帮助！您想了解什么呢？',
        timestamp: new Date(),
      }
    ]
  });

  // 移除有问题的同步逻辑，让输入框正常工作

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const messageToSend = chatMessage.trim();
      setChatMessage(''); // 立即清空输入框
      sendMessage(messageToSend);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* AI Assistant Welcome */}
      <div className="p-4 text-center border-b border-border">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
        
        {/* Control buttons */}
        {!isChatOnlyMode && (
          <div className="flex justify-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={isLoading || messages.length === 0}
            >
              清空对话
            </Button>
            {isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopGeneration}
                className="text-red-600 hover:text-red-700"
              >
                <Square className="h-3 w-3 mr-1" />
                停止生成
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Learning Tools Grid - 只在没有对话时显示 */}
      {!isChatOnlyMode && messages.length <= 1 && <LearningToolsGrid />}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                {message.type === 'user' ? (
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                ) : (
                  <Sparkles className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 max-w-[80%]">
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-muted text-foreground ml-4' 
                    : 'bg-primary text-primary-foreground mr-4'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.isStreaming && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-100"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-200"></div>
                    </div>
                  )}
                </div>
                {message.type === 'ai' && (
                  <div className="text-xs text-muted-foreground mt-1 mr-4">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && isConnected && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              AI正在思考中...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatTab;

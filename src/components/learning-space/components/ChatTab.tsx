
import { Sparkles, Square, Copy, Volume2, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LearningToolsGrid from "./LearningToolsGrid";
import ChatInput from "./ChatInput";
import { useChatSSE } from "@/hooks/useChatSSE";
import { ChatMessage } from "@/types/chat";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatTabProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  context?: string; // 学习内容上下文
  isChatOnlyMode?: boolean; // 新增：是否为纯聊天模式
}

const ChatTab = ({ chatMessage, setChatMessage, context, isChatOnlyMode }: ChatTabProps) => {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get('message');
  const initialMessageSent = useRef(false);
  const { t } = useLanguage();

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
        content: t('chat.welcomeMessage'),
        timestamp: new Date(),
      }
    ]
  });

  // 自动发送从主页传来的初始消息
  useEffect(() => {
    if (initialMessage && !initialMessageSent.current && !isLoading) {
      initialMessageSent.current = true;
      sendMessage(decodeURIComponent(initialMessage));
    }
  }, [initialMessage, sendMessage, isLoading]);

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
        <h3 className="font-medium mb-2">{t('chat.welcomeTitle')}</h3>
        
        {/* Control buttons */}
        {!isChatOnlyMode && (
          <div className="flex justify-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={isLoading || messages.length === 0}
            >
              {t('chat.clearChat')}
            </Button>
            {isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopGeneration}
                className="text-red-600 hover:text-red-700"
              >
                <Square className="h-3 w-3 mr-1" />
                {t('chat.stopGeneration')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Learning Tools Grid - 只在没有对话时显示 */}
      {!isChatOnlyMode && messages.length <= 1 && <LearningToolsGrid />}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                // 用户消息 - 右对齐
                <div className="flex justify-end">
                  <div className="bg-muted text-foreground rounded-xl px-4 py-2 max-w-[70%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ) : (
                // AI消息 - 左对齐，带思考过程和操作按钮
                <div className="space-y-2">
                  {message.isStreaming && (
                    <div className="text-xs text-muted-foreground">
                      {t('chat.thinking')}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    {!message.isStreaming && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                          onClick={() => navigator.clipboard.writeText(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && isConnected && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {t('chat.thinking')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
              </div>
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

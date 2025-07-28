import { Sparkles, Square } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import { useChatSSE } from "@/hooks/useChatSSE";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatTabProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  context?: string;
  isChatOnlyMode?: boolean;
}

const ChatTab = ({ chatMessage, setChatMessage, context, isChatOnlyMode }: ChatTabProps) => {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get('message');
  const initialMessageSent = useRef(false);
  const { t } = useLanguage();
  const initialMessageId = useRef(`welcome-${Date.now()}`);

  const {
    messages,
    sendMessage,
    stopGeneration,
    isLoading,
    isConnected,
  } = useChatSSE({ 
    context,
    initialMessages: [
      {
        id: initialMessageId.current,
        type: 'ai',
        content: t('chat.welcomeMessage'),
        timestamp: new Date(),
      }
    ]
  });

  useEffect(() => {
    if (initialMessage && !initialMessageSent.current && !isLoading) {
      initialMessageSent.current = true;
      sendMessage(decodeURIComponent(initialMessage));
    }
  }, [initialMessage, sendMessage, isLoading]);

  const handleSendMessage = useCallback(() => {
    if (chatMessage.trim()) {
      const messageToSend = chatMessage.trim();
      setChatMessage('');
      sendMessage(messageToSend);
    }
  }, [chatMessage, setChatMessage, sendMessage]);

  // Other handlers can be implemented as needed
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };
  const handleRegenerateMessage = (messageId: string) => {
    console.log('Regenerating message:', messageId);
  };
  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    console.log('Rating message:', messageId, rating);
  };
  const handlePlayAudio = (content: string) => {
    console.log('Playing audio for:', content);
  };

  return (
    // 1. 确保根元素是 flex 列布局，并占满父容器的高度
    <div className="flex flex-col h-full">
      {/* 欢迎语区域 - 固定高度 */}
      <div className="p-4 text-center border-b border-border flex-shrink-0">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">{t('chat.welcomeTitle')}</h3>
        {!isChatOnlyMode && (
          <div className="flex justify-center gap-2 mt-3">
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

      {/* 2. 聊天消息列表 - 它将自动伸展并填充剩余空间 */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        isConnected={isConnected}
        onCopyMessage={handleCopyMessage}
        onRegenerateMessage={handleRegenerateMessage}
        onRateMessage={handleRateMessage}
        onPlayAudio={handlePlayAudio}
      />

      {/* 3. 聊天输入框 - 固定高度 */}
      <div className="flex-shrink-0">
        <ChatInput
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};
export default ChatTab;

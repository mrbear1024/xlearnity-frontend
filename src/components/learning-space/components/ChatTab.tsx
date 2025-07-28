
import { Sparkles, Square, Copy, Volume2, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LearningToolsGrid from "./LearningToolsGrid";
import ChatInput from "./ChatInput";
import { useChatSSE } from "@/hooks/useChatSSE";
import { ChatMessage } from "@/types/chat";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import ReactMarkdown from 'react-markdown';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 生成唯一的初始消息ID
  const initialMessageId = useRef(`welcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

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
        id: initialMessageId.current,
        type: 'ai',
        content: t('chat.welcomeMessage'),
        timestamp: new Date(),
      }
    ]
  });

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // 自动发送从主页传来的初始消息
  useEffect(() => {
    if (initialMessage && !initialMessageSent.current && !isLoading) {
      initialMessageSent.current = true;
      sendMessage(decodeURIComponent(initialMessage));
    }
  }, [initialMessage, sendMessage, isLoading]);

  const handleSendMessage = useCallback(() => {
    if (chatMessage.trim()) {
      const messageToSend = chatMessage.trim();
      setChatMessage(''); // 立即清空输入框
      sendMessage(messageToSend);
    }
  }, [chatMessage, setChatMessage, sendMessage]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* AI Assistant Welcome */}
      <div className="p-4 text-center border-b border-border flex-shrink-0">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">{t('chat.welcomeTitle')}</h3>
        
        {/* Control buttons */}
        {!isChatOnlyMode && (
          <div className="flex justify-center gap-2 mt-3">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={isLoading || messages.length === 0}
            >
              {t('chat.clearChat')}
            </Button> */}
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
      {/* {!isChatOnlyMode && messages.length <= 1 && <LearningToolsGrid />} */}

      {/* Chat Messages - 可滚动区域 */}
      <div className="flex-1 overflow-hidden min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="space-y-6 max-w-4xl mx-auto p-4">
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
                      <div className="max-w-none">
                        <ReactMarkdown 
                          components={{
                            p: ({ children }) => (
                              <p className="mb-4 last:mb-0 text-foreground leading-7 text-[15px]">
                                {children}
                              </p>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-xl font-semibold mb-4 mt-6 first:mt-0 text-foreground">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0 text-foreground">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground">
                                {children}
                              </h3>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-4 space-y-2 pl-6">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-4 space-y-2 pl-6 list-decimal">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-[15px] leading-7 text-foreground relative">
                                <span className="absolute -left-6 text-muted-foreground select-none">
                                  •
                                </span>
                                {children}
                              </li>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-3 border-muted-foreground/30 pl-4 py-2 mb-4 bg-muted/20 italic text-muted-foreground">
                                {children}
                              </blockquote>
                            ),
                            code: ({ className, children }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-muted/60 px-1.5 py-0.5 rounded text-[13px] font-mono text-foreground border">
                                  {children}
                                </code>
                              ) : (
                                <code className="block bg-muted/40 border rounded-lg p-4 text-[13px] font-mono overflow-x-auto text-foreground whitespace-pre">
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => (
                              <pre className="bg-muted/40 border rounded-lg p-4 overflow-x-auto mb-4 text-[13px]">
                                {children}
                              </pre>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-foreground">
                                {children}
                              </em>
                            ),
                            a: ({ href, children }) => (
                              <a 
                                href={href} 
                                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto mb-4">
                                <table className="min-w-full border-collapse border border-muted">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-muted/50">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="border border-muted px-3 py-2 text-left font-semibold text-[14px]">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="border border-muted px-3 py-2 text-[14px]">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
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
      </div>

      {/* Chat Input - 固定在底部 */}
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

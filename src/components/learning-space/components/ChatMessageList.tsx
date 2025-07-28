import { Copy, Volume2, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat";
import { useLanguage } from "@/hooks/useLanguage";
import ReactMarkdown from 'react-markdown';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  isConnected?: boolean;
  onCopyMessage?: (content: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onRateMessage?: (messageId: string, rating: 'up' | 'down') => void;
  onPlayAudio?: (content: string) => void;
}

const ChatMessageList = ({
  messages,
  isLoading = false,
  isConnected = false,
  onCopyMessage,
  onRegenerateMessage,
  onRateMessage,
  onPlayAudio
}: ChatMessageListProps) => {
  const { t } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleCopyMessage = (content: string) => {
    if (onCopyMessage) {
      onCopyMessage(content);
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  const handleRegenerateMessage = (messageId: string) => {
    if (onRegenerateMessage) {
      onRegenerateMessage(messageId);
    }
  };

  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    if (onRateMessage) {
      onRateMessage(messageId, rating);
    }
  };

  const handlePlayAudio = (content: string) => {
    if (onPlayAudio) {
      onPlayAudio(content);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
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
                          onClick={() => handleCopyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                          onClick={() => handlePlayAudio(message.content)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                          onClick={() => handleRateMessage(message.id, 'up')}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                          onClick={() => handleRateMessage(message.id, 'down')}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                          onClick={() => handleRegenerateMessage(message.id)}
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
  );
};

export default ChatMessageList; 
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';

interface UseChatSSEProps {
  initialMessages?: ChatMessage[];
  context?: string; // 学习内容上下文
}

export const useChatSSE = ({ initialMessages = [], context }: UseChatSSEProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentStreamingMessageRef = useRef<string | null>(null);
  const { toast } = useToast();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateStreamingMessage = useCallback((messageId: string, content: string, isComplete: boolean = false) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isStreaming: !isComplete }
        : msg
    ));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    addMessage({
      type: 'user',
      content: message.trim(),
    });

    setIsLoading(true);
    setIsConnected(true);

    // Add placeholder AI message for streaming
    const aiMessageId = addMessage({
      type: 'ai',
      content: '',
      isStreaming: true,
    });

    currentStreamingMessageRef.current = aiMessageId;

    try {
      // Create SSE connection
      const response = await fetch('https://mywellxucnsjwhdhsbny.supabase.co/functions/v1/chat-sse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15d2VsbHh1Y25zandoZGhzYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjY5MzUsImV4cCI6MjA2NzU0MjkzNX0.k0JQf7NZPZQsg90CRVuM8zXdvZxisXCSumapA6R19QA`
        },
        body: JSON.stringify({
          message: message.trim(),
          context: context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content' && data.content) {
                accumulatedContent += data.content;
                updateStreamingMessage(aiMessageId, accumulatedContent, false);
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          } else if (line.startsWith('event: complete')) {
            updateStreamingMessage(aiMessageId, accumulatedContent, true);
            break;
          } else if (line.startsWith('event: error')) {
            throw new Error('Stream error occurred');
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the placeholder message with error
      updateStreamingMessage(aiMessageId, '抱歉，我遇到了一些问题，请稍后再试。', true);
      
      toast({
        title: "连接错误",
        description: "无法连接到AI助手，请检查网络连接后重试。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsConnected(false);
      currentStreamingMessageRef.current = null;
    }
  }, [isLoading, context, addMessage, updateStreamingMessage, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const stopGeneration = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (currentStreamingMessageRef.current) {
      updateStreamingMessage(currentStreamingMessageRef.current, 
        messages.find(m => m.id === currentStreamingMessageRef.current)?.content || '生成已停止', 
        true
      );
    }
    
    setIsLoading(false);
    setIsConnected(false);
    currentStreamingMessageRef.current = null;
  }, [messages, updateStreamingMessage]);

  return {
    messages,
    sendMessage,
    clearMessages,
    stopGeneration,
    isLoading,
    isConnected,
  };
};
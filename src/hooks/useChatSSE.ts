import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';

interface UseChatSSEProps {
  initialMessages?: ChatMessage[];
  context?: string; // 学习内容上下文
}

// 模拟AI回复的消息列表
const mockResponses = [
  "很高兴为您回答这个问题！这是一个很好的学习话题。",
  "让我来为您详细解释一下这个概念...",
  "根据您的问题，我建议从以下几个方面来理解：",
  "这是一个非常实用的知识点，让我们一步步来学习。",
  "您提出了一个很棒的问题！我来帮您分析一下。",
  "关于这个话题，我可以分享一些有用的见解给您。",
  "这个问题很有深度，让我们深入探讨一下。",
  "我理解您的疑问，让我为您提供一个清晰的解答。"
];

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

  // TODO: 替换为真实的后端API调用
  // 预留接口：sendMessageToBackend(message, context)
  const sendMessageToBackend = useCallback(async (message: string, context?: string) => {
    // 这里将来替换为真实的API调用
    // 例如：调用 chat-sse endpoint 或其他AI服务
    // const response = await fetch('/api/chat', { ... });
    
    // 目前返回模拟数据
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        resolve(randomResponse);
      }, 1000 + Math.random() * 2000); // 1-3秒的随机延迟
    });
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
      // 模拟流式输出效果
      const response = await sendMessageToBackend(message.trim(), context);
      
      // 模拟打字机效果
      let currentIndex = 0;
      const typewriterEffect = () => {
        if (currentIndex < response.length) {
          const currentContent = response.substring(0, currentIndex + 1);
          updateStreamingMessage(aiMessageId, currentContent, false);
          currentIndex++;
          setTimeout(typewriterEffect, 30 + Math.random() * 50); // 30-80ms间隔
        } else {
          // 完成输出
          updateStreamingMessage(aiMessageId, response, true);
          setIsLoading(false);
          setIsConnected(false);
          currentStreamingMessageRef.current = null;
        }
      };
      
      // 开始打字机效果
      setTimeout(typewriterEffect, 500); // 延迟500ms开始

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the placeholder message with error
      updateStreamingMessage(aiMessageId, '抱歉，我遇到了一些问题，请稍后再试。', true);
      
      toast({
        title: "连接错误",
        description: "无法连接到AI助手，请检查网络连接后重试。",
        variant: "destructive",
      });
      
      setIsLoading(false);
      setIsConnected(false);
      currentStreamingMessageRef.current = null;
    }
  }, [isLoading, context, addMessage, updateStreamingMessage, toast, sendMessageToBackend]);

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
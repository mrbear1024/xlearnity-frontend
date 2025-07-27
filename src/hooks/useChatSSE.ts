import { useState, useRef, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';
import { useTranslation } from 'react-i18next';

interface UseChatSSEProps {
  initialMessages?: ChatMessage[];
  context?: string; // 学习内容上下文
  contentId?: string; // 关联的资料ID
}

// API base URL for development
// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://dataapi.nuwaos.com/chatlearn';

export const useChatSSE = ({ initialMessages = [], context, contentId }: UseChatSSEProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentStreamingMessageRef = useRef<string | null>(null);
  const streamingContentRef = useRef<string>('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  // 防抖更新流式消息内容
  const debouncedUpdateStreamingMessage = useCallback((messageId: string, content: string, isComplete: boolean = false) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    if (isComplete) {
      // 完成时立即更新
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content, isStreaming: false }
          : msg
      ));
      streamingContentRef.current = '';
    } else {
      // 流式更新时使用防抖
      updateTimeoutRef.current = setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content, isStreaming: true }
            : msg
        ));
      }, 50); // 50ms 防抖间隔
    }
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `${message.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  // 将消息历史转换为后端期望的格式
  const convertHistoryToBackendFormat = useCallback((messages: ChatMessage[]) => {
    return messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      msg: msg.content
    }));
  }, []);

  // 真实的后端API调用
  const sendMessageToBackend = useCallback(async (message: string, aiMessageId: string) => {
    // 准备历史消息（不包含当前正在流式输出的消息）
    const historyMessages = messages.filter(msg => msg.id !== aiMessageId);
    const history = convertHistoryToBackendFormat(historyMessages);

    // 准备请求体
    const requestBody = {
      message,
      history,
      ...(contentId && { content_id: contentId })
    };

    try {
      // 创建SSE连接
      const url = new URL('/api/chat', API_BASE_URL);
      
      // 首先检查后端是否可用
      // const healthCheckUrl = new URL('/health', API_BASE_URL);
      
      // try {
      //   const healthResponse = await fetch(healthCheckUrl.toString(), {
      //     method: 'GET',
      //     signal: AbortSignal.timeout(3000), // 3秒超时
      //   });
        
      //   if (!healthResponse.ok) {
      //     throw new Error('Backend health check failed');
      //   }
      // } catch (healthError) {
      //   // 后端不可用，使用开发模式回退
      //   console.warn('Backend not available, using development fallback');
      //   throw new Error('BACKEND_UNAVAILABLE');
      // }
      
      // 由于EventSource不支持POST请求，我们需要通过fetch发送POST请求
      // 然后处理流式响应
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No reader available');
      }

      let buffer = '';
      streamingContentRef.current = ''; // 重置流式内容
      
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            // 处理缓冲区中的完整行
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留未完成的行
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6); // 移除 'data: ' 前缀
                try {
                  const data = JSON.parse(jsonStr);
                  if (data.delta) {
                    // 累积流式内容
                    streamingContentRef.current += data.delta;
                    // 使用防抖更新
                    debouncedUpdateStreamingMessage(aiMessageId, streamingContentRef.current, false);
                  }
                } catch (parseError) {
                  console.warn('Failed to parse SSE data:', parseError);
                }
              }
              // 忽略 ping 和其他事件
            }
          }
          
          // 流结束，最终更新消息
          debouncedUpdateStreamingMessage(aiMessageId, streamingContentRef.current, true);
          setIsLoading(false);
          setIsConnected(false);
          currentStreamingMessageRef.current = null;
          
        } catch (streamError) {
          console.error('Stream processing error:', streamError);
          throw streamError;
        }
      };

      setIsConnected(true);
      await processStream();

    } catch (error) {
      console.error('Error in sendMessageToBackend:', error);
      
      // 如果是后端不可用，使用开发模式回退
      if (error instanceof Error && error.message === 'BACKEND_UNAVAILABLE') {
        // 开发模式回退：提供模拟回复
        const currentLang = i18n.language as 'en' | 'zh';
        const mockResponses = {
          en: [
            `# Development Mode Active

I'm currently in **development mode**. The backend service is not available. This is a mock response to help you test the interface.

## Features Supported:
- **Markdown rendering** ✅
- *Italic text* and **bold text**
- \`Inline code\` examples
- Lists and more formatting

> This is a blockquote to test markdown rendering.

### Code Example:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

For more information, visit [our documentation](https://example.com).`,
            `## Backend Connection Unavailable

This is a **simulated response** for development purposes with markdown support:

1. First item in ordered list
2. Second item with *emphasis*
3. Third item with \`code\`

### What's working:
- ✅ Markdown rendering
- ✅ Styled components
- ✅ Responsive design
- ⏳ Backend integration (in progress)

> **Note**: This is a development fallback response.`,
            `# AI Service Temporarily Offline

This is a **placeholder response** for testing markdown rendering capabilities.

## Available formatting:
- **Bold text**
- *Italic text*
- \`Inline code\`
- [Links](https://example.com)
- Lists and blockquotes

### Sample Code:
\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

> The real AI service will be available once the backend is properly configured.`
          ],
          zh: [
            `# 开发模式已激活

我目前处于**开发模式**。后端服务不可用。这是一个模拟回复，用于帮助您测试界面。

## 支持的功能：
- **Markdown渲染** ✅
- *斜体文本* 和 **粗体文本**
- \`内联代码\` 示例
- 列表和更多格式

> 这是一个引用块，用于测试markdown渲染。

### 代码示例：
\`\`\`javascript
function hello() {
  console.log("你好，世界！");
}
\`\`\`

了解更多信息，请访问 [我们的文档](https://example.com)。`,
            `## 后端连接不可用

这是一个**模拟回复**，用于开发目的，支持markdown：

1. 有序列表第一项
2. 带有 *强调* 的第二项
3. 带有 \`代码\` 的第三项

### 正在工作的功能：
- ✅ Markdown渲染
- ✅ 样式化组件
- ✅ 响应式设计
- ⏳ 后端集成（开发中）

> **注意**：这是一个开发回退响应。`,
            `# AI服务暂时离线

这是一个**占位符回复**，用于测试markdown渲染功能。

## 可用格式：
- **粗体文本**
- *斜体文本*
- \`内联代码\`
- [链接](https://example.com)
- 列表和引用

### 示例代码：
\`\`\`python
def greet(name):
    return f"你好，{name}！"
\`\`\`

> 一旦后端正确配置，真正的AI服务将可用。`,
            `# 复利效应解释

**复利效应**是指在投资中，利息不仅基于本金计算，还基于之前获得的利息。

## 核心概念：
- **本金**：初始投资金额
- **利率**：年化收益率
- **时间**：投资期限
- **复利**：利息再投资产生的收益

### 计算公式：
\`\`\`
终值 = 本金 × (1 + 利率)^时间
\`\`\`

### 实例计算：
假设投资 **1000元**，年利率 **5%**：

- 第1年：1000 × 1.05 = 1050元
- 第2年：1050 × 1.05 = 1102.5元  
- 第3年：1102.5 × 1.05 = 1157.63元

> **重要提示**：复利效应需要时间才能显现，长期投资的复利效果更加显著。

通过这个例子，您可以看到复利如何让财富**指数级增长**。`
          ]
        };
        
        const responses = mockResponses[currentLang] || mockResponses.en;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // 模拟流式输出
        let currentIndex = 0;
        const typewriterEffect = () => {
          if (currentIndex < randomResponse.length) {
            const currentContent = randomResponse.substring(0, currentIndex + 1);
            streamingContentRef.current = currentContent;
            debouncedUpdateStreamingMessage(aiMessageId, currentContent, false);
            currentIndex++;
            setTimeout(typewriterEffect, 30 + Math.random() * 50);
          } else {
            debouncedUpdateStreamingMessage(aiMessageId, randomResponse, true);
            setIsLoading(false);
            setIsConnected(false);
            currentStreamingMessageRef.current = null;
          }
        };
        
        setTimeout(typewriterEffect, 500);
        return;
      }
      
      throw error;
    }
  }, [messages, contentId, convertHistoryToBackendFormat, debouncedUpdateStreamingMessage, i18n.language]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    addMessage({
      type: 'user',
      content: message.trim(),
    });

    setIsLoading(true);

    // Add placeholder AI message for streaming
    const aiMessageId = addMessage({
      type: 'ai',
      content: '',
      isStreaming: true,
    });

    currentStreamingMessageRef.current = aiMessageId;

    try {
      await sendMessageToBackend(message.trim(), aiMessageId);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the placeholder message with error
      updateStreamingMessage(aiMessageId, t('errors.somethingWentWrong'), true);
      
      toast({
        title: t('errors.connectionError'),
        description: t('errors.networkMessage'),
        variant: "destructive",
      });
      
      setIsLoading(false);
      setIsConnected(false);
      currentStreamingMessageRef.current = null;
    }
  }, [isLoading, addMessage, updateStreamingMessage, toast, sendMessageToBackend, t]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    // 清理防抖定时器
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
  }, []);

  const stopGeneration = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    // 清理防抖定时器
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    if (currentStreamingMessageRef.current) {
      updateStreamingMessage(currentStreamingMessageRef.current, 
        streamingContentRef.current || t('errors.generationStopped'), 
        true
      );
    }
    
    setIsLoading(false);
    setIsConnected(false);
    currentStreamingMessageRef.current = null;
    streamingContentRef.current = '';
  }, [updateStreamingMessage, t]);

  // 优化消息渲染性能
  const optimizedMessages = useMemo(() => {
    return messages.map(msg => ({
      ...msg,
      // 确保每个消息都有唯一的渲染key
      _renderKey: `${msg.id}-${msg.content.length}-${msg.isStreaming ? 'streaming' : 'complete'}`
    }));
  }, [messages]);

  return {
    messages: optimizedMessages,
    sendMessage,
    clearMessages,
    stopGeneration,
    isLoading,
    isConnected,
  };
};
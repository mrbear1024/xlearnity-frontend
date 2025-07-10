import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    if (!message) {
      return new Response('Message is required', { status: 400, headers: corsHeaders });
    }

    // Create SSE response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          // Call OpenAI API with streaming
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `你是YouLearn的AI学习助手。你的任务是帮助用户学习和理解各种内容。你应该：
1. 用友好、专业的语气回答问题
2. 提供准确、有用的信息
3. 根据上下文提供个性化的学习建议
4. 如果不确定答案，诚实地说明
5. 用中文回复

${context ? `当前学习内容上下文：${context}` : ''}`
                },
                {
                  role: 'user',
                  content: message
                }
              ],
              stream: true,
              temperature: 0.7,
              max_tokens: 2000,
            }),
          });

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // Send completion event
              controller.enqueue(encoder.encode('event: complete\ndata: {}\n\n'));
              break;
            }

            buffer += new TextDecoder().decode(value);
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('event: complete\ndata: {}\n\n'));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    const sseData = {
                      type: 'content',
                      content: content,
                      timestamp: Date.now()
                    };
                    
                    controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(sseData)}\n\n`));
                  }
                } catch (parseError) {
                  console.error('Error parsing SSE data:', parseError, data);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error in chat SSE:', error);
          const errorData = {
            type: 'error',
            message: 'Sorry, I encountered an error. Please try again.',
            timestamp: Date.now()
          };
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat-sse function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
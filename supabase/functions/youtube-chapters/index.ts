import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 从YouTube URL提取视频ID
function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// 从视频描述中提取时间戳章节
function extractChaptersFromDescription(description: string): unknown[] {
  const chapters: unknown[] = [];
  const lines = description.split('\n');
  
  for (const line of lines) {
    // 匹配时间戳格式 (例如: 0:00, 00:00, 1:23, 12:34:56)
    const timeMatch = line.match(/^(\d{0,2}:?\d{1,2}:\d{2}|\d{1,2}:\d{2})\s*[-–—]?\s*(.+)/);
    if (timeMatch) {
      const timeStr = timeMatch[1];
      const title = timeMatch[2].trim();
      
      // 转换时间为秒数
      const timeParts = timeStr.split(':').map(Number);
      let seconds = 0;
      if (timeParts.length === 2) {
        seconds = timeParts[0] * 60 + timeParts[1];
      } else if (timeParts.length === 3) {
        seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
      }
      
      chapters.push({
        time: timeStr,
        title: title,
        description: title,
        startSeconds: seconds
      });
    }
  }
  
  return chapters;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!youtubeApiKey) {
      return new Response(
        JSON.stringify({ error: 'YouTube API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    const { url } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // 调用YouTube Data API v3获取视频信息
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${youtubeApiKey}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    // 从描述中提取章节信息
    const chapters = extractChaptersFromDescription(snippet.description || '');

    // 构建返回数据
    const result = {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      duration: contentDetails.duration,
      thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
      channelName: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      chapters: chapters.length > 0 ? chapters : [
        {
          time: "0:00",
          title: "开始",
          description: "视频开始",
          startSeconds: 0
        }
      ]
    };

    console.log(`Successfully processed video: ${snippet.title}`);
    console.log(`Found ${chapters.length} chapters`);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in youtube-chapters function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
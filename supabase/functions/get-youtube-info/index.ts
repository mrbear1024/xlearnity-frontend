import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

// 从YouTube页面HTML中提取视频信息
function extractVideoInfo(html: string, videoId: string) {
  try {
    // 提取标题
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : `Video ${videoId}`;
    
    // 清理标题中的HTML实体
    title = title.replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');

    // 提取描述 (尝试从JSON-LD数据中获取)
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([^<]+)<\/script>/);
    let description = '';
    if (jsonLdMatch) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        description = jsonData.description || '';
      } catch (e) {
        console.log('Could not parse JSON-LD:', e);
      }
    }

    // 提取缩略图
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // 提取频道名称
    const channelMatch = html.match(/"ownerChannelName":"([^"]+)"/);
    const channelName = channelMatch ? channelMatch[1] : 'Unknown Channel';

    return {
      id: videoId,
      title,
      description: description.slice(0, 500), // 限制描述长度
      duration: 'Unknown',
      thumbnail,
      channel_name: channelName,
      published_at: new Date().toISOString(),
      view_count: 'Unknown'
    };
  } catch (error) {
    console.error('Error extracting video info:', error);
    return {
      id: videoId,
      title: `Video ${videoId}`,
      description: '',
      duration: 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      channel_name: 'Unknown Channel',
      published_at: new Date().toISOString(),
      view_count: 'Unknown'
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      "https://mywellxucnsjwhdhsbny.supabase.co",
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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

    // 检查缓存
    const { data: cachedVideo } = await supabaseClient
      .from('video_cache')
      .select('*')
      .eq('video_id', videoId)
      .single()

    // 如果缓存存在且不超过24小时，直接返回
    if (cachedVideo) {
      const cacheAge = new Date().getTime() - new Date(cachedVideo.created_at).getTime()
      const maxAge = 24 * 60 * 60 * 1000 // 24小时
      
      if (cacheAge < maxAge) {
        return new Response(
          JSON.stringify(cachedVideo),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }
    }

    // 获取YouTube页面HTML
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube page: ${response.status}`)
    }

    const html = await response.text()
    const videoInfo = extractVideoInfo(html, videoId)

    // 保存到缓存
    const { error: upsertError } = await supabaseClient
      .from('video_cache')
      .upsert({
        video_id: videoId,
        title: videoInfo.title,
        description: videoInfo.description,
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail,
        channel_name: videoInfo.channel_name,
        published_at: videoInfo.published_at,
        view_count: videoInfo.view_count,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Error caching video info:', upsertError)
    }

    return new Response(
      JSON.stringify(videoInfo),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in get-youtube-info function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
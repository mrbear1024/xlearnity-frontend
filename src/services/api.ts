import { 
  mockActivities, 
  mockSpaces, 
  mockUserProfile, 
  mockFeatures, 
  mockContinueStudying,
  mockYouTubeVideos,
  mockVideoChapters,
  mockVideoTranscripts
} from '@/data/mockData';
import { Activity, Space, UserProfile, Feature } from '@/types';
import { YouTubeVideoInfo, VideoChapter, VideoTranscript } from '@/types/youtube';
import { extractVideoId } from '@/utils/youtube';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // 获取用户最近活动
  async getRecentActivities(): Promise<Activity[]> {
    await delay(300);
    return mockActivities;
  },

  // 获取用户空间
  async getUserSpaces(): Promise<Space[]> {
    await delay(200);
    return mockSpaces;
  },


  // 获取用户信息
  async getUserProfile(): Promise<UserProfile> {
    // /api/auth/me
    const userProfile = localStorage.getItem('user_profile');
    const token = JSON.parse(userProfile).token;
  
    const response = await fetch(`/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `${token}`
      }
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  },

  // 获取功能列表
  async getFeatures(): Promise<Feature[]> {
    await delay(100);
    return mockFeatures;
  },

  // 获取继续学习列表
  async getContinueStudying(): Promise<Activity[]> {
    await delay(250);
    return mockContinueStudying;
  },

  // 创建新空间
  async createSpace(name: string): Promise<Space> {
    await delay(500);
    const newSpace: Space = {
      id: Date.now(),
      name,
      count: 0,
      description: "新创建的学习空间"
    };
    return newSpace;
  },

  // 更新学习进度
  async updateStudyProgress(contentId: string, progress: number): Promise<void> {
    await delay(300);
    // 模拟更新操作
    console.log(`更新内容 ${contentId} 的进度到 ${progress}%`);
  },

  // 获取YouTube视频信息
  async getYouTubeVideoInfo(url: string): Promise<YouTubeVideoInfo> {
    try {
      const response = await fetch('https://mywellxucnsjwhdhsbny.supabase.co/functions/v1/get-youtube-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15d2VsbHh1Y25zandoZGhzYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjY5MzUsImV4cCI6MjA2NzU0MjkzNX0.k0JQf7NZPZQsg90CRVuM8zXdvZxisXCSumapA6R19QA`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        duration: data.duration,
        thumbnail: data.thumbnail,
        channelName: data.channel_name,
        publishedAt: data.published_at,
        viewCount: data.view_count
      };
    } catch (error) {
      console.error('Error fetching YouTube video info:', error);
      // 失败时返回默认信息
      const videoId = extractVideoId(url);
      return {
        id: videoId || 'default',
        title: 'Loading video...',
        description: '正在获取视频信息...',
        duration: 'Unknown',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channelName: 'Unknown Channel',
        publishedAt: new Date().toISOString(),
        viewCount: 'Unknown'
      };
    }
  },

  // 获取视频章节
  async getVideoChapters(videoId: string): Promise<VideoChapter[]> {
    await delay(400);
    return mockVideoChapters[videoId] || mockVideoChapters['default'];
  },

  // 获取视频字幕
  async getVideoTranscript(videoId: string): Promise<VideoTranscript[]> {
    await delay(500);
    return mockVideoTranscripts[videoId] || mockVideoTranscripts['default'];
  },

  // 添加近期活动
  async addRecentActivity(title: string, url: string): Promise<Activity> {
    await delay(200);
    const newActivity: Activity = {
      id: Date.now(),
      title,
      url,
      active: true,
      type: 'video',
      createdAt: new Date().toISOString()
    };
    
    // 更新 mockActivities，将新活动添加到开头，并将其他活动设为非活跃
    mockActivities.forEach(activity => activity.active = false);
    mockActivities.unshift(newActivity);
    
    // 保持最多10个活动
    if (mockActivities.length > 10) {
      mockActivities.splice(10);
    }
    
    return newActivity;
  },

  // Google Login
  async googleLogin(idToken: string): Promise<UserProfile> {
    // /api/auth/google
    const response = await fetch(`/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
    });
    const data = await response.json();
    return data;
  },

  // // Google Logout
  // async googleLogout(): Promise<void> {
  //   // /api/auth/logout
  //   const response = await fetch(`/api/auth/logout`, {
  //     method: 'POST',
  //   });
  //   const data = await response.json();
  //   return data;
  // },

  async addContent(data: {
    space_id: string;
    source_type: string;
    source_id: string;
    title: string;
    user_id?: number;
  }) {
    const res = await fetch('/api/contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add content');
    return res.json();
  }
};
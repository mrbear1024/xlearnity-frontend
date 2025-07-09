import { 
  mockActivities, 
  mockSpaces, 
  mockLearningContent, 
  mockUserProfile, 
  mockFeatures, 
  mockContinueStudying,
  mockYouTubeVideos,
  mockVideoChapters,
  mockVideoTranscripts
} from '@/data/mockData';
import { Activity, Space, OldLearningContent, UserProfile, Feature } from '@/types';
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

  // 获取学习内容详情
  async getLearningContent(id?: string): Promise<OldLearningContent> {
    await delay(400);
    return mockLearningContent;
  },

  // 获取用户信息
  async getUserProfile(): Promise<UserProfile> {
    await delay(150);
    return mockUserProfile;
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
    await delay(600);
    const videoId = extractVideoId(url);
    return mockYouTubeVideos[videoId || 'default'] || mockYouTubeVideos['default'];
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
  }
};
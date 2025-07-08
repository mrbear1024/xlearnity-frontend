import { 
  mockActivities, 
  mockSpaces, 
  mockLearningContent, 
  mockUserProfile, 
  mockFeatures, 
  mockContinueStudying 
} from '@/data/mockData';
import { Activity, Space, LearningContent, UserProfile, Feature } from '@/types';

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
  async getLearningContent(id?: string): Promise<LearningContent> {
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
  }
};
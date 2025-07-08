import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Activity, Space, LearningContent, UserProfile, Feature } from '@/types';

// Query Keys
export const QUERY_KEYS = {
  RECENT_ACTIVITIES: ['recentActivities'],
  USER_SPACES: ['userSpaces'],
  LEARNING_CONTENT: ['learningContent'],
  USER_PROFILE: ['userProfile'],
  FEATURES: ['features'],
  CONTINUE_STUDYING: ['continueStudying'],
} as const;

// 获取最近活动
export const useRecentActivities = () => {
  return useQuery<Activity[]>({
    queryKey: QUERY_KEYS.RECENT_ACTIVITIES,
    queryFn: apiService.getRecentActivities,
  });
};

// 获取用户空间
export const useUserSpaces = () => {
  return useQuery<Space[]>({
    queryKey: QUERY_KEYS.USER_SPACES,
    queryFn: apiService.getUserSpaces,
  });
};

// 获取学习内容
export const useLearningContent = (id?: string) => {
  return useQuery<LearningContent>({
    queryKey: [...QUERY_KEYS.LEARNING_CONTENT, id],
    queryFn: () => apiService.getLearningContent(id),
  });
};

// 获取用户信息
export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: apiService.getUserProfile,
  });
};

// 获取功能列表
export const useFeatures = () => {
  return useQuery<Feature[]>({
    queryKey: QUERY_KEYS.FEATURES,
    queryFn: apiService.getFeatures,
  });
};

// 获取继续学习列表
export const useContinueStudying = () => {
  return useQuery<Activity[]>({
    queryKey: QUERY_KEYS.CONTINUE_STUDYING,
    queryFn: apiService.getContinueStudying,
  });
};

// 创建空间的 Mutation
export const useCreateSpace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createSpace,
    onSuccess: () => {
      // 创建成功后刷新空间列表
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SPACES });
    },
  });
};

// 更新学习进度的 Mutation
export const useUpdateStudyProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contentId, progress }: { contentId: string; progress: number }) =>
      apiService.updateStudyProgress(contentId, progress),
    onSuccess: (_, variables) => {
      // 更新成功后刷新学习内容
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.LEARNING_CONTENT, variables.contentId] 
      });
    },
  });
};
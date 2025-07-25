// 重构前的旧类型定义（保持兼容性）
export interface Activity {
  id: number;
  title: string;
  active: boolean;
  url?: string;
  thumbnail?: string;
  type?: 'video' | 'document' | 'audio';
  createdAt?: string;
  meta?: {
    title?: string;
    video_url?: string;
    embed_url?: string;
    caption_url?: string;
    video_info_url?: string;
    url?: string;
  };
}
export interface Content {
  id: number;
  title: string;
  source_id?: string;
  source_type?: string;
  space_id?: string;
  status?: string;
  user_id?: number;
  url?: string;
  meta?: {
    title?: string;
    video_url?: string;
    embed_url?: string;
    caption_url?: string;
    video_info_url?: string;
    url?: string;
  };
}
export interface Space {
  id: number;
  name: string;
  count: number;
  description?: string;
}


export interface UserProfile {
  id: number;
  email: string;
  username: string;
  plan: string;
  name?: string;
  avatar?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

// 新的类型系统导出
export * from './learning';
export * from './ui';
export * from './components';
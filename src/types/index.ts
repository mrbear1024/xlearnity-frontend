// 重构前的旧类型定义（保持兼容性）
export interface Activity {
  id: number;
  title: string;
  active: boolean;
  url?: string;
  thumbnail?: string;
  type?: 'video' | 'document' | 'audio';
  createdAt?: string;
}

export interface Space {
  id: number;
  name: string;
  count: number;
  description?: string;
}


export interface UserProfile {
  email: string;
  plan: string;
  name?: string;
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
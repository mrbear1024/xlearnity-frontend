import { Activity, Space, LearningContent, UserProfile, Feature } from '@/types';

export const mockActivities: Activity[] = [
  { id: 1, title: "LangChain Mastery in 2025", active: true, type: 'video', thumbnail: "/lovable-uploads/44724c43-e237-487e-a306-21b296d2edf7.png" },
  { id: 2, title: "Building a Simple LLM App", active: false, type: 'video' },
  { id: 3, title: "LangChain Python 代码实例", active: false, type: 'document' },
  { id: 4, title: "François Chollet: How to...", active: false, type: 'video' },
  { id: 5, title: "Vectors | Chapter 1, Essence...", active: false, type: 'video' },
];

export const mockSpaces: Space[] = [
  { id: 1, name: "Bear's Space", count: 0, description: "个人学习空间" },
  { id: 2, name: "无题空间", count: 0, description: "未命名的学习空间" },
];

export const mockLearningContent: LearningContent = {
  id: "langchain-2025",
  title: "LangChain Mastery in 2025 | Full 5 Hour Course",
  url: "https://www.youtube.com/watch?v=example",
  studyProgress: 0,
  chapters: [
    { time: "00:00", title: "LangChain简介", description: "人工程师的LangChain指南旨在将学习者从基础理解提升到熟练使用该框架。课程开始时对LangChain进行了概述，讨论其目的及适用案例。" },
    { time: "00:35", title: "LangChain生态系统概述", description: "讨论将涵盖使用LangChain的优缺点，不仅关注框架本身，还包括围绕它的更广泛生态系统。将提供对LangChain的介绍及示例，同时比较旧的方法与当前的0.3版本，以说明技术的发展。" },
    { time: "01:20", title: "环境设置", description: "设置开发环境和必要的依赖项。" },
    { time: "02:45", title: "第一个LangChain应用", description: "构建你的第一个简单的LangChain应用程序。" }
  ],
  flashcards: [
    { id: 1, question: "Introduction to LangChain", type: "未研习", status: "pending" },
    { id: 2, question: "LangChain Architecture", type: "重置", status: "reset" },
    { id: 3, question: "Chain Components", type: "未研习", status: "pending" }
  ]
};

export const mockUserProfile: UserProfile = {
  email: "mrbear1024@gmail.com",
  plan: "Free 计划",
  name: "Bear"
};

export const mockFeatures: Feature[] = [
  {
    icon: "Upload",
    title: "上传",
    description: "文件、音频、视频",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: "Link",
    title: "粘贴",
    description: "YouTube、网站、文本",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    icon: "Mic",
    title: "记录",
    description: "录制课堂、视频通话",
    color: "text-green-500",
    bgColor: "bg-green-50"
  }
];

export const mockContinueStudying: Activity[] = [
  {
    id: 1,
    title: "LANGCHAIN IN 2025",
    thumbnail: "/lovable-uploads/44724c43-e237-487e-a306-21b296d2edf7.png",
    type: "video",
    active: false
  },
  {
    id: 2,
    title: "Setup",
    thumbnail: "/api/placeholder/300/200",
    type: "document",
    active: false
  },
  {
    id: 3,
    title: "今天演算法",
    thumbnail: "/api/placeholder/300/200",
    type: "document",
    active: false
  },
  {
    id: 4,
    title: "The Road to AGI",
    thumbnail: "/api/placeholder/300/200",
    type: "video",
    active: false
  }
];
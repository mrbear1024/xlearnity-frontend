import { Activity, Space, OldLearningContent, UserProfile, Feature } from '@/types';
import { YouTubeVideoInfo, VideoChapter, VideoTranscript } from '@/types/youtube';

export const mockActivities: Activity[] = [
  { id: 1, title: "LangChain Mastery in 2025", active: true, type: 'video', thumbnail: "/lovable-uploads/44724c43-e237-487e-a306-21b296d2edf7.png", url: "https://www.youtube.com/watch?v=RdJHV3wKGMM" },
  { id: 2, title: "Building a Simple LLM App", active: false, type: 'video', url: "https://www.youtube.com/watch?v=dXxQ0LR-3Hg" },
  { id: 3, title: "LangChain Python 代码实例", active: false, type: 'document', url: "https://python.langchain.com/docs/introduction/" },
  { id: 4, title: "François Chollet: How to...", active: false, type: 'video', url: "https://www.youtube.com/watch?v=PUAdj3w3wO4" },
  { id: 5, title: "Vectors | Chapter 1, Essence...", active: false, type: 'video', url: "https://www.youtube.com/watch?v=fNk_zzaMoSs" },
];

export const mockSpaces: Space[] = [
  { id: 1, name: "Bear's Space", count: 0, description: "个人学习空间" },
  { id: 2, name: "无题空间", count: 0, description: "未命名的学习空间" },
];

export const mockLearningContent: OldLearningContent = {
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

// 模拟YouTube视频信息数据库
export const mockYouTubeVideos: Record<string, YouTubeVideoInfo> = {
  'dQw4w9WgXcQ': {
    id: 'dQw4w9WgXcQ',
    title: 'LangChain Mastery in 2025 | Full 5 Hour Course',
    description: '完整的LangChain课程，从基础到高级应用。学习如何构建强大的AI应用程序。',
    duration: 'PT5H0M0S',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    channelName: 'AI Learning Hub',
    publishedAt: '2024-01-15',
    viewCount: '125430'
  },
  // 默认视频信息
  'default': {
    id: 'default',
    title: 'LangChain Mastery in 2025 | Full 5 Hour Course',
    description: '这是一个关于LangChain的详细教程课程',
    duration: 'PT5H0M0S',
    thumbnail: '/lovable-uploads/44724c43-e237-487e-a306-21b296d2edf7.png',
    channelName: 'AI Learning Hub',
    publishedAt: '2024-01-15',
    viewCount: '125430'
  }
};

// 模拟视频章节数据
export const mockVideoChapters: Record<string, VideoChapter[]> = {
  'dQw4w9WgXcQ': [
    { time: "00:00", title: "LangChain简介", description: "LangChain框架的基础概念和应用场景介绍", startSeconds: 0 },
    { time: "00:35", title: "LangChain生态系统概述", description: "深入了解LangChain生态系统和相关工具", startSeconds: 35 },
    { time: "01:20", title: "环境设置", description: "配置开发环境和必要的依赖项", startSeconds: 80 },
    { time: "02:45", title: "第一个LangChain应用", description: "从零开始构建第一个LangChain应用程序", startSeconds: 165 },
    { time: "05:30", title: "链式操作", description: "学习如何创建和管理复杂的链式操作", startSeconds: 330 },
    { time: "08:15", title: "内存管理", description: "了解LangChain中的内存管理机制", startSeconds: 495 }
  ],
  'default': [
    { time: "00:00", title: "LangChain简介", description: "LangChain框架的基础概念和应用场景介绍", startSeconds: 0 },
    { time: "00:35", title: "LangChain生态系统概述", description: "深入了解LangChain生态系统和相关工具", startSeconds: 35 },
    { time: "01:20", title: "环境设置", description: "配置开发环境和必要的依赖项", startSeconds: 80 },
    { time: "02:45", title: "第一个LangChain应用", description: "从零开始构建第一个LangChain应用程序", startSeconds: 165 }
  ]
};

// 模拟视频字幕数据
export const mockVideoTranscripts: Record<string, VideoTranscript[]> = {
  'dQw4w9WgXcQ': [
    { time: "00:00", text: "欢迎来到LangChain完整教程。在这个5小时的课程中，我们将从基础开始，逐步深入到高级应用。", startSeconds: 0 },
    { time: "00:15", text: "LangChain是一个强大的框架，它可以帮助开发者构建基于大语言模型的应用程序。", startSeconds: 15 },
    { time: "00:35", text: "首先，让我们了解一下LangChain的生态系统。它包括多个组件，每个组件都有特定的功能。", startSeconds: 35 },
    { time: "01:00", text: "核心组件包括LLM、链、代理、内存管理等。这些组件可以组合使用来创建复杂的AI应用。", startSeconds: 60 },
    { time: "01:20", text: "现在我们开始设置开发环境。首先，您需要安装Python和相关的依赖包。", startSeconds: 80 },
    { time: "01:45", text: "使用pip install langchain来安装基础包。根据您的需求，可能还需要安装其他相关包。", startSeconds: 105 }
  ],
  'default': [
    { time: "00:00", text: "这是默认的字幕内容，展示了视频的基本结构。", startSeconds: 0 },
    { time: "00:30", text: "字幕会帮助您更好地理解视频内容，特别是对于技术性较强的内容。", startSeconds: 30 },
    { time: "01:00", text: "您可以通过点击字幕来跳转到对应的时间点。", startSeconds: 60 }
  ]
};
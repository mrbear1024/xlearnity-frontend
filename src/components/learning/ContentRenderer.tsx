import { LearningContent } from "@/types/learning";
import VideoPlayer from "@/components/learning-space/VideoPlayer";
import { Suspense } from "react";

// 内容渲染器组件 - 使用控制反转原则
interface ContentRendererProps {
  content: LearningContent;
  onProgressUpdate?: (progress: number, position?: any) => void;
  className?: string;
}

// 内容渲染器映射 - 可扩展设计
const contentRenderers = {
  video: VideoRenderer,
  pdf: PDFRenderer,
  markdown: MarkdownRenderer,
  chat: ChatRenderer,
};

const ContentRenderer = ({ content, onProgressUpdate, className }: ContentRendererProps) => {
  const Renderer = contentRenderers[content.type];
  
  if (!Renderer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">不支持的内容类型: {content.type}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense fallback={<ContentLoadingSkeleton type={content.type} />}>
        <Renderer content={content} onProgressUpdate={onProgressUpdate} />
      </Suspense>
    </div>
  );
};

// 视频渲染器
function VideoRenderer({ content, onProgressUpdate }: { content: LearningContent; onProgressUpdate?: (progress: number, position?: any) => void }) {
  if (content.type !== 'video') return null;
  
  return (
    <div className="space-y-4">
      <VideoPlayer 
        embedUrl={content.url.includes('youtube.com') ? `https://www.youtube.com/embed/${extractVideoId(content.url)}` : content.url}
        videoUrl={content.url}
      />
      {content.chapters && (
        <div className="space-y-2">
          <h3 className="font-semibold">章节</h3>
          {content.chapters.map((chapter) => (
            <div key={chapter.id} className="p-2 border rounded cursor-pointer hover:bg-muted">
              <div className="font-medium">{chapter.title}</div>
              <div className="text-sm text-muted-foreground">
                {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// PDF 渲染器（占位符）
function PDFRenderer({ content }: { content: LearningContent; onProgressUpdate?: (progress: number, position?: any) => void }) {
  if (content.type !== 'pdf') return null;
  
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">PDF 内容</h3>
        <p className="text-muted-foreground">{content.title}</p>
        <p className="text-sm text-muted-foreground mt-2">PDF 渲染器即将推出</p>
      </div>
    </div>
  );
}

// Markdown 渲染器（占位符）
function MarkdownRenderer({ content }: { content: LearningContent; onProgressUpdate?: (progress: number, position?: any) => void }) {
  if (content.type !== 'markdown') return null;
  
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-8">
        <h3 className="text-lg font-semibold mb-4">{content.title}</h3>
        <div className="prose max-w-none">
          <p className="text-muted-foreground">Markdown 渲染器即将推出</p>
        </div>
      </div>
    </div>
  );
}

// 聊天渲染器
function ChatRenderer({ content }: { content: LearningContent; onProgressUpdate?: (progress: number, position?: any) => void }) {
  if (content.type !== 'chat') return null;
  
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.405L3 21l1.405-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-4">开始与AI助手对话</h2>
        <p className="text-muted-foreground mb-6">
          我可以帮助您学习任何主题，回答问题，或者协助您分析学习内容。请在右侧聊天区域开始对话。
        </p>
      </div>
    </div>
  );
}

// 加载骨架屏
function ContentLoadingSkeleton({ type }: { type: string }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-muted rounded-lg h-64"></div>
      <div className="space-y-2">
        <div className="bg-muted rounded h-4 w-3/4"></div>
        <div className="bg-muted rounded h-4 w-1/2"></div>
      </div>
    </div>
  );
}

// 工具函数
function extractVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default ContentRenderer;
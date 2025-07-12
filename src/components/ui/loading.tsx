import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// 基础Loading组件
interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'skeleton';
}

export const Loading = ({ 
  className, 
  size = 'md', 
  variant = 'spinner' 
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )} />
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        'animate-pulse bg-gray-200 rounded',
        sizeClasses[size],
        className
      )} />
    );
  }

  return <Skeleton className={cn(sizeClasses[size], className)} />;
};

// 列表项Loading组件
interface ListItemSkeletonProps {
  count?: number;
  className?: string;
  showAvatar?: boolean;
  showIcon?: boolean;
}

export const ListItemSkeleton = ({ 
  count = 3, 
  className, 
  showAvatar = false, 
  showIcon = false 
}: ListItemSkeletonProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          {showAvatar && <Skeleton className="w-8 h-8 rounded-full" />}
          {showIcon && <Skeleton className="w-4 h-4 rounded" />}
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 卡片Loading组件
interface CardSkeletonProps {
  count?: number;
  className?: string;
  showImage?: boolean;
}

export const CardSkeleton = ({ 
  count = 3, 
  className, 
  showImage = false 
}: CardSkeletonProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-2 rounded-lg p-6">
          {showImage && <Skeleton className="w-full h-32 mb-4" />}
          <div className="text-center space-y-2">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-20 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 内容区域Loading组件
interface ContentSkeletonProps {
  lines?: number;
  className?: string;
  showTitle?: boolean;
}

export const ContentSkeleton = ({ 
  lines = 6, 
  className, 
  showTitle = true 
}: ContentSkeletonProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && <Skeleton className="h-6 w-48 mb-4" />}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-4",
              i === lines - 1 ? "w-3/4" : "w-full"
            )} 
          />
        ))}
      </div>
    </div>
  );
};

// 章节列表Loading组件
export const ChapterListSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-6 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 字幕列表Loading组件
export const TranscriptListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-12 h-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
};

// 页面级Loading组件
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <CardSkeleton count={3} />
          <div className="mt-16">
            <Skeleton className="h-16 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}; 
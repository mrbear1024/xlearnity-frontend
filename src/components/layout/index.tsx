import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 基础布局组件接口
interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

// 应用级布局组件
interface AppLayoutProps extends BaseLayoutProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export const AppLayout = ({ 
  children, 
  sidebar, 
  header, 
  footer, 
  className 
}: AppLayoutProps) => {
  return (
    <div className={cn("min-h-screen flex bg-background", className)}>
      {sidebar && sidebar}
      <div className="flex-1 flex flex-col">
        {header && header}
        <main className="flex-1">{children}</main>
        {footer && footer}
      </div>
    </div>
  );
};

// 主页布局组件
export const MainLayout = ({ children, className }: BaseLayoutProps) => {
  return (
    <div className={cn("min-h-screen flex bg-background", className)}>
      {children}
    </div>
  );
};

// 学习空间布局组件
interface LearningLayoutProps extends BaseLayoutProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  showResizable?: boolean;
}

export const LearningLayout = ({ 
  children, 
  sidebar, 
  header, 
  leftPanel, 
  rightPanel, 
  showResizable = true,
  className 
}: LearningLayoutProps) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {header && header}
      <div className="flex">
        {sidebar && sidebar}
        <div className="flex-1 flex">
          {leftPanel && (
            <div className="flex-1">
              {leftPanel}
            </div>
          )}
          {rightPanel && (
            <div className="w-80 border-l border-border">
              {rightPanel}
            </div>
          )}
          {!leftPanel && !rightPanel && (
            <div className="flex-1">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 内容区域布局组件
interface ContentLayoutProps extends BaseLayoutProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

export const ContentLayout = ({ 
  children, 
  maxWidth = '4xl', 
  padding = 'md',
  centered = true,
  className 
}: ContentLayoutProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  return (
    <div className={cn(
      paddingClasses[padding],
      centered && 'flex-1',
      className
    )}>
      <div className={cn(
        maxWidthClasses[maxWidth],
        centered && 'mx-auto',
        'w-full'
      )}>
        {children}
      </div>
    </div>
  );
};

// 卡片布局组件
interface CardLayoutProps extends BaseLayoutProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const CardLayout = ({ 
  children, 
  title, 
  description, 
  actions, 
  variant = 'default',
  className 
}: CardLayoutProps) => {
  const variantClasses = {
    default: 'bg-card border border-border',
    outlined: 'border-2 border-border',
    elevated: 'bg-card border border-border shadow-lg'
  };

  return (
    <div className={cn(
      'rounded-lg overflow-hidden',
      variantClasses[variant],
      className
    )}>
      {(title || description || actions) && (
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// 栅格布局组件
interface GridLayoutProps extends BaseLayoutProps {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const GridLayout = ({ 
  children, 
  columns = 3, 
  gap = 'md',
  responsive = true,
  className 
}: GridLayoutProps) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const responsiveClasses = responsive ? {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12'
  } : columnClasses;

  return (
    <div className={cn(
      'grid',
      responsive ? responsiveClasses[columns] : columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// 弹性布局组件
interface FlexLayoutProps extends BaseLayoutProps {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FlexLayout = ({ 
  children, 
  direction = 'row', 
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  className 
}: FlexLayoutProps) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// 分割布局组件
interface SplitLayoutProps extends BaseLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftRatio?: number;
  rightRatio?: number;
  resizable?: boolean;
  vertical?: boolean;
}

export const SplitLayout = ({ 
  children, 
  left, 
  right, 
  leftRatio = 70, 
  rightRatio = 30,
  resizable = false,
  vertical = false,
  className 
}: SplitLayoutProps) => {
  if (resizable) {
    // 这里需要使用ResizablePanel组件
    return (
      <div className={cn(
        'flex',
        vertical ? 'flex-col' : 'flex-row',
        'h-full',
        className
      )}>
        {/* 这里应该集成ResizablePanel组件 */}
        {children}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex',
      vertical ? 'flex-col' : 'flex-row',
      'h-full',
      className
    )}>
      <div style={{ flex: leftRatio }}>
        {left}
      </div>
      <div style={{ flex: rightRatio }}>
        {right}
      </div>
    </div>
  );
};

// 默认导出
export default {
  AppLayout,
  MainLayout,
  LearningLayout,
  ContentLayout,
  CardLayout,
  GridLayout,
  FlexLayout,
  SplitLayout
}; 
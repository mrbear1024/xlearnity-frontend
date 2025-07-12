import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// 基础组件props接口
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// 可点击组件接口
export interface ClickableProps {
  onClick?: () => void;
  disabled?: boolean;
}

// 可加载组件接口
export interface LoadableProps {
  isLoading?: boolean;
  loadingComponent?: ReactNode;
}

// 带错误状态的组件接口
export interface ErrorableProps {
  error?: string | null;
  onErrorRetry?: () => void;
}

// 组件大小类型
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 组件变体类型
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';

// 动作按钮接口
export interface ActionButtonProps extends BaseComponentProps, ClickableProps {
  icon: LucideIcon;
  label: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
}

// 搜索栏接口
export interface SearchBarProps extends BaseComponentProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  actions?: ActionButtonProps[];
  disabled?: boolean;
}

// 文件上传区域接口
export interface FileUploadZoneProps extends BaseComponentProps {
  onFileUpload?: (files: FileList) => void;
  acceptedTypes?: string;
  maxFileSize?: number;
  multiple?: boolean;
}

// 功能卡片接口
export interface FeatureCardProps extends BaseComponentProps, ClickableProps {
  icon: string;
  title: string;
  description: string;
  variant?: ComponentVariant;
}

// 列表项接口
export interface ListItemProps extends BaseComponentProps, ClickableProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  active?: boolean;
  timestamp?: Date;
}

// 导航项接口
export interface NavigationItemProps extends BaseComponentProps, ClickableProps {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  badge?: string | number;
  href?: string;
}

// 模态框接口
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
  size?: ComponentSize;
}

// 表单字段接口
export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// 输入框接口
export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'search';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// 文本区域接口
export interface TextareaProps extends FormFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

// 选择器接口
export interface SelectProps extends FormFieldProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// 复选框接口
export interface CheckboxProps extends FormFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

// 单选按钮接口
export interface RadioProps extends FormFieldProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value: string;
  onChange: (value: string) => void;
}

// 开关接口
export interface SwitchProps extends FormFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// 滑块接口
export interface SliderProps extends FormFieldProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

// 标签页接口
export interface TabsProps extends BaseComponentProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: LucideIcon;
    content: ReactNode;
    disabled?: boolean;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

// 手风琴接口
export interface AccordionProps extends BaseComponentProps {
  items: Array<{
    id: string;
    title: string;
    content: ReactNode;
    disabled?: boolean;
  }>;
  activeItems: string[];
  onItemChange: (itemId: string) => void;
  allowMultiple?: boolean;
}

// 分页接口
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  size?: ComponentSize;
}

// 表格列接口
export interface TableColumn<T = any> {
  id: string;
  label: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => ReactNode;
}

// 表格接口
export interface TableProps<T = any> extends BaseComponentProps, LoadableProps {
  columns: TableColumn<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string, order: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
}

// 卡片接口
export interface CardProps extends BaseComponentProps, ClickableProps {
  title?: string;
  description?: string;
  image?: string;
  footer?: ReactNode;
  variant?: ComponentVariant;
  size?: ComponentSize;
  elevated?: boolean;
}

// 徽章接口
export interface BadgeProps extends BaseComponentProps {
  text: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  dot?: boolean;
}

// 头像接口
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: ComponentSize;
  shape?: 'circle' | 'square';
}

// 工具提示接口
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
}

// 弹出框接口
export interface PopoverProps extends BaseComponentProps {
  trigger: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
  offset?: number;
}

// 通知接口
export interface NotificationProps {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// 侧边栏接口
export interface SidebarProps extends BaseComponentProps {
  position?: 'left' | 'right';
  width?: string | number;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

// 头部接口
export interface HeaderProps extends BaseComponentProps {
  title?: string;
  logo?: ReactNode;
  actions?: ReactNode;
  navigation?: NavigationItemProps[];
  height?: string | number;
}

// 布局接口
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  centered?: boolean;
}

// 主题接口
export interface ThemeProps {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// 响应式断点
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// 响应式值类型
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// 间距类型
export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64; 
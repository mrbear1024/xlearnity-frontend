// 标签页配置接口
export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ComponentType<object>;
  component: React.ComponentType<object>;
  disabled?: boolean;
}

// 动态标签页接口
export interface DynamicTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

// 旧的接口定义（保持向后兼容）
export interface LoadingProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  skeleton?: React.ComponentType;
}

// UI 组件通用接口
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading?: boolean;
  skeleton?: React.ComponentType;
}

export interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  tooltip?: string;
}

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  actions?: ActionButtonProps[];
  disabled?: boolean;
}

export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  component: React.ComponentType<any>;
  disabled?: boolean;
}

export interface DynamicTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

import { MessageCircle, CreditCard, BarChart3, FileEdit } from "lucide-react";
import { LearningTool, ContentType } from "@/types/learning";
import DynamicTabs from "@/components/common/DynamicTabs";
import ChatTab from "@/components/learning-space/components/ChatTab";
import FlashcardsTab from "@/components/learning-space/components/FlashcardsTab";
import QuizTab from "@/components/learning-space/components/QuizTab";
import SummaryTab from "@/components/learning-space/components/SummaryTab";

interface LearningToolsPanelProps {
  contentType: ContentType;
  activeTab: string;
  onTabChange: (tab: string) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  chatMessages: any[];
  onSendMessage: () => void;
}

// 学习工具配置 - 可扩展设计
const learningTools: LearningTool[] = [
  {
    id: 'chat',
    name: '聊天',
    icon: 'MessageCircle',
    description: 'AI助手对话',
    supportedTypes: ['video', 'pdf', 'markdown', 'chat'],
    component: ChatTab,
  },
  {
    id: 'flashcards',
    name: '抽认卡',
    icon: 'CreditCard', 
    description: '知识点记忆卡片',
    supportedTypes: ['video', 'pdf', 'markdown'],
    component: FlashcardsTab,
  },
  {
    id: 'quiz',
    name: '测验',
    icon: 'BarChart3',
    description: '知识测试',
    supportedTypes: ['video', 'pdf', 'markdown'],
    component: QuizTab,
  },
  {
    id: 'summary',
    name: '摘要',
    icon: 'FileEdit',
    description: '内容总结',
    supportedTypes: ['video', 'pdf', 'markdown'],
    component: SummaryTab,
  },
];

const iconMap = {
  MessageCircle,
  CreditCard,
  BarChart3,
  FileEdit,
};

const LearningToolsPanel = ({
  contentType,
  activeTab,
  onTabChange,
  chatMessage,
  setChatMessage,
  chatMessages,
  onSendMessage,
}: LearningToolsPanelProps) => {
  // 根据内容类型过滤支持的工具
  const supportedTools = learningTools.filter(tool => 
    tool.supportedTypes.includes(contentType)
  );

  // 转换为 DynamicTabs 所需的格式
  const tabs = supportedTools.map(tool => ({
    id: tool.id,
    label: tool.name,
    icon: iconMap[tool.icon as keyof typeof iconMap],
    component: () => {
      // 为不同的组件传递适当的 props
      if (tool.id === 'chat') {
        return (
          <ChatTab
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            chatMessages={chatMessages}
            onSendMessage={onSendMessage}
          />
        );
      }
      return <tool.component />;
    },
  }));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <DynamicTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};

export default LearningToolsPanel;
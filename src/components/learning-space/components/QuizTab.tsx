import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LearningToolsGrid from "./LearningToolsGrid";

const QuizTab = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Quiz Welcome */}
      <div className="p-4 text-center border-b border-border flex-shrink-0">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
      </div>

      {/* Content Area - 可滚动区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">测验功能</h3>
              <p className="text-sm text-muted-foreground mb-4">基于视频内容生成测验题目</p>
              <Button>开始测验</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
import { BookOpen, Brain, Eye, CreditCard, FileEdit, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const LearningToolsGrid = () => {
  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="text-xs">小测验</span>
        </Button>
        <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
          <Brain className="h-4 w-4" />
          <span className="text-xs">思维导图</span>
        </Button>
        <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="text-xs">语音模式</span>
        </Button>
        <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="text-xs">抽认卡</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
          <FileEdit className="h-3 w-3" />
          <span className="text-xs">抽认卡</span>
        </Button>
        <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          <span className="text-xs">搜索</span>
        </Button>
        <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className="text-xs">时间表</span>
        </Button>
      </div>
    </div>
  );
};

export default LearningToolsGrid;
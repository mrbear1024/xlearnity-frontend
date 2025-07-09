import { FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import LearningToolsGrid from "./LearningToolsGrid";

const SummaryTab = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Summary Welcome */}
      <div className="p-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <FileEdit className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
      </div>

      {/* Learning Tools Grid */}
      <LearningToolsGrid />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <FileEdit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">摘要功能</h3>
            <p className="text-sm text-muted-foreground mb-4">获取视频的关键要点总结</p>
            <Button>生成摘要</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
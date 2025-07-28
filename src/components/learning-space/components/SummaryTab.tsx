import { FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import LearningToolsGrid from "./LearningToolsGrid";

const SummaryTab = () => {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <FileEdit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">摘要功能</h3>
              <p className="text-sm text-muted-foreground mb-4">获取视频的关键要点总结</p>
              <Button>生成摘要</Button>
            </div>
          </div>
        </div>
      
  );
};

export default SummaryTab;
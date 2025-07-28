import { BookOpen, Brain, Mic, CreditCard, FileEdit, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const LearningToolsGrid = () => {
  const handleToolClick = (toolName: string) => {
    console.log(`点击了 ${toolName}`);
    // TODO: 实现具体的工具功能
  };

  return (
    <div className="p-4 space-y-3">
      {/* 上排：2x2 网格 */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('小测验')}
        >
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-medium">小测验</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('思维导图')}
        >
          <Brain className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-medium">思维导图</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('语音模式')}
        >
          <Mic className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-medium">语音模式</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('抽认卡')}
        >
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-medium">抽认卡</span>
        </Button>
      </div>
      
      {/* 下排：3x1 网格 */}
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-3 flex flex-col items-center gap-1 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('抽认卡')}
        >
          <FileEdit className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">抽认卡</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-3 flex flex-col items-center gap-1 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('搜索')}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">搜索</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-auto p-3 flex flex-col items-center gap-1 hover:bg-muted/50 transition-colors"
          onClick={() => handleToolClick('时间表')}
        >
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">时间表</span>
        </Button>
      </div>
    </div>
    
  );
};

export default LearningToolsGrid;
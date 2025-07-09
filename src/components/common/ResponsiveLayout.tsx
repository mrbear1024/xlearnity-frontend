import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ResponsiveLayoutProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const ResponsiveLayout = ({
  config,
  sidebar,
  main,
  rightPanel,
  onLayoutChange,
}: ResponsiveLayoutProps) => {
  const {
    showSidebar = true,
    showRightPanel = true,
    sidebarWidth = 20,
    rightPanelWidth = 30,
    layout = 'triple'
  } = config;

  // 单面板布局
  if (layout === 'single') {
    return (
      <div className="min-h-screen bg-background flex">
        {showSidebar && sidebar}
        <div className="flex-1">
          {main}
        </div>
      </div>
    );
  }

  // 双面板布局
  if (layout === 'dual') {
    return (
      <div className="min-h-screen bg-background flex">
        {showSidebar && sidebar}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={100 - rightPanelWidth} minSize={30}>
            {main}
          </ResizablePanel>
          {showRightPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel 
                defaultSize={rightPanelWidth} 
                minSize={20} 
                maxSize={70}
              >
                {rightPanel}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    );
  }

  // 三面板布局（默认）
  return (
    <div className="min-h-screen bg-background flex">
      {showSidebar && sidebar}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel 
          defaultSize={100 - rightPanelWidth} 
          minSize={30}
        >
          {main}
        </ResizablePanel>
        
        {showRightPanel && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel 
              defaultSize={rightPanelWidth} 
              minSize={20} 
              maxSize={70}
            >
              {rightPanel}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default ResponsiveLayout;
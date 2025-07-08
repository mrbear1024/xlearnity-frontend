import { Plus, Clock, FolderOpen, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useRecentActivities, useUserSpaces, useUserProfile } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  onAddContent: () => void;
}

const Sidebar = ({ onAddContent }: SidebarProps) => {
  const navigate = useNavigate();
  
  // 使用API钩子获取数据
  const { data: recentActivities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: spaces, isLoading: spacesLoading } = useUserSpaces();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-background rounded-sm"></div>
          </div>
          <span className="font-semibold text-lg">YouLearn</span>
        </div>
        
        <Button 
          onClick={onAddContent}
          className="w-full justify-start bg-youlearn-primary hover:bg-youlearn-primary/90 text-youlearn-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加内容
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* History */}
        <div className="p-4 border-b border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            历史
          </Button>
        </div>

        {/* Recent Activities */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">近期活动</h3>
          <div className="space-y-1">
            {activitiesLoading ? (
              // 加载骨架屏
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </>
            ) : (
              recentActivities?.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => {
                    if (activity.url) {
                      navigate(`/learning-space?url=${encodeURIComponent(activity.url)}`);
                    } else {
                      navigate('/learning-space');
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm",
                    activity.active 
                      ? "bg-youlearn-secondary text-youlearn-secondary-foreground" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activity.active ? "bg-youlearn-primary" : "bg-muted-foreground"
                  )} />
                  <span className="truncate">{activity.title}</span>
                </div>
              ))
            )}
            <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground mt-2">
              显示更多
            </Button>
          </div>
        </div>

        {/* Spaces */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">空间</h3>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground mb-2">
            <Plus className="w-4 h-4 mr-2" />
            创建空间
          </Button>
          <div className="space-y-1">
            {spacesLoading ? (
              // 加载骨架屏
              <>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </>
            ) : (
              spaces?.map((space) => (
                <div
                  key={space.id}
                  className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm text-muted-foreground hover:bg-muted"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span className="flex-1 truncate">{space.name}</span>
                  <span className="text-xs">{space.count} 内容</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground mb-2">帮助与工具</div>
        <div className="text-xs text-youlearn-primary bg-youlearn-secondary px-2 py-1 rounded-md mb-3">
          {profileLoading ? <Skeleton className="h-4 w-16" /> : userProfile?.plan}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {profileLoading ? (
            <Skeleton className="h-4 flex-1" />
          ) : (
            <span>{userProfile?.email}</span>
          )}
          <Settings className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
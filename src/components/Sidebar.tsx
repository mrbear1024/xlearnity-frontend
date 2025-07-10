import { Plus, Clock, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useRecentActivities, useUserProfile } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatSession } from "@/types/chat";
import { useLanguage } from "@/hooks/useLanguage";

interface SidebarProps {
  onAddContent: () => void;
  chatSessions?: ChatSession[];
  currentSessionId?: string | null;
}

const Sidebar = ({
  onAddContent,
  chatSessions,
  currentSessionId
}: SidebarProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // 使用API钩子获取数据
  const {
    data: recentActivities,
    isLoading: activitiesLoading
  } = useRecentActivities();
  const {
    data: userProfile,
    isLoading: profileLoading
  } = useUserProfile();

  const handleChatSessionClick = (sessionId: string) => {
    navigate(`/learning-space?mode=chat&sessionId=${sessionId}`);
  };

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-background rounded-sm"></div>
          </div>
          <span className="font-semibold text-lg">{t('sidebar.appName')}</span>
        </div>
        
        <Button onClick={() => navigate('/')} className="w-full justify-start bg-youlearn-primary hover:bg-youlearn-primary/90 text-youlearn-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          {t('sidebar.addContent')}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* History */}
        <div className="p-4 border-b border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            {t('sidebar.history')}
          </Button>
        </div>

        {/* Chat Sessions */}
        {chatSessions && chatSessions.length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('sidebar.chatSessions')}</h3>
            <div className="space-y-1">
              {chatSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => handleChatSessionClick(session.id)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm",
                    session.id === currentSessionId
                      ? "bg-youlearn-secondary text-youlearn-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="truncate">{session.title || t('sidebar.newSession')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('sidebar.recentActivity')}</h3>
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
              recentActivities?.map(activity => (
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
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activity.active ? "bg-youlearn-primary" : "bg-muted-foreground"
                    )}
                  />
                  <span className="truncate">{activity.title}</span>
                </div>
              ))
            )}
            <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground mt-2">
              {t('sidebar.showMore')}
            </Button>
          </div>
        </div>

        {/* Spaces - Hidden for next version development */}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground mb-2">{t('sidebar.helpAndTools')}</div>
        <div className="text-xs text-youlearn-primary bg-youlearn-secondary px-2 py-1 rounded-md mb-3">
          {profileLoading ? <Skeleton className="h-4 w-16" /> : userProfile?.plan}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {profileLoading ? <Skeleton className="h-4 flex-1" /> : <span>{userProfile?.email}</span>}
          <Settings className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
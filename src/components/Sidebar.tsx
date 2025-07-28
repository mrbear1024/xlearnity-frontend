import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChatSession } from "@/types/chat";
import { useLanguage } from "@/hooks/useLanguage";
import AppLogo from "@/components/navigation/AppLogo";
import ChatSessionsList from "@/components/navigation/ChatSessionsList";
import RecentActivitiesList from "@/components/navigation/RecentActivitiesList";
import UserProfile from "@/components/navigation/UserProfile";

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

  const handleChatSessionClick = (sessionId: string) => {
    navigate(`/learning-space?mode=chat&sessionId=${sessionId}`);
  };

  const handleRecentActivityClick = (activityId: number, url?: string) => {
    console.log(activityId, url);
    if (url && activityId) {
      navigate(`/learning-space?content_id=${activityId}&url=${encodeURIComponent(url)}`);
    } else {
      navigate('/learning-space');
    }
  };

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <AppLogo className="mb-4" />
        
        <Button 
          onClick={() => navigate('/')} 
          className="w-full justify-start bg-youlearn-primary hover:bg-youlearn-primary/90 text-youlearn-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('sidebar.addContent')}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* History */}
        <div className="p-4 border-b border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            {t('sidebar.history')}
          </Button>
        </div>

        {/* Chat Sessions */}
        <ChatSessionsList
          sessions={chatSessions || []}
          currentSessionId={currentSessionId}
          onSessionClick={handleChatSessionClick}
        />

        {/* Recent Activities */}
        <RecentActivitiesList
          onActivityClick={handleRecentActivityClick}
        />

        {/* Spaces - Hidden for next version development */}
      </div>

      {/* Footer */}
      <UserProfile />
    </div>
  );
};

export default Sidebar;
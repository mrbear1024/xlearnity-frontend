import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/types/chat";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatSessionsListProps {
  sessions: ChatSession[];
  currentSessionId?: string | null;
  onSessionClick?: (sessionId: string) => void;
  className?: string;
}

const ChatSessionsList = ({ 
  sessions, 
  currentSessionId, 
  onSessionClick, 
  className 
}: ChatSessionsListProps) => {
  const { t } = useLanguage();

  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <div className={cn("p-4 border-b border-border", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {t('sidebar.chatSessions')}
      </h3>
      <div className="space-y-1">
        {sessions.map(session => (
          <div
            key={session.id}
            onClick={() => onSessionClick?.(session.id)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors",
              session.id === currentSessionId
                ? "bg-youlearn-secondary text-youlearn-secondary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{session.title || t('sidebar.newSession')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSessionsList; 
import { Button } from "@/components/ui/button";
import { ListItemSkeleton } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { useRecentActivities } from "@/hooks/useApi";
import { useLanguage } from "@/hooks/useLanguage";

interface RecentActivitiesListProps {
  onActivityClick?: (activityId: number, url: string) => void;
  className?: string;
}

const RecentActivitiesList = ({ onActivityClick, className }: RecentActivitiesListProps) => {

  const { data: recentActivities, isLoading: activitiesLoading } = useRecentActivities();
  const { t } = useLanguage();

  const handleActivityClick = (activityId: number, url?: string) => {
    if (onActivityClick) {
      onActivityClick(activityId, url);
    }
  };

  return (
    <div className={cn("p-4 border-b border-border", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {t('sidebar.recentActivity')}
      </h3>
      <div className="space-y-1">
        {activitiesLoading ? (
          <ListItemSkeleton count={3} showIcon={true} />
        ) : (
          recentActivities?.map(activity => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity.id, activity.url)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors",
                activity.active
                  ? "bg-youlearn-secondary text-youlearn-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
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
  );
};

export default RecentActivitiesList; 
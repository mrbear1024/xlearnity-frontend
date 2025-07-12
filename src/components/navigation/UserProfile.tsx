import { Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/useApi";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  className?: string;
}

const UserProfile = ({ className }: UserProfileProps) => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { t } = useLanguage();

  return (
    <div className={cn("p-4 border-t border-border", className)}>
      <div className="text-sm text-muted-foreground mb-2">
        {t('sidebar.helpAndTools')}
      </div>
      <div className="text-xs text-youlearn-primary bg-youlearn-secondary px-2 py-1 rounded-md mb-3">
        {profileLoading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          t(userProfile?.plan || 'plan.free')
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {profileLoading ? (
          <Skeleton className="h-4 flex-1" />
        ) : (
          <span className="truncate">{userProfile?.email}</span>
        )}
        <Settings className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors" />
      </div>
    </div>
  );
};

export default UserProfile; 
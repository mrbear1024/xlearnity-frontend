import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
}

const AppLogo = ({ className }: AppLogoProps) => {
  const { t } = useLanguage();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
        <div className="w-3 h-3 bg-background rounded-sm"></div>
      </div>
      <span className="font-semibold text-lg">{t('sidebar.appName')}</span>
    </div>
  );
};

export default AppLogo; 
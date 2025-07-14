import { Card, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/loading";
import { useContinueStudying } from "@/hooks/useApi";
import { useLanguage } from "@/hooks/useLanguage";
import { Activity } from "@/types";
import { PlayCircle, FileText, Clock, MoreVertical } from "lucide-react";

interface ContinueStudyingSectionProps {
  onItemClick?: (item: Activity) => void;
  className?: string;
}

const ContinueStudyingSection = ({ onItemClick, className }: ContinueStudyingSectionProps) => {
  const { data: continueStudying, isLoading: studyingLoading } = useContinueStudying();
  const { t } = useLanguage();

  const handleItemClick = (item: Activity) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const getContentIcon = (type: string) => {
    return type === 'video' ? PlayCircle : FileText;
  };

  const getContentTypeDisplay = (type: string) => {
    return type === 'video' ? t('type.video') : t('type.document');
  };

  if (studyingLoading) {
    return (
      <div className={className}>
        <h2 className="text-xl font-semibold mb-4">{t('home.continueStudying')}</h2>
        <CardSkeleton count={4} showImage={false} />
      </div>
    );
  }

  if (!continueStudying || continueStudying.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">{t('home.continueStudying')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {continueStudying.map((item) => {
          const IconComponent = getContentIcon(item.type);
          return (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-youlearn-primary/20 group"
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-4">
                {/* 内容类型图标区域 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-youlearn-primary/10 group-hover:bg-youlearn-primary/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-youlearn-primary" />
                  </div>
                  <MoreVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* 标题 */}
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-foreground group-hover:text-youlearn-primary transition-colors">
                  {item.title}
                </h3>

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <span className="px-2 py-1 rounded-full bg-youlearn-muted text-youlearn-muted-foreground">
                      {getContentTypeDisplay(item.type)}
                    </span>
                  </span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>继续学习</span>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-3">
                  <div className="w-full bg-youlearn-muted rounded-full h-1">
                    <div 
                      className="bg-youlearn-primary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(item.id * 7) % 60 + 20}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueStudyingSection; 
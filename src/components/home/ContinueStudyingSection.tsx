import { Card, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/loading";
import { useContinueStudying } from "@/hooks/useApi";
import { useLanguage } from "@/hooks/useLanguage";
import { Activity } from "@/types";

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

  if (studyingLoading) {
    return (
      <div className={className}>
        <h2 className="text-xl font-semibold mb-4">{t('home.continueStudying')}</h2>
        <CardSkeleton count={4} showImage={true} />
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
        {continueStudying.map((item) => (
          <Card 
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border hover:border-youlearn-primary/20"
            onClick={() => handleItemClick(item)}
          >
            <CardContent className="p-4">
              {item.thumbnail && (
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground">
                {t(item.type === 'video' ? 'type.video' : 'type.document')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContinueStudyingSection; 
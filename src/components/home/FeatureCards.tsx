import { Card, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/loading";
import { useFeatures } from "@/hooks/useApi";
import { useLanguage } from "@/hooks/useLanguage";
import { getIconComponent } from "@/utils/iconMapping";

interface FeatureCardsProps {
  onFeatureClick?: (featureTitle: string) => void;
  className?: string;
}

const FeatureCards = ({ onFeatureClick, className }: FeatureCardsProps) => {
  const { data: features, isLoading: featuresLoading } = useFeatures();
  const { t } = useLanguage();

  // 默认的功能动作映射
  const handleFeatureClick = (featureTitle: string) => {
    if (onFeatureClick) {
      onFeatureClick(featureTitle);
    }
  };

  if (featuresLoading) {
    return <CardSkeleton count={3} className={className} />;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features?.map((feature, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-youlearn-primary/20"
            onClick={() => handleFeatureClick(feature.title)}
          >
            <CardContent className="p-6 text-center scale-90">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground mb-4">
                {(() => {
                  const IconComponent = getIconComponent(feature.icon);
                  return <IconComponent className="w-8 h-8 text-background" />;
                })()}
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(feature.title)}</h3>
              <p className="text-muted-foreground text-sm">{t(feature.description)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards; 
import { useState, useRef, useEffect } from "react";
import { ArrowUp, Plus, Globe, Upload, Sparkles, Settings, Volume2, Mic, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RecordAudioDialog from "@/components/RecordAudioDialog";
import { useFeatures, useContinueStudying } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconComponent } from "@/utils/iconMapping";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/common/SearchBar";
import ActionButton from "@/components/common/ActionButton";
import { useLanguage } from "@/hooks/useLanguage";

interface MainContentProps {
  onAddContent: () => void;
}

const MainContent = ({ onAddContent }: MainContentProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // 国际化
  const { currentLanguage, changeLanguage, initializeLanguage, t } = useLanguage();

  // 使用API钩子获取数据
  const { data: features, isLoading: featuresLoading } = useFeatures();
  const { data: continueStudying, isLoading: studyingLoading } = useContinueStudying();
  
  // 初始化语言设置
  useEffect(() => {
    initializeLanguage();
  }, []);

  const handleFileUpload = (files: FileList) => {
    console.log("Files uploaded:", files);
    // Handle file upload logic here
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  // 开始聊天功能
  const handleStartChat = () => {
    // 创建新的聊天会话并跳转到学习空间的聊天模式
    navigate('/learning-space?mode=chat');
  };

  // 处理搜索栏的聊天启动
  const handleChatFromSearch = () => {
    if (chatMessage.trim()) {
      // 带着初始消息跳转到聊天页面
      navigate(`/learning-space?mode=chat&message=${encodeURIComponent(chatMessage.trim())}`);
    } else {
      handleStartChat();
    }
  };

  // 动态获取功能动作映射
  const getFeatureAction = (titleKey: string) => {
    switch (titleKey) {
      case "features.upload.title":
        return handleUploadClick;
      case "features.paste.title":
        return onAddContent;
      case "features.record.title":
        return () => setIsRecordDialogOpen(true);
      default:
        return onAddContent;
    }
  };

  return (
    <div 
      className={`flex-1 flex flex-col min-h-screen bg-background relative ${isDragOver ? 'bg-youlearn-primary/5' : ''}`}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        accept="audio/*,video/*,.pdf,.doc,.docx,.txt"
      />
      
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-youlearn-primary/10 backdrop-blur-sm">
          <div className="text-center p-8 border-2 border-dashed border-youlearn-primary bg-background rounded-lg">
            <Upload className="w-12 h-12 text-youlearn-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-youlearn-primary">{t('home.dragDropText')}</p>
            <p className="text-sm text-muted-foreground mt-2">{t('home.supportedFormats')}</p>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-youlearn-primary text-youlearn-primary hover:bg-youlearn-primary hover:text-youlearn-primary-foreground"
            >
              {t('header.upgrade')}
            </Button>
            <Button 
              variant="outline"
              className="hover:bg-muted"
            >
              {t('header.loginRegister')}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
                  <span className="text-lg">{currentLanguage === 'zh' ? '🇨🇳' : '🇺🇸'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-1 z-50 bg-background border border-border shadow-lg" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-sm h-8 ${currentLanguage === 'zh' ? 'bg-muted' : ''}`}
                    onClick={() => changeLanguage('zh')}
                  >
                    <span className="mr-2">🇨🇳</span>
                    {t('header.chinese')}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-sm h-8 ${currentLanguage === 'en' ? 'bg-muted' : ''}`}
                    onClick={() => changeLanguage('en')}
                  >
                    <span className="mr-2">🇺🇸</span>
                    {t('header.english')}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">⌘K</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-12">{t('home.title')}</h1>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuresLoading ? (
              // 加载骨架屏
              [...Array(3)].map((_, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-8 text-center">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-20 mx-auto mb-2" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : (
              features?.map((feature, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-youlearn-primary/20"
                  onClick={getFeatureAction(feature.title)}
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
              ))
            )}
          </div>

          {/* Modern Search Bar - 使用重构后的组件 */}
          <div className="max-w-4xl mx-auto mb-16">
            <SearchBar
              placeholder={t('home.searchPlaceholder')}
              value={chatMessage}
              onChange={setChatMessage}
              onSubmit={handleChatFromSearch}
              actions={[
                {
                  icon: ArrowUp,
                  label: t('actions.sendMessage'),
                  onClick: handleChatFromSearch,
                },
                {
                  icon: Plus,
                  label: t('actions.addContent'),
                  onClick: onAddContent,
                },
                {
                  icon: Globe,
                  label: t('actions.searchWeb'),
                  onClick: () => console.log("Search web"),
                },
                {
                  icon: Upload,
                  label: t('actions.uploadFile'), 
                  onClick: handleUploadClick,
                },
                {
                  icon: Sparkles,
                  label: t('actions.aiFeatures'),
                  onClick: () => console.log("AI features"),
                },
                {
                  icon: Settings,
                  label: t('actions.settings'),
                  onClick: () => console.log("Settings"),
                },
                {
                  icon: Mic,
                  label: t('actions.voiceInput'),
                  onClick: () => setIsRecordDialogOpen(true),
                },
                {
                  icon: Volume2,
                  label: t('actions.voicePlayback'),
                  onClick: () => console.log("Voice playback"),
                }
              ]}
            />
          </div>
        </div>
      </main>

      {/* Continue Learning Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t('home.continueStudying')}</h2>
            <Button variant="ghost" className="text-youlearn-primary hover:text-youlearn-primary">
              {t('home.viewAll')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {studyingLoading ? (
              // 加载骨架屏
              [...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                </Card>
              ))
            ) : (
              continueStudying?.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{item.title}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
      
      <RecordAudioDialog 
        open={isRecordDialogOpen}
        onOpenChange={setIsRecordDialogOpen}
      />
    </div>
  );
};

export default MainContent;
import { useState, useRef } from "react";
import { Upload, Link, Mic, Search, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RecordAudioDialog from "@/components/RecordAudioDialog";
import { useFeatures, useContinueStudying } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconComponent } from "@/utils/iconMapping";

interface MainContentProps {
  onAddContent: () => void;
}

const MainContent = ({ onAddContent }: MainContentProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 使用API钩子获取数据
  const { data: features, isLoading: featuresLoading } = useFeatures();
  const { data: continueStudying, isLoading: studyingLoading } = useContinueStudying();

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
  // 动态获取功能动作映射
  const getFeatureAction = (title: string) => {
    switch (title) {
      case "上传":
        return handleUploadClick;
      case "粘贴":
        return onAddContent;
      case "记录":
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
            <p className="text-lg font-medium text-youlearn-primary">拖拽文件到这里上传</p>
            <p className="text-sm text-muted-foreground mt-2">支持音频、视频、文档等格式</p>
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
              升级
            </Button>
            <Button 
              variant="outline"
              className="hover:bg-muted"
            >
              登录
            </Button>
            <Button 
              className="bg-youlearn-primary hover:bg-youlearn-primary/90 text-youlearn-primary-foreground"
            >
              注册
            </Button>
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
          <h1 className="text-4xl font-bold text-center mb-12">你想学什么?</h1>

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
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-4`}>
                      {(() => {
                        const IconComponent = getIconComponent(feature.icon);
                        return <IconComponent className={`w-8 h-8 ${feature.color}`} />;
                      })()}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative bg-muted/30 rounded-2xl p-6">
              <Input
                placeholder="学习任何东西"
                className="w-full py-3 px-4 bg-background border-none rounded-xl text-left focus:ring-2 focus:ring-youlearn-primary focus:ring-offset-2 text-base"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Default</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="bg-youlearn-primary hover:bg-youlearn-primary/90 text-white rounded-full px-4 h-8 text-sm"
                >
                  <Search className="w-4 h-4 mr-1" />
                  搜索
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Continue Learning Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">继续学习</h2>
            <Button variant="ghost" className="text-youlearn-primary hover:text-youlearn-primary">
              查看全部
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
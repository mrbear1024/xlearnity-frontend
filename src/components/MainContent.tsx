import { useState, useRef, useEffect } from "react";
import { ArrowUp, Plus, Globe, Upload, Sparkles, Volume2, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import RecordAudioDialog from "@/components/RecordAudioDialog";
import SearchBar from "@/components/common/SearchBar";
import FileUploadZone, { FileUploadZoneRef } from "@/components/home/FileUploadZone";
import AppHeader from "@/components/home/AppHeader";
import FeatureCards from "@/components/home/FeatureCards";
import ContinueStudyingSection from "@/components/home/ContinueStudyingSection";
import { ContentLayout } from "@/components/layout";
import { Activity } from "@/types";

interface MainContentProps {
  onAddContent: () => void;
}

const MainContent = ({ onAddContent }: MainContentProps) => {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const fileUploadRef = useRef<FileUploadZoneRef>(null);
  const navigate = useNavigate();
  const { t, initializeLanguage } = useLanguage();

  // 初始化语言设置
  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  // 处理文件上传
  const handleFileUpload = (files: FileList) => {
    console.log("Files uploaded:", files);
    // Handle file upload logic here
  };

  // 开始聊天功能
  const handleStartChat = () => {
    navigate('/learning-space?mode=chat');
  };

  // 处理搜索栏的聊天启动
  const handleChatFromSearch = () => {
    if (chatMessage.trim()) {
      navigate(`/learning-space?mode=chat&message=${encodeURIComponent(chatMessage.trim())}`);
    } else {
      handleStartChat();
    }
  };

  // 处理功能卡片点击
  const handleFeatureClick = (featureTitle: string) => {
    switch (featureTitle) {
      case "features.upload.title":
        fileUploadRef.current?.triggerUpload();
        break;
      case "features.paste.title":
        onAddContent();
        break;
      case "features.record.title":
        setIsRecordDialogOpen(true);
        break;
      default:
        onAddContent();
    }
  };

  // 处理继续学习项目点击
  const handleContinueStudyingClick = (item: Activity) => {
    if (item.url) {
      navigate(`/learning-space?url=${encodeURIComponent(item.url)}`);
    } else {
      navigate('/learning-space');
    }
  };

  return (
    <FileUploadZone
      ref={fileUploadRef}
      onFileUpload={handleFileUpload}
      className="flex-1 flex flex-col min-h-screen bg-background"
    >
      <AppHeader />
      
      <ContentLayout maxWidth="4xl" padding="md">
        {/* 页面标题 */}
        <h1 className="text-4xl font-bold text-center mb-12">{t('home.title')}</h1>

        {/* 功能卡片 */}
        <FeatureCards onFeatureClick={handleFeatureClick} className="mb-12" />

        {/* 搜索栏 */}
        <div className="mb-16">
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
                onClick: () => fileUploadRef.current?.triggerUpload(),
              },
              {
                icon: Sparkles,
                label: t('actions.aiFeatures'),
                onClick: () => console.log("AI features"),
              },
              {
                icon: Volume2,
                label: t('actions.textToSpeech'),
                onClick: () => console.log("Text to speech"),
              },
              {
                icon: Mic,
                label: t('actions.voiceInput'),
                onClick: () => setIsRecordDialogOpen(true),
              },
            ]}
          />
        </div>

        {/* 继续学习部分 */}
        <ContinueStudyingSection 
          onItemClick={handleContinueStudyingClick}
          className="mb-12"
        />
      </ContentLayout>

      {/* 录音对话框 */}
      <RecordAudioDialog 
        open={isRecordDialogOpen}
        onOpenChange={setIsRecordDialogOpen}
      />
    </FileUploadZone>
  );
};

export default MainContent;
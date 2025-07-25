import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Sidebar from "@/components/Sidebar";
import AddContentDialog from "@/components/AddContentDialog";
import LearningSpaceHeader from "@/components/learning-space/LearningSpaceHeader";
import VideoPlayer from "@/components/learning-space/VideoPlayer";
import ContentTabs from "@/components/learning-space/ContentTabs";
import AIAssistantSidebar from "@/components/learning-space/AIAssistantSidebar";
import LoadingSkeleton from "@/components/learning-space/LoadingSkeleton";
import { useLearningSpace } from "@/hooks/useLearningSpace";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiService } from "@/services/api";

const LearningSpace = () => {
  const {
    mode,
    activeTab,
    setActiveTab,
    isAddContentDialogOpen,
    setIsAddContentDialogOpen,
    activeRightTab,
    setActiveRightTab,
    chatMessage,
    setChatMessage,
    realTimeChapters,
    realTimeTranscript,
    chatMessages,
    setChatMessages,
    chapters,
    chaptersLoading,
    transcript,
    transcriptLoading,
    handleTitleLoaded,
    handleChaptersLoaded,
    handleTranscriptLoaded,
    embedUrl,
    handleChapterClick,
    handleTranscriptClick,
    isLoading,
    title,
    videoUrl,
    chatSessions,
    currentSessionId,
  } = useLearningSpace();

 


  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <LearningSpaceHeader title={title} />

      <div className="flex">
        <Sidebar 
          onAddContent={() => setIsAddContentDialogOpen(true)}
          chatSessions={chatSessions}
          currentSessionId={currentSessionId}
        />
        
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {mode !== 'chat' && (
            <>
              <ResizablePanel defaultSize={70} minSize={30}>
                <div className="p-6">
                  <VideoPlayer 
                    embedUrl={embedUrl} 
                    videoUrl={videoUrl} 
                    onTitleLoaded={handleTitleLoaded}
                    onChaptersLoaded={handleChaptersLoaded}
                    onTranscriptLoaded={handleTranscriptLoaded}
                  />
                  
                  <ContentTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    chapters={
                      realTimeChapters.length > 0
                        ? realTimeChapters
                        : chapters
                    }
                    transcript={
                      realTimeTranscript.length > 0
                        ? realTimeTranscript
                        : transcript
                    }
                    chaptersLoading={chaptersLoading && realTimeChapters.length === 0 && !externalChapters}
                    transcriptLoading={transcriptLoading && realTimeTranscript.length === 0 && !externalTranscript}
                    onChapterClick={handleChapterClick}
                    onTranscriptClick={handleTranscriptClick}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel 
            defaultSize={mode === 'chat' ? 100 : 30} 
            minSize={mode === 'chat' ? 100 : 20} 
            maxSize={mode === 'chat' ? 100 : 50}
          >
            <AIAssistantSidebar
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              mode={mode}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <AddContentDialog 
        open={isAddContentDialogOpen} 
        onOpenChange={setIsAddContentDialogOpen}
      />
    </div>
  );
};

export default LearningSpace;
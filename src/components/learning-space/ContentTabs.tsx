import { BookOpen, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChapterListSkeleton, TranscriptListSkeleton } from "@/components/ui/loading";
import { VideoChapter, VideoTranscript } from "@/types/youtube";
import { secondsToTime } from "@/utils/youtube";

interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chapters: VideoChapter[] | undefined;
  transcript: VideoTranscript[] | undefined;
  chaptersLoading: boolean;
  transcriptLoading: boolean;
  onChapterClick: (startSeconds: number) => void;
  onTranscriptClick: (startSeconds: number) => void;
}

const ContentTabs = ({
  activeTab,
  setActiveTab,
  chapters,
  transcript,
  chaptersLoading,
  transcriptLoading,
  onChapterClick,
  onTranscriptClick
}: ContentTabsProps) => {
  // 将秒数转换为分:秒格式 (MM:SS)
  const formatTimeToMMSS = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="chapters" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          章节
        </TabsTrigger>
        <TabsTrigger value="transcript" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          文字稿
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chapters" className="space-y-4">
        {chaptersLoading ? (
          <ChapterListSkeleton count={4} />
        ) : chapters && chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <div 
              key={`chapter-${index}-${chapter.start_time}`} 
              className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onChapterClick(chapter.start_time)}
            >
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  {formatTimeToMMSS(chapter.start_time)} - {formatTimeToMMSS(chapter.end_time)}
                </Badge>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">{chapter.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {chapter.title}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-center">没有章节信息</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="transcript">
        <div className="border border-border rounded-lg p-6">
          {transcriptLoading ? (
            <TranscriptListSkeleton count={6} />
          ) : transcript && transcript.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium mb-4">视频字幕</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transcript.map((item, index) => (
                  <div 
                    key={`transcript-${index}-${item.start}`}
                    className="flex gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onTranscriptClick(item.start)}
                  >
                    <Badge variant="outline" className="text-xs">
                      {formatTimeToMMSS(item.end)}
                    </Badge>
                    <p className="text-sm leading-relaxed flex-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">暂无字幕信息</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
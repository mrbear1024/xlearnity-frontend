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
    // console.log("seconds: ", seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-1">
        <TabsTrigger value="chapters" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          章节
        </TabsTrigger>
        <TabsTrigger value="transcript" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          文字稿
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chapters" className="space-y-2 mt-0 ">
      <div className="space-y-0 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded scrollbar-track-rounded">

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
        </div>
      </TabsContent>

      <TabsContent value="transcript">
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          {transcriptLoading ? (
            <TranscriptListSkeleton count={6} />
          ) : transcript && transcript.length > 0 ? (
            <div className="space-y-0 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded scrollbar-track-rounded">
              {transcript.map((item, index) => (
                <div 
                  key={`transcript-${index}-${item.start}`}
                  className="flex gap-4 py-3 px-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => onTranscriptClick(item.start)}
                >
                  <div className="text-blue-600 font-medium text-sm min-w-[48px] pt-1">
                    {formatTimeToMMSS(item.start)}
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed flex-1 pt-1">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">暂无字幕信息</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
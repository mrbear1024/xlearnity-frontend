import { useState, useContext } from "react";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { apiService } from "@/services/api";
import { AppContext } from "@/contexts/AppContext";
import { Loading } from "@/components/ui/loading"; // 如果没有 Loading 组件，换成 Spinner 或 CircularProgress

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- 工具函数区 ---
// 提取 YouTube video_id
function extractYoutubeVideoId(url: string): string | null {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// 生成内容参数
function getContentParams(url: string, notes: string) {
  if (url) {
    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
    if (isYoutube) {
      const videoId = extractYoutubeVideoId(url);
      return {
        source_type: "youtube",
        source_id: videoId || url,
        title: url,
      };
    }
    return {
      source_type: "url",
      source_id: url,
      title: url,
    };
  }
  return {
    source_type: "text",
    source_id: "",
    title: notes.slice(0, 20),
  };
}

const AddContentDialog = ({ open, onOpenChange }: AddContentDialogProps) => {
  // --- State & Context ---
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false); // 新增
  const navigate = useNavigate();
  const { t } = useLanguage();
  const appContext = useContext(AppContext);
  const user = appContext?.state.user;

  // --- 事件处理函数 ---
  const handleSubmit = async () => {
    if (!url && !notes) return;
    if (!user) {
      alert("请先登录后再添加内容。\nPlease log in before adding content.");
      return;
    }
    // 判断是否为 YouTube
    const isYoutubeType = url && (url.includes("youtube.com") || url.includes("youtu.be"));
    setIsYoutube(!!isYoutubeType);
    setLoading(true);
    try {
      const { source_type, source_id, title } = getContentParams(url, notes);
      const space_id = "mock_space_id"; // TODO: 从 context 或 props 获取
      const user_id = user.id;
      await apiService.addContent({
        space_id,
        source_type,
        source_id,
        title,
        user_id,
      });
      if (source_type === "youtube") {
        navigate(`/learning-space?url=${encodeURIComponent(url)}`);
      }
      handleClose();
    } catch {
      alert("添加内容失败");
    } finally {
      setLoading(false);
      setIsYoutube(false); // 复位
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setUrl("");
    setNotes("");
  };

  // --- 渲染分块 ---
  // 新增：渲染 loading 提示
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-4">
      <Loading className="w-6 h-6 mb-2" /> {/* 如果没有 className 属性可删掉 */}
      <div className="text-sm text-muted-foreground">
        {isYoutube
          ? "正在解析视频的内容，这可能需要一点时间"
          : t('dialog.addContent.adding') || "正在添加内容，这可能需要一点时间，请稍候..."}
      </div>
    </div>
  );

  const renderInputSection = () => (
    <div className="space-y-4">
      <div>
        <Input
          placeholder={t('dialog.addContent.urlPlaceholder')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="text-center text-muted-foreground">{t('dialog.addContent.or')}</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          {t('dialog.addContent.pasteText')}
        </div>
        <div className="text-xs text-muted-foreground">{t('dialog.addContent.pasteDescription')}</div>
        <Textarea
          placeholder={t('dialog.addContent.notesPlaceholder')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] resize-none"
        />
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={handleClose}>
        {t('dialog.addContent.cancel')}
      </Button>
      <Button
        onClick={handleSubmit}
        className="bg-foreground text-background hover:bg-foreground/90"
        disabled={(!url && !notes) || loading}
      >
        {loading ? t('dialog.addContent.adding') : t('dialog.addContent.add')}
      </Button>
    </div>
  );

  // --- 主渲染 ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-5 h-5 border border-muted-foreground rounded"></div>
            {t('dialog.addContent.title')}
          </DialogTitle>
        </DialogHeader>
        {loading && renderLoading()}
        {!loading && renderInputSection()}
        {renderActions()}
      </DialogContent>
    </Dialog>
  );
};

export default AddContentDialog;
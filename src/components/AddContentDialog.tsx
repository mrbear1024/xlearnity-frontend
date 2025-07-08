import { useState } from "react";
import { X, FileText } from "lucide-react";
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

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddContentDialog = ({ open, onOpenChange }: AddContentDialogProps) => {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      // Navigate to YouTube learning page with the URL
      navigate(`/learning-space?url=${encodeURIComponent(url)}`);
      onOpenChange(false);
      setUrl("");
      setNotes("");
    } else {
      // Handle other types of content
      console.log("URL:", url);
      console.log("Notes:", notes);
      onOpenChange(false);
      setUrl("");
      setNotes("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUrl("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-5 h-5 border border-muted-foreground rounded"></div>
            YouTube、网站等
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Input
              placeholder="输入 YouTube 链接/播放列表、网站 URL、文档、ArXiv 等"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="text-center text-muted-foreground">或</div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              粘贴文本
            </div>
            <div className="text-xs text-muted-foreground">复制并粘贴文本以添加内容</div>
            <Textarea
              placeholder="在此粘贴您的笔记"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-foreground text-background hover:bg-foreground/90"
            disabled={!url && !notes}
          >
            添加
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentDialog;
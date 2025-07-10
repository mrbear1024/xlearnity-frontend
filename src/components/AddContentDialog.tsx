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
import { useLanguage } from "@/hooks/useLanguage";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddContentDialog = ({ open, onOpenChange }: AddContentDialogProps) => {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

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
            {t('dialog.addContent.title')}
          </DialogTitle>
        </DialogHeader>
        
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
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            {t('dialog.addContent.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-foreground text-background hover:bg-foreground/90"
            disabled={!url && !notes}
          >
            {t('dialog.addContent.add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentDialog;
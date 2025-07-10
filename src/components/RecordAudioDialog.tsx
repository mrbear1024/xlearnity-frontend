import { Mic, Monitor, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface RecordAudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecordAudioDialog = ({ open, onOpenChange }: RecordAudioDialogProps) => {
  const { t } = useLanguage();
  
  const handleMicrophoneRecord = () => {
    console.log("Starting microphone recording...");
    onOpenChange(false);
  };

  const handleBrowserTabRecord = () => {
    console.log("Starting browser tab recording...");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium">
            {t('dialog.recordAudio.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 p-6 border-2 hover:border-youlearn-primary/20"
            onClick={handleMicrophoneRecord}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Mic className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-left">
              <div className="font-medium">{t('dialog.recordAudio.microphone')}</div>
              <div className="text-sm text-muted-foreground">{t('dialog.recordAudio.microphoneDesc')}</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 p-6 border-2 hover:border-youlearn-primary/20"
            onClick={handleBrowserTabRecord}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-left">
              <div className="font-medium">{t('dialog.recordAudio.browserTab')}</div>
              <div className="text-sm text-muted-foreground">{t('dialog.recordAudio.browserTabDesc')}</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordAudioDialog;
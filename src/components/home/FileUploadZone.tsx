import { useState, useRef, ReactNode, useImperativeHandle, forwardRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface FileUploadZoneProps {
  children: ReactNode;
  onFileUpload?: (files: FileList) => void;
  acceptedTypes?: string;
  className?: string;
}

export interface FileUploadZoneRef {
  triggerUpload: () => void;
}

const FileUploadZone = forwardRef<FileUploadZoneRef, FileUploadZoneProps>(({ 
  children, 
  onFileUpload, 
  acceptedTypes = "audio/*,video/*,.pdf,.doc,.docx,.txt",
  className 
}, ref) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileUpload = (files: FileList) => {
    if (onFileUpload) {
      onFileUpload(files);
    }
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

  // 暴露上传功能给父组件
  useImperativeHandle(ref, () => ({
    triggerUpload: handleUploadClick
  }));

  return (
    <div 
      className={cn(
        "relative",
        isDragOver ? 'bg-youlearn-primary/5' : '',
        className
      )}
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
        accept={acceptedTypes}
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
      
      {children}
    </div>
  );
});

FileUploadZone.displayName = 'FileUploadZone';

export default FileUploadZone; 
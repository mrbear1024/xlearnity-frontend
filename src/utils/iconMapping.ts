import { Upload, Link, Mic, LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  "Upload": Upload,
  "Link": Link,
  "Mic": Mic,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Upload;
};
export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  channelName: string;
  publishedAt: string;
  viewCount: string;
}

export interface VideoChapter {
  time: string;
  title: string;
  description: string;
  startSeconds: number;
  endSeconds: number;
}

export interface VideoTranscript {
  time: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
}
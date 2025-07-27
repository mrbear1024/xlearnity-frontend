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


// 英文：Define an interface for a YouTube video section based on the provided JSON structure.
export interface VideoChapter {
  start_time: number; // Section start time in seconds | 分段开始时间（秒）
  title: string;      // Section title | 分段标题
  end_time: number;   // Section end time in seconds | 分段结束时间（秒）
}


export interface VideoTranscript {
  start: number;    // 字幕开始时间（秒） Start time in seconds
  end: number;      // 字幕结束时间（秒） End time in seconds
  text: string;     // 字幕文本 Caption text
}
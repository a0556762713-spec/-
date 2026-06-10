export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelName: string;
  viewCount: string;
  publishedTime: string;
  url: string;
}

export interface LyricsData {
  lyrics: string;
  artistTrivia: string[];
  songFacts: string;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
}

export interface SongRecommendation {
  title: string;
  artist: string;
  year: string;
  reason: string;
  searchQuery: string;
}


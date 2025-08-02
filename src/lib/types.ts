export interface Source {
  id: string;
  name: string;
  url: string;
  articleCount: number;
}

export interface Article {
  id: string;
  sourceId: string;
  title: string;
  content: string[]; // Array of paragraphs for pagination
  sourceName: string;
  onShelf: boolean;
  readPercentage: number;
  currentChapter: string;
}

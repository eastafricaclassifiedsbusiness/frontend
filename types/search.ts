export interface SearchResult {
  locations: Array<{
    type: string;
    value: string;
    count: number;
  }>;
  positions: Array<{
    type: string;
    value: string;
    count: number;
  }>;
  sectors: Array<{
    type: string;
    value: string;
    count: number;
  }>;
  jobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    sector: string;
  }>;
} 
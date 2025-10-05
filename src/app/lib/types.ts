export type GhgEmission = {
  yearMonth: string;   
  emissions: number;   
};

export type Company = {
  id: string;
  name: string;
  country: string;     
  emissions: GhgEmission[];
};

export type Post = {
  id: string;
  title: string;
  resourceUid: string; 
  dateTime: string;    
  content: string;
  reaction?: 'like' | 'dislike' | 'none';
};

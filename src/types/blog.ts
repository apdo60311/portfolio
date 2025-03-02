
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  is_published: boolean;
  cover_image?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

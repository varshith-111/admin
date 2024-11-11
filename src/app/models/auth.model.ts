export interface LoginRequest {
  email: string;
  password: string;
}

export interface ArticleRequest {
  id: string;
  category: string;
  title: string;
  header: string;
  metaTags: string;
  xEmbed: string;
  country: string;
  state: string;
  description: string;
  imageUrl: string[];
  publishedOn: string;
  publishedBy: string;
}

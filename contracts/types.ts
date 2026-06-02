export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface ProjectDTO {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  tech_stack: string[];
  github_url?: string | null;
  demo_url?: string | null;
  featured: boolean;
  status: string;
  cover_image?: string | null;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogDTO {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  tags: string[];
  categories: string[];
  published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactDTO {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  role?: string | null;
  message: string;
  source_page?: string | null;
  country?: string | null;
  ip_address?: string | null;
  status: string;
  created_at: string;
}

export interface About {
  id: string;
  name: string;
  title: string;
  bio: string;
  mission: string;
  profile_image: string;
  cv_url?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  type: 'madrasa' | 'university';
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

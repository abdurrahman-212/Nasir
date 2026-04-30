# Azhari Portfolio - Setup Guide

This is a production-ready full-stack portfolio for **Nasir Uddin Azhari**.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + HttpOnly Cookies

## Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- About Table
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  mission TEXT NOT NULL,
  profile_image TEXT NOT NULL,
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'madrasa' or 'university'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts (Blog) Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Rich Text content
  excerpt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Table (Single Row)
CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  social_links JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Environment Variables

Ensure the following are set in your `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Auth
JWT_SECRET=your_random_secret
ADMIN_USERNAME=xadminNasir
ADMIN_PASSWORD=212NasirAdmin
```

## Running the App
1. `npm install`
2. `npm run dev`
3. Visit `http://localhost:3000`
4. Login at `/admin/login` using the credentials provided.

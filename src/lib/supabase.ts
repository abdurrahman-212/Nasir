import { createClient } from '@supabase/supabase-js'

const normalizeUrl = (url: string) => {
  if (!url) return "";
  try {
    let normalized = url.trim().replace(/^"|"$/g, '').trim();
    if (normalized && !normalized.startsWith('http')) {
      normalized = `https://${normalized}`;
    }
    const urlObj = new URL(normalized);
    // Return origin to ensure no trailing slash or subpaths
    return urlObj.origin;
  } catch (e) {
    return url;
  }
};

const getSupabaseUrl = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) {
    console.warn('[SUPABASE] VITE_SUPABASE_URL is missing. Using fallback URL.');
    return "https://rdluhgxvfzlbpggcaaha.supabase.co";
  }
  return normalizeUrl(url);
};

const getSupabaseKey = () => {
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim().replace(/^"|"$/g, '').trim();
  
  if (!anonKey) {
    console.error('[SUPABASE] VITE_SUPABASE_ANON_KEY is missing!');
  }
  
  // Return the key if it looks valid
  if (anonKey && anonKey.length > 10) return anonKey;
  
  return anonKey;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseKey();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] CRITICAL: Supabase URL or Anon Key is missing. Check your Vercel Environment Variables (must be prefixed with VITE_).');
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "missing_key")

export const uploadImage = async (file: File, bucket: string = 'portfolio') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) {
      if (error.message.toLowerCase().includes('bucket not found')) {
        throw new Error(`Storage bucket '${bucket}' not found. Please create a public bucket named '${bucket}' in your Supabase dashboard.`);
      }
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl;
  } catch (err: any) {
    console.error('[SUPABASE] Upload error:', err);
    throw err;
  }
}

// API URL based on environment
export const API_BASE_URL = '/api'

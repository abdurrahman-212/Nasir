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

const getSupabaseKey = () => {
  const anonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "").trim().replace(/^"|"$/g, '').trim();
  
  // Ignore placeholders
  if (anonKey && anonKey !== "your_actual_key_here" && anonKey.length > 20) return anonKey;
  // If we have a hardcoded fallback or something, handle it here if needed
  // For now return whatever we have but avoid the specific placeholder
  return anonKey;
};

const supabaseUrl = normalizeUrl(((import.meta as any).env.VITE_SUPABASE_URL || "https://rdluhgxvfzlbpggcaaha.supabase.co"))
const supabaseAnonKey = getSupabaseKey()

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] Supabase URL or Anon Key is missing in client environment.')
} else {
  console.log('[SUPABASE] Client initialized with URL:', supabaseUrl.substring(0, 15) + '...')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

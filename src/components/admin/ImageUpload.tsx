import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}

export default function ImageUpload({ value, onChange, label, bucket = 'portfolio' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      console.log(`[STORAGE] Starting upload for ${file.name} to bucket: ${bucket}`);
      const url = await uploadImage(file, bucket);
      console.log(`[STORAGE] Upload successful! Public URL: ${url}`);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('[STORAGE] Upload error details:', error);
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      
      <div className="flex flex-col gap-4">
        {value ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-brand-primary hover:bg-brand-bg transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-3" />
              ) : (
                <Upload className="w-8 h-8 text-slate-300 mb-3" />
              )}
              <p className="text-sm text-slate-500 font-medium">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">JPG, PNG, GIF (max 2MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}

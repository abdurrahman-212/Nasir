import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../lib/utils';
import { Post } from '../types';
import { Calendar, ChevronLeft, User, Hash } from 'lucide-react';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // In real app, fetch single post
    fetchApi('/posts').then(posts => {
      const found = posts.find((p: Post) => p.id === id);
      if (found) setPost(found);
    }).catch(console.error);
  }, [id]);

  if (!post) return <div className="h-screen flex items-center justify-center font-serif text-2xl">Loading Article...</div>;

  return (
    <article className="py-24 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-brand-primary hover:underline mb-12 font-semibold">
          <ChevronLeft size={20} />
          <span>Back to Articles</span>
        </Link>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-[40px] overflow-hidden shadow-sm shadow-brand-primary/5 p-8 md:p-16 border border-brand-primary/5"
        >
          <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-brand-secondary" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-brand-secondary" />
              <span>By M.N. Azhari</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-brand-secondary" />
              <span>{post.category}</span>
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-10 leading-tight">
            {post.title}
          </h1>

          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-lg prose-brand-primary max-w-none text-slate-600 leading-relaxed space-y-6">
            {/* Real content would be HTML from Rich Text Editor */}
            <p className="font-medium text-slate-900 text-xl">{post.excerpt}</p>
            <p>
              In the heart of scholarly pursuit, we find a bridge between the revelation and reason. This article explores the depths of our tradition, searching for the light that guides the contemporary seeker of knowledge.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <blockquote className="border-l-4 border-brand-secondary pl-6 py-4 italic text-2xl font-serif text-slate-800 bg-brand-bg rounded-r-2xl">
              "To seek knowledge is a sacred obligation for every believer."
            </blockquote>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </motion.div>
      </div>
    </article>
  );
}

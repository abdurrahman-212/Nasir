import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/utils';
import { Post } from '../types';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApi('/posts').then(setPosts).catch(console.error);
  }, []);

  const defaultPosts: Post[] = [
    {
      id: '1',
      title: 'The Golden Age of Islamic Science',
      excerpt: 'Exploring the contributions of Muslim scholars to astronomy, mathematics, and medicine during the Abbasid Caliphate.',
      content: '',
      image_url: 'https://images.unsplash.com/photo-1585314062340-f1a5bcb40762?auto=format&fit=crop&q=80&w=800',
      category: 'History',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Nuances of Arabic Grammar in the Quran',
      excerpt: 'A deep dive into how Balagha (rhetoric) shapes the interpretation of divine message.',
      content: '',
      image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      category: 'Linguistics',
      created_at: new Date().toISOString()
    }
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;
  const filteredPosts = displayPosts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h1 className="font-serif text-5xl font-bold text-slate-900 mb-4">Publications</h1>
            <p className="text-slate-500 max-w-lg">Scholarly articles, reflections, and educational resources.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..."
                className="pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-primary/5 focus:ring-2 focus:ring-brand-primary outline-none transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-brand-bg rounded-3xl overflow-hidden border border-brand-primary/5 hover:shadow-2xl transition-all"
            >
              <Link to={`/blog/${post.id}`} className="relative h-64 overflow-hidden">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-primary text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </Link>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-slate-400 text-xs mb-4 space-x-2">
                  <Calendar size={14} />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 group-hover:text-brand-primary transition-colors">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-600 mb-8 line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-brand-primary/5">
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center space-x-2 text-brand-primary font-bold hover:underline">
                    <span>Read Full Article</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

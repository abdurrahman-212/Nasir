import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3,
  Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchApi, cn } from '../../lib/utils';
import ImageUpload from '../../components/admin/ImageUpload';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) throw new Error('No token');
        
        // Use auth/me to verify the token is actually valid with server
        await fetchApi('/auth/me');
        setIsAuth(true);
      } catch (err) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('admin_token');
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Authenticating...</p>
      </div>
    );
  }

  if (!isAuth) return null;

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: <BarChart3 size={20} /> },
    { name: 'Posts', path: '/admin/dashboard/posts', icon: <BookOpen size={20} /> },
    { name: 'Education', path: '/admin/dashboard/education', icon: <GraduationCap size={20} /> },
    { name: 'Skills', path: '/admin/dashboard/skills', icon: <Layers size={20} /> },
    { name: 'Profile', path: '/admin/dashboard/profile', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col pt-8">
        <div className="px-6 mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand-secondary">Admin Desk</h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">NASIR UDDIN AZHARI</p>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isActive ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all font-medium text-sm"
           >
             <LogOut size={20} />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="posts" element={<ManagePosts />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="profile" element={<ManageProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function Overview() {
  const [counts, setCounts] = useState({ posts: 0 });

  useEffect(() => {
    fetchApi('/admin/posts').then(data => {
      if (data) setCounts({ posts: data.length });
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 border-b-4 border-brand-secondary inline-block pb-1">Overview</h1>
        <p className="text-slate-500 mt-4 text-lg font-light leading-relaxed">
          Welcome back, Nasir. Your digital portfolio is currently live and attracting seekers of knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Posts" value={counts.posts.toString()} icon={<BookOpen />} />
        <StatCard title="Site Status" value="Online" icon={<Globe />} color="text-green-500" />
        <StatCard title="Contact Requests" value="0" icon={<Plus />} />
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <p className="text-slate-400 text-sm">Welcome to your dashboard. Use the sidebar to manage your content.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-brand-primary" }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <span className={cn("text-3xl font-serif font-bold", color)}>{value}</span>
      </div>
      <div className="bg-slate-50 p-4 rounded-2xl text-slate-400">
        {icon}
      </div>
    </div>
  );
}

function ManagePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (currentPost) setImageUrl(currentPost.image_url || '');
    else setImageUrl('');
  }, [currentPost]);

  const loadPosts = async () => {
    try {
      const data = await fetchApi('/admin/posts');
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await fetchApi(`/admin/posts/${id}`, { method: 'DELETE' });
      toast.success('Post deleted');
      loadPosts();
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    
    // Auto-generate slug from title if missing, as required by the schema
    const title = (payload.title as string) || '';
    const slug = (payload.slug as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const data = {
      ...payload,
      image_url: imageUrl,
      slug: slug,
      category: payload.category || 'General',
      content: payload.content || '',
      published: true // Default to published for new posts
    };

    try {
      if (currentPost) {
        await fetchApi(`/admin/posts/${currentPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Post updated');
      } else {
        await fetchApi('/admin/posts', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Post created');
      }
      setIsEditing(false);
      setCurrentPost(null);
      setImageUrl('');
      loadPosts();
    } catch (err: any) {
      console.error('Save post error:', err);
      toast.error('Failed to save post: ' + (err.message || 'Server error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Posts</h1>
        {!isEditing && (
          <button 
            onClick={() => { setIsEditing(true); setCurrentPost(null); }}
            className="bg-brand-primary text-white px-6 py-3 rounded-2xl flex items-center space-x-2 font-bold shadow-lg shadow-brand-primary/20"
          >
            <Plus size={18} />
            <span>New Article</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase">Title</label>
                <input 
                  name="title" 
                  defaultValue={currentPost?.title} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase">Category</label>
                <input 
                  name="category" 
                  defaultValue={currentPost?.category} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 uppercase">Excerpt</label>
              <textarea 
                name="excerpt" 
                defaultValue={currentPost?.excerpt} 
                required 
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <ImageUpload 
                label="Article Image"
                value={imageUrl}
                onChange={setImageUrl}
                bucket="posts"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 uppercase">Content (Markdown)</label>
              <textarea 
                name="content" 
                defaultValue={currentPost?.content} 
                required 
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold">Save Post</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6 font-medium text-slate-900">{post.title}</td>
                  <td className="px-8 py-6 text-slate-500 text-sm">
                    <span className="bg-slate-100 px-3 py-1 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-8 py-6 text-slate-400 text-xs">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => { setCurrentPost(post); setIsEditing(true); }}
                        className="text-slate-400 hover:text-brand-primary transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ManageEducation() {
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  useEffect(() => { loadItems(); }, []);
  const loadItems = async () => {
    try {
      const data = await fetchApi('/admin/education');
      setItems(data || []);
    } catch (err) {
      toast.error('Failed to load education data');
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Delete?')) return;
    await fetchApi(`/admin/education/${id}`, { method: 'DELETE' });
    loadItems();
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const method = currentItem ? 'PUT' : 'POST';
    const url = currentItem ? `/admin/education/${currentItem.id}` : '/admin/education';
    
    try {
      await fetchApi(url, { method, body: JSON.stringify(data) });
      toast.success(currentItem ? 'Education updated' : 'Education added');
      setIsEditing(false);
      loadItems();
    } catch (err: any) {
      console.error('Save education error:', err);
      toast.error('Failed to save: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Education</h1>
        {!isEditing && <button onClick={() => { setIsEditing(true); setCurrentItem(null); }} className="bg-brand-primary text-white px-6 py-3 rounded-2xl flex items-center space-x-2 font-bold"><Plus size={18} /><span>Add Entry</span></button>}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-[32px] space-y-6 border border-slate-200">
          <input name="institution" defaultValue={currentItem?.institution} placeholder="Institution" required className="w-full px-4 py-3 border rounded-xl" />
          <input name="degree" defaultValue={currentItem?.degree} placeholder="Degree" required className="w-full px-4 py-3 border rounded-xl" />
          <input name="period" defaultValue={currentItem?.period} placeholder="Period (e.g. 2021-Present)" required className="w-full px-4 py-3 border rounded-xl" />
          <select name="type" defaultValue={currentItem?.type || 'university'} className="w-full px-4 py-3 border rounded-xl">
            <option value="university">University</option>
            <option value="madrasa">Madrasa</option>
            <option value="certification">Certification</option>
          </select>
          <textarea name="description" defaultValue={currentItem?.description} placeholder="Description" rows={4} className="w-full px-4 py-3 border rounded-xl" />
          <div className="flex gap-4">
            <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 text-slate-400">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{item.institution}</h3>
                <p className="text-sm text-brand-primary">{item.degree}</p>
                <p className="text-xs text-slate-400">{item.period}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCurrentItem(item); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-brand-primary"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ManageSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>(null);

  useEffect(() => { loadSkills(); }, []);
  const loadSkills = async () => {
    try {
      const data = await fetchApi('/admin/skills');
      setSkills(data || []);
    } catch (err) {
      toast.error('Failed to load skills');
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const method = currentSkill ? 'PUT' : 'POST';
    const url = currentSkill ? `/admin/skills/${currentSkill.id}` : '/admin/skills';
    
    try {
      await fetchApi(url, { method, body: JSON.stringify(data) });
      toast.success('Skill saved');
      setIsEditing(false);
      loadSkills();
    } catch (err: any) {
      console.error('Save skill error:', err);
      toast.error('Failed to save: ' + err.message);
    }
  };

  const categories = ['Theology', 'Language', 'Academic', 'Modern'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Skills</h1>
        <button onClick={() => { setIsEditing(true); setCurrentSkill(null); }} className="bg-brand-primary text-white px-6 py-3 rounded-2xl flex items-center space-x-2 font-bold"><Plus size={18} /><span>Add Skill</span></button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-[32px] space-y-6 border border-slate-200 shadow-sm">
          <input name="name" defaultValue={currentSkill?.name} placeholder="Skill Name" required className="w-full px-4 py-3 border rounded-xl" />
          <select name="category" defaultValue={currentSkill?.category || 'Academic'} className="w-full px-4 py-3 border rounded-xl">
             {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-4">
            <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 text-slate-400">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat} className="bg-white p-8 rounded-[32px] border border-slate-200">
            <h3 className="font-bold text-brand-secondary mb-4 text-xs uppercase tracking-widest">{cat}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.filter(s => s.category === cat).map(skill => (
                <div key={skill.id} className="group relative px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setCurrentSkill(skill); setIsEditing(true); }} className="text-slate-400 hover:text-brand-primary"><Edit3 size={14} /></button>
                    <button onClick={async () => { 
                      if (confirm('Delete skill?')) {
                        await fetchApi(`/admin/skills/${skill.id}`, { method: 'DELETE' }); 
                        loadSkills(); 
                      }
                    }} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    fetchApi('/admin/about')
      .then(data => { 
        if (data && data.length > 0) {
          setProfile(data[0]); 
          setProfileImage(data[0].profile_image || '');
        }
      })
      .catch(err => {
        console.error('Profile load error:', err);
        toast.error('Could not load profile settings');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      ...Object.fromEntries(formData.entries()),
      profile_image: profileImage,
      content: profile?.content || ''
    };

    try {
      if (profile) {
        await fetchApi(`/admin/about/${profile.id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Profile updated');
      } else {
        const newProfile = await fetchApi('/admin/about', { method: 'POST', body: JSON.stringify(data) });
        setProfile(newProfile);
        toast.success('Profile created');
      }
    } catch (err: any) {
      console.error('Save profile error:', err);
      toast.error('Failed to save profile: ' + (err.message || 'Server error'));
    }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Profile</h1>
      <form onSubmit={handleSave} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name</label>
            <input name="name" defaultValue={profile?.name} required className="w-full px-4 py-3 border rounded-xl font-medium" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title</label>
            <input name="title" defaultValue={profile?.title} required className="w-full px-4 py-3 border rounded-xl font-medium" />
          </div>
        </div>
        
        <ImageUpload 
          label="Profile Picture"
          value={profileImage}
          onChange={setProfileImage}
          bucket="profile"
        />

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Short Bio</label>
          <textarea name="bio" defaultValue={profile?.bio} required rows={4} className="w-full px-4 py-3 border rounded-xl font-medium" />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mission Statement</label>
           <textarea name="mission" defaultValue={profile?.mission} required rows={3} className="w-full px-4 py-3 border rounded-xl font-medium italic" />
        </div>
        <button type="submit" className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all">
          {profile ? 'Save Changes' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-slate-200">
      <h2 className="text-2xl font-serif font-bold text-slate-400 mb-2">{title}</h2>
      <p className="text-slate-400">Content management form interface for {title} would be here.</p>
    </div>
  );
}

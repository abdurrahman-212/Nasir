import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/utils';
import { About as AboutType } from '../types';

export default function About() {
  const [about, setAbout] = useState<AboutType | null>(null);

  useEffect(() => {
    fetchApi('/about').then(data => {
      if (data && data.length > 0) setAbout(data[0]);
    }).catch(console.error);
  }, []);

  const profile = about || {
    name: "MD Nasir Uddin Azhari",
    bio: "MD Nasir Uddin Azhari is a distinguished scholar and student of the world-renowned Al-Azhar University in Cairo, Egypt. Specializing in Islamic Theology and Arabic Linguistics, he bridges the gap between traditional wisdom and contemporary discourse.",
    mission: "To inspire and educate through the timeless principles of Islamic moderate thought (Wasatiyyah), fostering a generation of learners who are deeply rooted in their tradition while being actively engaged with the modern world.",
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
  };

  return (
    <div className="py-20 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white">
              <img src={profile.profile_image} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-brand-primary/10 rounded-[3rem]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="bg-white p-10 rounded-[3rem] border border-brand-border shadow-sm">
              <h1 className="font-serif text-5xl font-bold text-brand-primary mb-6 underline decoration-brand-secondary underline-offset-8">Biography</h1>
              <div className="prose prose-lg text-slate-600 max-w-none font-medium leading-relaxed">
                <p>{profile.bio}</p>
              </div>
            </div>

            <div className="bg-brand-primary p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl" />
              <h2 className="font-serif text-3xl font-bold mb-6 text-brand-secondary uppercase tracking-widest text-sm">Our Mission</h2>
              <p className="text-2xl italic font-light leading-relaxed relative z-10">
                "{profile.mission}"
              </p>
            </div>

            <div className="bg-brand-accent/50 p-10 rounded-[3rem] border border-brand-border">
              <h2 className="font-serif text-3xl font-bold text-brand-primary mb-4">Scholarly Focus</h2>
              <p className="text-slate-700 leading-relaxed font-medium">
                Currently pursuing deep academic research at Al-Azhar University. Azhari's focus lies in the critical analysis of classical texts and their relevance to 21st-century ethics and law.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

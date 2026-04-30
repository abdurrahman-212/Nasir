import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download, ArrowRight, BookOpen, GraduationCap, Mic2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi, cn } from '../lib/utils';
import { About } from '../types';

export default function Home() {
  const [about, setAbout] = useState<About | null>(null);

  useEffect(() => {
    fetchApi('/about').then(data => {
      if (data && data.length > 0) setAbout(data[0]);
    }).catch(() => {});
  }, []);

  const profile = about || {
    name: "MD Nasir Uddin Azhari",
    title: "Academic Researcher & Educator",
    bio: "Dedicated to the synthesis of classical Islamic scholarship with modern academic rigor. Currently pursuing advanced studies at the heart of Islamic learning.",
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-6 min-h-[800px]">
        
        {/* PROFILE HERO (2x2) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-2 bg-brand-primary rounded-[2.5rem] p-10 flex flex-col justify-between text-white border border-brand-primary/20 shadow-2xl overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl -z-0" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-brand-secondary p-1">
              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center text-brand-primary font-bold text-4xl overflow-hidden">
                <img src={profile.profile_image} alt="NA" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase opacity-70 bg-white/10 px-4 py-2 rounded-full font-bold">Al-Azhar University, Cairo</span>
          </div>

          <div className="mt-8 relative z-10">
            <h1 className="text-5xl font-serif font-bold tracking-tight mb-3 text-brand-secondary">{profile.name}</h1>
            <p className="text-xl font-light opacity-90">{profile.title}</p>
            <p className="mt-6 text-sm opacity-70 max-w-md leading-relaxed">
              {profile.bio}
            </p>
          </div>

          <div className="flex gap-4 mt-8 relative z-10">
            <Link to="/about" className="px-8 py-3 bg-brand-secondary text-white rounded-2xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-secondary/20">
              My Journey
            </Link>
            <a href={about?.cv_url || "#"} className="px-8 py-3 bg-white/10 text-white rounded-2xl text-sm border border-white/20 hover:bg-white/20 transition-all">
              Download CV
            </a>
          </div>
        </motion.div>

        {/* QUICK STATS (1x1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 md:row-span-1 bg-white rounded-[2.5rem] p-8 border border-brand-border flex flex-col justify-center hover:shadow-xl transition-all"
        >
          <div className="text-brand-secondary font-serif text-5xl font-bold">12+</div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-primary/60 mt-2">Publications</div>
          <p className="text-[10px] mt-4 text-gray-400 font-medium leading-relaxed">Recent articles published in Islamic Thought and Global Ethic journals.</p>
        </motion.div>

        {/* EDUCATION TIMELINE (1x2) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 md:row-span-2 bg-white rounded-[2.5rem] p-8 border border-brand-border flex flex-col hover:shadow-xl transition-all"
        >
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-6 bg-brand-secondary rounded-full shadow-sm shadow-brand-secondary/40"></span>
            Academic Path
          </h3>
          <div className="space-y-8 relative border-l-2 border-brand-accent ml-3 pl-8">
            <TimelineItem year="2021-PRES" title="Al-Azhar University" sub="Master of Theology" active />
            <TimelineItem year="2016-2020" title="Al-Azhar University" sub="B.A. Islamic Studies" />
            <TimelineItem year="PREV" title="Madrasa Education" sub="Classical Arabic" />
          </div>
        </motion.div>

        {/* LINGUISTICS (1x1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-1 md:row-span-1 bg-brand-accent rounded-[2.5rem] p-8 flex flex-col justify-center border border-brand-border hover:shadow-xl transition-all"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 mb-6 flex items-center gap-2">
            <Globe size={14} />
            Linguistics
          </h3>
          <div className="space-y-4">
            <SkillBar label="Arabic" sub="Native/Classic" />
            <SkillBar label="English" sub="Academic" />
          </div>
        </motion.div>

        {/* SPECIALIZATIONS (2x1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 md:row-span-1 bg-white rounded-[2.5rem] p-10 border border-brand-border hover:shadow-xl transition-all"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
             <Mic2 className="text-brand-secondary" size={20} />
             Specializations
          </h3>
          <div className="flex flex-wrap gap-3">
            <Tag text="Quranic Exegesis" />
            <Tag text="Hadith Methodology" />
            <Tag text="Arabic Rhetoric" />
            <Tag text="Comparative Religion" />
            <Tag text="Modern Ethics" />
            <Tag text="Jurisprudence" />
          </div>
        </motion.div>

        {/* BLOG PREVIEW (1x1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-1 md:row-span-1 bg-white rounded-[2.5rem] p-8 border border-brand-border flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="z-10">
            <p className="text-[10px] font-bold text-brand-secondary uppercase mb-2 tracking-widest">Latest Insight</p>
            <h4 className="text-base font-bold leading-snug group-hover:text-brand-primary transition-colors">The Intersection of Classical Logic and Modern Legal Theory</h4>
          </div>
          <div className="text-[10px] text-gray-400 z-10 font-bold">OCT 2023 • RESEARCH PAPER</div>
          <div className="absolute -bottom-4 -right-2 opacity-[0.03] text-brand-primary font-serif text-[120px] pointer-events-none">
            "
          </div>
        </motion.div>

        {/* CONNECT & SOCIALS (1x1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-1 md:row-span-1 bg-brand-primary rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Let's Connect</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shadow-[0_0_8px_#D4AF37]"></span>
              azhari@example.com
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shadow-[0_0_8px_#D4AF37]"></span>
              @nasir_azhari
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <SocialIcon label="L" />
            <SocialIcon label="T" />
            <SocialIcon label="F" />
          </div>
        </motion.div>

        {/* ADMIN CMS ACCESS (2x1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-2 md:row-span-1 bg-white rounded-[2.5rem] p-8 border border-brand-border flex items-center justify-between hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-bg rounded-[1.5rem] border border-brand-border shadow-sm">
              <BookOpen className="text-brand-primary" size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold">Admin CMS Dashboard</h4>
              <p className="text-xs text-gray-500 font-medium">Securely manage your dynamic portfolio.</p>
            </div>
          </div>
          <Link to="/admin/login" className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20">
            Access Portal
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

function TimelineItem({ year, title, sub, active = false }: any) {
  return (
    <div className="relative">
      <div className={cn(
        "absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-brand-bg z-10 shadow-sm",
        active ? "bg-brand-primary" : "bg-gray-300"
      )}></div>
      <p className={cn("text-[10px] font-bold tracking-widest uppercase mb-1", active ? "text-brand-secondary" : "text-gray-400")}>{year}</p>
      <h4 className="text-sm font-bold text-brand-primary">{title}</h4>
      <p className="text-[11px] text-gray-500 font-medium">{sub}</p>
    </div>
  );
}

function SkillBar({ label, sub }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
        <span className="text-brand-primary">{label}</span>
        <span className="text-brand-secondary">{sub}</span>
      </div>
      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
        <div className="w-full h-full bg-brand-primary rounded-full"></div>
      </div>
    </div>
  );
}

function Tag({ text }: any) {
  return (
    <span className="px-5 py-2.5 bg-brand-bg border border-brand-border rounded-2xl text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-default">
      {text}
    </span>
  );
}

function SocialIcon({ label }: any) {
  return (
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 hover:bg-white/20 transition-all cursor-pointer font-bold text-xs ring-1 ring-white/10">
      {label}
    </div>
  );
}

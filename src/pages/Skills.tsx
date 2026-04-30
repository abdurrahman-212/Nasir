import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/utils';
import { Skill } from '../types';
import { CheckCircle2 } from 'lucide-react';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchApi('/skills').then(setSkills).catch(console.error);
  }, []);

  const defaultSkills: Skill[] = [
    { id: '1', name: 'Classical Arabic', category: 'Language' },
    { id: '2', name: 'Modern Standard Arabic', category: 'Language' },
    { id: '3', name: 'Islamic Jurisprudence (Fiqh)', category: 'Islamic Studies' },
    { id: '4', name: 'Hadith Sciences', category: 'Islamic Studies' },
    { id: '5', name: 'Public Speaking', category: 'Communication' },
    { id: '6', name: 'Content Translation', category: 'Communication' },
    { id: '7', name: 'Educational Research', category: 'Academic' },
    { id: '8', name: 'Curriculum Development', category: 'Academic' },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;
  const categories = Array.from(new Set(displaySkills.map(s => s.category)));

  return (
    <div className="py-24 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl font-bold text-brand-primary mb-4 underline decoration-brand-secondary underline-offset-8">Expertise & Proficiencies</h1>
          <p className="text-gray-500 max-w-lg mx-auto font-medium mt-8">Harnessing traditional scholarly foundations for global impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-brand-border h-full flex flex-col hover:shadow-xl transition-all"
            >
              <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.25em] mb-10 flex items-center justify-between">
                {cat}
                <span className="w-10 h-[1px] bg-brand-border"></span>
              </h2>
              <ul className="space-y-6 flex-grow">
                {displaySkills.filter(s => s.category === cat).map(skill => (
                  <li key={skill.id} className="flex items-start space-x-4 group">
                    <div className="w-6 h-6 rounded-lg bg-brand-bg flex items-center justify-center text-brand-primary/40 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                       <CheckCircle2 size={14} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm tracking-tight group-hover:text-brand-primary transition-colors">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

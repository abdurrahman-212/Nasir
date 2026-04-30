import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/utils';
import { Education as EdType } from '../types';
import { GraduationCap, Award } from 'lucide-react';

export default function Education() {
  const [edu, setEdu] = useState<EdType[]>([]);

  useEffect(() => {
    fetchApi('/education').then(setEdu).catch(console.error);
  }, []);

  const defaultEdu: EdType[] = [
    {
      id: '1',
      institution: 'Al-Azhar University, Cairo',
      degree: 'B.A. in Islamic Studies & Arabic',
      period: '2021 - Present',
      description: 'Engaging in advanced studies of Usul al-Fiqh, Arabic Linguistics, and Islamic History in one of the world\'s oldest and most prestigious institutions.',
      type: 'university'
    },
    {
      id: '2',
      institution: 'Jamia Ahmadiyya Madrasa',
      degree: 'Higher Secondary in Islamic Sciences',
      period: '2015 - 2020',
      description: 'Completed foundational studies in Quranic Tafsir, Hadith notation, and classical Arabic grammar.',
      type: 'madrasa'
    }
  ];

  const displayEdu = edu.length > 0 ? edu : defaultEdu;

  return (
    <div className="py-24 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-brand-primary mb-4 underline decoration-brand-secondary underline-offset-8">Academic Journey</h1>
          <p className="text-gray-500 max-w-lg mx-auto font-medium mt-8">A curated timeline of formal education and scholarly pursuits at the epicenter of Islamic learning.</p>
        </div>

        <div className="space-y-8">
          {displayEdu.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] border border-brand-border hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-border">
                    {item.type === 'university' ? <GraduationCap size={24} /> : <Award size={24} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-primary">{item.institution}</h3>
                    <p className="text-brand-secondary font-bold text-xs uppercase tracking-widest">{item.period}</p>
                  </div>
                </div>
                <div className="bg-brand-accent px-4 py-2 rounded-xl text-xs font-bold text-brand-primary uppercase tracking-widest self-start md:self-center">
                  {item.type}
                </div>
              </div>
              
              <div className="pl-16">
                <h4 className="text-xl font-serif font-bold text-slate-800 mb-3">{item.degree}</h4>
                <p className="text-slate-600 leading-relaxed max-w-2xl font-medium">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

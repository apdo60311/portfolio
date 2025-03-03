
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Map of skill names to colors
const skillColors: Record<string, string> = {
  'JavaScript': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  'TypeScript': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'React': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  'Node.js': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  'Python': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  'GraphQL': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  'Docker': 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'AWS': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  'SQL': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  'MongoDB': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
};

// Get a random color for skills that don't have a predefined color
const getRandomColor = (seed: string) => {
  const colors = [
    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-200 dark:border-lime-800',
    'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800',
    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  ];
  
  // Use the seed to deterministically pick a color
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

interface SkillBadgeProps {
  name: string;
  className?: string;
  animated?: boolean;
}

export const SkillBadge = ({ name, className, animated = true }: SkillBadgeProps) => {
  const colorClass = skillColors[name] || getRandomColor(name);
  
  const badgeContent = (
    <div className={cn(
      "px-3 py-1 rounded-full text-sm font-medium border",
      colorClass,
      className
    )}>
      {name}
    </div>
  );
  
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {badgeContent}
      </motion.div>
    );
  }
  
  return badgeContent;
};

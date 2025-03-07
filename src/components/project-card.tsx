
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { ProjectType } from '@/lib/supabase';
import { SkillBadge } from './skill-badge';

interface ProjectCardProps {
  project: ProjectType;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  // Background styles based on featured status
  const cardBackground = project.featured 
    ? 'bg-gradient-to-br from-primary/5 via-background to-secondary/5 hover:from-primary/10 hover:to-secondary/10'
    : 'glass';

  return (
    <motion.div 
      className={`p-4 sm:p-6 rounded-lg hover:shadow-md hover:shadow-primary/10 transition-all ${cardBackground}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {project.image_url && (
        <div className="mb-4 overflow-hidden rounded-md h-36 sm:h-48">
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      
      <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 3).map((tag, tagIndex) => (
          <SkillBadge key={tagIndex} name={tag} animated={false} />
        ))}
        {project.tags.length > 3 && (
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
            +{project.tags.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex flex-col xs:flex-row items-start xs:items-center xs:justify-between gap-3 xs:gap-0">
        <Link to={`/projects#${project.id}`} className="group inline-flex items-center text-primary hover:underline text-sm sm:text-base">
          View Project <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        
        <div className="flex flex-wrap items-center gap-2">
          {project.featured && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <Star className="h-3 w-3 fill-primary" />
              Featured
            </div>
          )}
          <div className={`text-xs px-2 py-1 rounded-full ${
            project.status === 'completed' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : project.status === 'working' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {project.status.replace('_', ' ')}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

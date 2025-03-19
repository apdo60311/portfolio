
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatsCardProps } from '@/interfaces/stats';



export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  className 
}: StatsCardProps) => {
  return (
    <motion.div 
      className={cn(
        "glass p-4 rounded-xl flex flex-col items-center text-center",
        className
      )}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="p-3 rounded-full bg-secondary/30 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-3xl font-bold text-primary my-2">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
};

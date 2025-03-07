
import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/date-format";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  // Calculate estimated reading time
  const readingTime = Math.ceil((post.content.trim().split(/\s+/).length || 0) / 200);

  return (
    <motion.article 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300",
        featured ? "bg-gradient-to-br from-primary/5 via-background to-secondary/5" : "bg-card"
      )}
    >
      {post.cover_image && (
        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm sm:text-base">
          {post.excerpt}
        </p>
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-0 xs:justify-between items-start xs:items-center text-xs sm:text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            <span className="truncate max-w-[100px]">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{readingTime} min</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.published_at).split(',')[0]}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Link 
            to={`/blog/${post.slug}`} 
            className="inline-flex items-center text-primary hover:underline"
          >
            Read More <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

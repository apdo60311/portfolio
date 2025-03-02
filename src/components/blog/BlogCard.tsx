
import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/date-format";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {post.cover_image && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="skill-tag text-xs">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">By {post.author}</span>
          <span className="text-muted-foreground">{formatDate(post.published_at)}</span>
        </div>
      </div>
    </motion.article>
  );
}

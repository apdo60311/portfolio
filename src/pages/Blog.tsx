
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/services/blog-service";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Calendar, Tag, ArrowUpDown } from "lucide-react";
import { BlogPost } from "@/types/blog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { toast } = useToast();
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: getAllBlogPosts,
  });

  const allTags = posts
    ? Array.from(new Set(posts.flatMap((post) => post.tags)))
    : [];

  const filteredPosts = posts
    ? posts
        .filter(post => !selectedTag || post.tags.includes(selectedTag))
        .filter(post => 
          searchTerm === "" || 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a.published_at).getTime();
          const dateB = new Date(b.published_at).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        })
    : [];

  useEffect(() => {
    const channel = supabase
      .channel('blog-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Blog Post",
              description: `"${payload.new.title}" has been published!`,
              variant: "default",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Blog Post Updated",
              description: `"${payload.new.title}" has been updated.`,
              variant: "default",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <Layout>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-6 
            bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, ideas, and insights on web development, design, and technology.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setSortOrder("newest")}
                  className={sortOrder === "newest" ? "bg-accent" : ""}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOrder("oldest")}
                  className={sortOrder === "oldest" ? "bg-accent" : ""}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Oldest first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedTag(null);
                setSearchTerm("");
                setSortOrder("newest");
              }}
            >
              Clear
            </Button>
          </div>
        </motion.div>

        {allTags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge 
                onClick={() => setSelectedTag(null)}
                className={`cursor-pointer hover:bg-primary transition-colors ${
                  selectedTag === null ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`cursor-pointer hover:bg-primary transition-colors ${
                    selectedTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">
              Error loading blog posts. Please try again later.
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No posts found matching "${searchTerm}".`
                : selectedTag
                  ? `No posts found with the tag "${selectedTag}".`
                  : "No blog posts found."}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
}

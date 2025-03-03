
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/services/blog-service";
import { formatDate } from "@/lib/date-format";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  ClockIcon, 
  UserIcon, 
  TagIcon, 
  Share2,
  Bookmark,
  MessageSquare,
  Heart
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [readingTime, setReadingTime] = useState<number>(0);

  // Redirect to blog page if no slug is provided
  useEffect(() => {
    if (!slug) {
      navigate("/blog");
    }
  }, [slug, navigate]);

  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug(slug || ""),
    enabled: !!slug,
  });

  const {
    data: relatedPosts,
    isLoading: isRelatedLoading,
  } = useQuery({
    queryKey: ["related-posts", post?.id, post?.tags],
    queryFn: () => getRelatedBlogPosts(post?.id || "", post?.tags || [], 3),
    enabled: !!post,
  });

  // Calculate estimated reading time
  useEffect(() => {
    if (post?.content) {
      const words = post.content.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
      setReadingTime(time);
    }
  }, [post]);

  // Handle social sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Blog Post',
        text: post?.excerpt || '',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this post with others",
      });
    }
  };

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isPostLoading) {
    return (
      <Layout>
        <div className="section-container">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="ml-4 text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (postError || !post) {
    return (
      <Layout>
        <div className="section-container">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="section-container max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <TagIcon className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 
            bg-gradient-to-r from-primary to-purple-500 dark:from-blue-400 dark:to-purple-400 
            bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <UserIcon className="mr-1 h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-1 h-4 w-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-1 h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Interaction Icons */}
          <div className="flex items-center gap-2 mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.header>

        {/* Cover Image */}
        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="prose-container"
        >
          <MarkdownRenderer content={post.content} />
        </motion.div>

        {/* Author Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 p-6 bg-primary/5 rounded-lg flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {post.author.slice(0, 1)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold">{post.author}</h3>
            <p className="text-muted-foreground mt-2">
              Writer and contributor passionate about web development and design.
            </p>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6 inline-block pb-1 border-b-2 border-primary">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </Layout>
  );
}


import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/services/blog-service";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: getAllBlogPosts,
  });

  // Get all unique tags
  const allTags = posts
    ? Array.from(new Set(posts.flatMap((post) => post.tags)))
    : [];

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts?.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <Layout>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, ideas, and insights on web development, design, and technology.
          </p>
        </motion.div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedTag(null)}
                className={`skill-tag ${
                  selectedTag === null ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`skill-tag ${
                    selectedTag === tag ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
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
        ) : filteredPosts?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedTag
                ? `No posts found with the tag "${selectedTag}".`
                : "No blog posts found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

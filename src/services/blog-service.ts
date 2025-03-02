
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/blog";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error("Failed to fetch blog posts");
  }

  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Post not found
      return null;
    }
    console.error("Error fetching blog post:", error);
    throw new Error("Failed to fetch blog post");
  }

  return data as BlogPost;
}

export async function getRelatedBlogPosts(
  currentPostId: string, 
  tags: string[], 
  limit: number = 3
): Promise<BlogPost[]> {
  // Fetch posts that have at least one matching tag
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .neq("id", currentPostId) // Exclude current post
    .filter("tags", "cs", `{${tags.join(",")}}`) // Contain any of the tags
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related blog posts:", error);
    throw new Error("Failed to fetch related blog posts");
  }

  return data as BlogPost[];
}

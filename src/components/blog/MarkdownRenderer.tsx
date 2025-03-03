
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose prose-lg dark:prose-invert max-w-none",
      "prose-headings:font-bold prose-headings:tracking-tight",
      "prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8",
      "prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8",
      "prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6",
      "prose-p:leading-relaxed prose-p:my-4",
      "prose-pre:bg-code prose-pre:text-code-foreground prose-pre:border prose-pre:border-border",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-img:rounded-lg prose-img:shadow-md",
      "prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic",
      className
    )}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4 text-gradient-primary" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 relative 
            pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-16 before:bg-primary/50" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-bold mt-6 mb-3" {...props} />,
          p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
          a: ({ node, ...props }) => (
            <a 
              className="text-primary font-medium transition-colors hover:text-primary/80 underline-animation" 
              target={props.href?.startsWith('http') ? "_blank" : undefined}
              rel={props.href?.startsWith('http') ? "noopener noreferrer" : undefined}
              {...props} 
            />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 italic my-6 text-muted-foreground" {...props} />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="relative overflow-x-auto rounded-md my-6 bg-code text-code-foreground">
                <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/20 px-2 py-1 rounded">
                  {match[1]}
                </div>
                <pre className={`${className} p-4 pt-8`}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-code text-code-foreground px-1.5 py-0.5 rounded font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <div className="my-8">
              <img 
                className="rounded-md max-w-full shadow-md hover:shadow-lg transition-shadow duration-300" 
                loading="lazy"
                {...props} 
                alt={props.alt || ""} 
              />
              {props.alt && (
                <p className="text-center text-sm text-muted-foreground mt-2">{props.alt}</p>
              )}
            </div>
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-8">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

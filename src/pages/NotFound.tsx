
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FolderX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <FolderX className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="code-block text-left mb-8">
            <pre>
              <code>
                <span className="code-line">
                  <span className="code-keyword">try</span> {"{"}
                </span>
                <span className="code-line">  <span className="code-function">findPage</span>(<span className="code-string">"{location.pathname}"</span>);</span>
                <span className="code-line">{"}"} <span className="code-keyword">catch</span> (error) {"{"}
                </span>
                <span className="code-line">  <span className="code-function">console.error</span>(<span className="code-string">"404 Page Not Found"</span>);</span>
                <span className="code-line">  <span className="code-function">redirect</span>(<span className="code-string">"/"</span>);</span>
                <span className="code-line">{"}"}</span>
              </code>
            </pre>
          </div>
          <Link to="/">
            <Button size="lg">Return to Home</Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;


import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { Database, Server, Terminal, Download } from "lucide-react";

const TypingEffect = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={isComplete ? "" : "typing-effect"}>
      {displayText}
    </span>
  );
};

const HeroSection = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h1 className="font-mono font-bold tracking-tight mb-4">
          <TypingEffect text="Alex Johnson" delay={150} />
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          <span className="text-primary font-mono">Backend Engineer</span> with expertise in 
          <span className="inline-flex items-center px-1.5"><Database className="h-4 w-4 mr-1" /> Databases</span>, 
          <span className="inline-flex items-center px-1.5"><Terminal className="h-4 w-4 mr-1" /> Machine Learning</span>, and 
          <span className="inline-flex items-center px-1.5"><Server className="h-4 w-4 mr-1" /> DevOps</span>
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to="/projects">
            <Button size="lg" className="rounded-full transition-transform hover:scale-105">
              View Projects
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="rounded-full transition-transform hover:scale-105">
              Contact Me
            </Button>
          </Link>
          <a href="/resume.pdf" download>
            <Button variant="ghost" size="lg" className="rounded-full transition-transform hover:scale-105">
              <Download className="mr-2 h-4 w-4" /> Resume
            </Button>
          </a>
        </div>
        
        <div className="code-block text-left">
          <pre>
            <code>
              <span className="code-line">
                <span className="code-keyword">class</span> <span className="code-function">BackendEngineer</span>:
              </span>
              <span className="code-line">    <span className="code-keyword">def</span> <span className="code-function">__init__</span>(self):</span>
              <span className="code-line">        self.name = <span className="code-string">"Alex Johnson"</span></span>
              <span className="code-line">        self.skills = [<span className="code-string">"Python"</span>, <span className="code-string">"Java"</span>, <span className="code-string">"SQL"</span>, <span className="code-string">"Docker"</span>, <span className="code-string">"Kubernetes"</span>]</span>
              <span className="code-line">        self.passion = <span className="code-string">"Building scalable systems"</span></span>
              <span className="code-line">    </span>
              <span className="code-line">    <span className="code-keyword">def</span> <span className="code-function">solve_problems</span>(self, challenge):</span>
              <span className="code-line">        <span className="code-comment"># Write elegant, efficient code</span></span>
              <span className="code-line">        <span className="code-keyword">return</span> elegant_solution</span>
            </code>
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

const Index = () => {
  return (
    <Layout>
      <HeroSection />
    </Layout>
  );
};

export default Index;

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { 
  Database, 
  Server, 
  Terminal, 
  Download, 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { supabase, ProfileType, ProjectType } from "@/lib/supabase";

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
  const [profile, setProfile] = React.useState<ProfileType | null>(null);
  const [featuredProjects, setFeaturedProjects] = React.useState<ProjectType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .single();
        
        if (profileError) throw new Error(`Error fetching profile: ${profileError.message}`);
        setProfile(profileData);
        
        // Fetch featured projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false });
        
        if (projectsError) throw new Error(`Error fetching projects: ${projectsError.message}`);
        setFeaturedProjects(projectsData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Fallback if data is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading portfolio data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <p className="text-destructive text-lg mb-4">
          Unable to load portfolio data: {error}
        </p>
        <p className="text-muted-foreground mb-4">
          This could be due to a connection issue or missing Supabase configuration.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Fallback content if no data is available
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <p className="text-lg mb-4">
          No profile data found in Supabase.
        </p>
        <p className="text-muted-foreground mb-4">
          Please make sure you've added a profile in your Supabase database.
        </p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            <Terminal className="mr-2 h-4 w-4" />
            <span>{profile.title}</span>
          </motion.div>

          <h1 className="font-mono font-bold tracking-tight mb-4 text-5xl md:text-6xl">
            <TypingEffect text={profile.name} delay={150} />
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="text-primary font-mono">{profile.tagline}</span> with experience in 
            <motion.span 
              className="inline-flex items-center px-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Database className="h-4 w-4 mr-1" /> Databases
            </motion.span>, 
            <motion.span 
              className="inline-flex items-center px-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Terminal className="h-4 w-4 mr-1" /> Backend development
            </motion.span>, and 
            <motion.span 
              className="inline-flex items-center px-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Server className="h-4 w-4 mr-1" /> DevOps
            </motion.span>
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link to="/projects">
              <Button size="lg" className="rounded-full transition-transform hover:scale-105">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full transition-transform hover:scale-105">
                Contact Me <Mail className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="/resume.pdf" download>
              <Button variant="ghost" size="lg" className="rounded-full transition-transform hover:scale-105">
                <Download className="mr-2 h-4 w-4" /> Resume
              </Button>
            </a>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <a 
              href={profile.github_url || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary/50 hover:bg-secondary p-3 rounded-full transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href={profile.linkedin_url || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary/50 hover:bg-secondary p-3 rounded-full transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href={`mailto:${profile.email || "contact@example.com"}`}
              className="bg-secondary/50 hover:bg-secondary p-3 rounded-full transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </motion.div>
          
          <motion.div 
            className="code-block text-left relative overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="absolute top-0 left-0 right-0 h-6 bg-secondary/20 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-xs font-mono text-muted-foreground">software_engineer.py</div>
            </div>
            <pre className="pt-8">
              <code>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="code-keyword">class</span> <span className="code-function">SoftwareEngineer</span>:
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <span className="code-keyword">    def</span> <span className="code-function">__init__</span>(self):
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <span>        self.name = <span className="code-string">"{profile.name}"</span></span>
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <span>        self.skills = [{profile.skills.map(skill => `<span className="code-string">"${skill}"</span>`).join(', ')}]</span>
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <span>        self.passion = <span className="code-string">"{profile.passion}"</span></span>
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  <span>    </span>
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <span className="code-keyword">    def</span> <span className="code-function">solve_problems</span>(self, challenge):
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9 }}
                >
                  <span>        <span className="code-comment"># Write elegant, efficient code</span></span>
                </motion.span>
                <motion.span 
                  className="code-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.0 }}
                >
                  <span><span className="code-keyword">        return</span> elegant_solution</span>
                </motion.span>
              </code>
            </pre>
          </motion.div>
        </motion.div>
      </div>

      <div className="bg-secondary/5 py-16 backdrop-blur-sm">
        <div className="container">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-3">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my recent software engineering projects
            </p>
          </motion.div>

          {featuredProjects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featuredProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="glass p-6 rounded-lg hover:shadow-md hover:shadow-primary/10 transition-all"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="skill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/projects#${project.id}`} className="group inline-flex items-center text-primary hover:underline">
                    View Project <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground">
              No featured projects found.
            </p>
          )}

          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <Link to="/projects">
              <Button variant="outline" className="rounded-full">
                View All Projects <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container py-16">
        <motion.div 
          className="max-w-4xl mx-auto glass p-8 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Let's Build Something Amazing Together</h2>
          <p className="text-muted-foreground mb-6">
            I'm currently available for freelance projects, consulting, and full-time positions.
            If you're looking for a backend engineer with a passion for building scalable systems, let's connect!
          </p>
          <Link to="/contact">
            <Button size="lg" className="rounded-full">
              Get In Touch <Mail className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </React.Fragment>
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


import * as React from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { 
  Code, 
  ExternalLink, 
  Github, 
  Folder,
  Database,
  Server,
  BarChart,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, ProjectType } from "@/lib/supabase";

const Projects = () => {
  const [projects, setProjects] = React.useState<ProjectType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw new Error(`Error fetching projects: ${fetchError.message}`);
      
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const getIconForProject = (project: ProjectType) => {
    // This is a simple way to determine the icon based on tags
    // You could add an icon field to your Supabase table for more control
    const tags = project.tags.map(tag => tag.toLowerCase());
    
    if (tags.some(tag => ['database', 'sql', 'mongodb', 'postgres'].includes(tag))) {
      return <Database className="h-6 w-6" />;
    } else if (tags.some(tag => ['ml', 'ai', 'tensorflow', 'pytorch', 'machine learning'].includes(tag))) {
      return <BarChart className="h-6 w-6" />;
    } else if (tags.some(tag => ['kubernetes', 'docker', 'devops', 'microservices'].includes(tag))) {
      return <Server className="h-6 w-6" />;
    } else {
      return <Folder className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-container flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading projects...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="section-container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
          <p className="text-destructive text-lg mb-4">
            Unable to load projects: {error}
          </p>
          <p className="text-muted-foreground mb-6">
            This could be due to a connection issue or missing Supabase configuration.
          </p>
          <Button onClick={fetchProjects} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-3 py-1 mb-6 text-sm font-medium">
            <Folder className="h-4 w-4 mr-2" />
            <span>Projects</span>
          </div>
          <h1 className="mb-6">
            Technical <span className="text-primary">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A showcase of my recent backend engineering and system architecture work, 
            featuring complex technical challenges and solutions.
          </p>
        </motion.div>

        {projects.length > 0 ? (
          <motion.div
            className="max-w-6xl mx-auto grid gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="glass rounded-lg overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md text-primary mr-3">
                        {getIconForProject(project)}
                      </div>
                      <h3 className="text-xl font-bold">{project.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="skill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {expandedProject === project.id ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {project.challenge && (
                        <div className="mb-4">
                          <h4 className="font-bold mb-2">Challenge</h4>
                          <p className="text-muted-foreground">
                            {project.challenge}
                          </p>
                        </div>
                      )}

                      {project.solution && (
                        <div className="mb-4">
                          <h4 className="font-bold mb-2">Solution</h4>
                          <p className="text-muted-foreground">
                            {project.solution}
                          </p>
                        </div>
                      )}

                      {project.code_snippet && (
                        <div className="mb-4">
                          <h4 className="font-bold mb-2">Code Sample</h4>
                          <div className="code-block">
                            <pre>
                              <code>{project.code_snippet}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() => setExpandedProject(null)}
                      >
                        Show Less
                      </Button>
                    </motion.div>
                  ) : (
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setExpandedProject(project.id)}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      View Details & Code
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto text-center p-12 glass rounded-lg">
            <h3 className="text-xl font-medium mb-4">No Projects Found</h3>
            <p className="text-muted-foreground mb-6">
              It looks like there are no projects in your Supabase database yet. Add some projects to showcase your work.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;

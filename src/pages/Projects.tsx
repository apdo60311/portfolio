import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  Clock,
  CheckCircle,
  Construction,
  Star,
  Search,
  ChevronUp,
  ChevronDown,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase,  } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ProjectType } from "@/types/project";

const Projects = () => {
  const [projects, setProjects] = React.useState<ProjectType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<ProjectType['status'] | "all">("all");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");
  const location = useLocation();
  const projectRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { toast } = useToast();

  React.useEffect(() => {
    fetchProjects();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Change received!', payload);
          toast({
            title: "Project updated",
            description: "Project data has been updated. Refreshing...",
            duration: 3000,
          });
          fetchProjects();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  React.useEffect(() => {
    if (location.hash && !loading) {
      const projectId = location.hash.substring(1);
      if (projectId && projectRefs.current[projectId]) {
        projectRefs.current[projectId]?.scrollIntoView({ behavior: 'smooth' });
        setExpandedProject(projectId);
      }
    }
  }, [location.hash, loading]);

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

  const getStatusIcon = (status: ProjectType['status']) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'under_development':
        return <Construction className="h-4 w-4 text-yellow-500" />;
      case 'completed':
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusText = (status: ProjectType['status']) => {
    switch (status) {
      case 'working':
        return 'Working';
      case 'under_development':
        return 'Under Development';
      case 'completed':
      default:
        return 'Completed';
    }
  };

  const getStatusColor = (status: ProjectType['status']) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'under_development':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getIconForProject = (project: ProjectType) => {
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

  const filteredProjects = projects
    .filter(project => 
      (searchTerm === "" || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .filter(project => 
      filterStatus === "all" || project.status === filterStatus
    );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dateA = new Date(a.created_at || "").getTime();
    const dateB = new Date(b.created_at || "").getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

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
          className="max-w-3xl mx-auto text-center mb-8"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-8 glass p-4 rounded-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by title, description, or tags..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  className="bg-background border border-input text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as ProjectType['status'] | "all")}
                >
                  <option value="all">All Statuses</option>
                  <option value="working">Working</option>
                  <option value="under_development">Under Development</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              >
                {sortOrder === "newest" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              </Button>
            </div>
          </div>
        </motion.div>

        {sortedProjects.length > 0 ? (
          <motion.div
            className="max-w-6xl mx-auto grid gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedProjects.map((project) => (
              <motion.div
                key={project.id}
                ref={el => projectRefs.current[project.id] = el}
                id={project.id}
                className={cn(
                  "glass rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300",
                  expandedProject === project.id && "border-primary/30",
                  project.featured && "bg-gradient-to-br from-primary/5 to-background"
                )}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.image_url && (
                    <div className="md:col-span-1 h-full">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover max-h-[240px] md:max-h-none rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${project.image_url ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-md text-primary mr-3">
                          {getIconForProject(project)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                              {getStatusIcon(project.status)}
                              {getStatusText(project.status)}
                            </Badge>
                            {project.featured && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1 px-2 py-1 text-xs font-medium">
                                <Star className="h-3 w-3 text-primary fill-primary" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 hover:bg-secondary p-2 rounded-full"
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 hover:bg-secondary p-2 rounded-full"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="skill-tag animate-fade-in"
                          style={{ animationDelay: `${tagIndex * 50}ms` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <AnimatePresence>
                      {expandedProject === project.id ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {project.challenge && (
                            <motion.div 
                              className="mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <h4 className="font-bold mb-2">Challenge</h4>
                              <p className="text-muted-foreground">
                                {project.challenge}
                              </p>
                            </motion.div>
                          )}

                          {project.solution && (
                            <motion.div 
                              className="mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h4 className="font-bold mb-2">Solution</h4>
                              <p className="text-muted-foreground">
                                {project.solution}
                              </p>
                            </motion.div>
                          )}

                          {project.code_snippet && (
                            <motion.div 
                              className="mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <h4 className="font-bold mb-2">Code Sample</h4>
                              <div className="code-block bg-secondary/10 rounded-md p-4 overflow-x-auto">
                                <pre className="font-mono text-sm">
                                  <code>{project.code_snippet}</code>
                                </pre>
                              </div>
                            </motion.div>
                          )}

                          <Button
                            variant="ghost"
                            className="mt-2"
                            onClick={() => setExpandedProject(null)}
                          >
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Show Less
                          </Button>
                        </motion.div>
                      ) : (
                        <Button
                          variant="outline"
                          className="mt-2 hover:bg-primary/10 transition-colors"
                          onClick={() => setExpandedProject(project.id)}
                        >
                          <Code className="mr-2 h-4 w-4" />
                          View Details & Code
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto text-center p-12 glass rounded-lg">
            <h3 className="text-xl font-medium mb-4">No Projects Found</h3>
            {searchTerm !== "" || filterStatus !== "all" ? (
              <p className="text-muted-foreground mb-6">
                No projects match your current search and filter criteria. Try adjusting your search.
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                It looks like there are no projects in your Supabase database yet. Add some projects to showcase your work.
              </p>
            )}
            {(searchTerm !== "" || filterStatus !== "all") && (
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;


import * as React from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { 
  Database, Server, Terminal, Code, 
  FileCode, GitMerge, Cpu, Coffee,
  Award, Briefcase, GraduationCap, Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Type definitions for the about content
interface AboutContent {
  id: string;
  section_name: string;
  title: string;
  content: any; // Using any since content is JSONB with variable structure
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Timeline entry type
interface TimelineEntry {
  title: string;
  company: string;
  period: string;
  description: string;
  icon: React.ReactNode;
}

// Skill category type
interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

const About = () => {
  const [aboutContent, setAboutContent] = React.useState<AboutContent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchAboutContent() {
      try {
        setLoading(true);
        // Fetch content from the about_content table, ordered by display_order
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error("Error fetching about content:", error);
          toast({
            title: "Error",
            description: "Could not load about page content",
            variant: "destructive",
          });
        } else if (data) {
          setAboutContent(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAboutContent();
  }, [toast]);

  // Helper function to get a specific section by name
  const getSection = (sectionName: string): AboutContent | undefined => {
    return aboutContent.find(section => section.section_name === sectionName);
  };

  // Map icon names to components
  const getIconComponent = (iconName: string): React.ReactNode => {
    const iconMap: { [key: string]: React.ReactNode } = {
      code: <Code className="h-5 w-5" />,
      database: <Database className="h-5 w-5" />,
      server: <Server className="h-5 w-5" />,
      cpu: <Cpu className="h-5 w-5" />,
      fileCode: <FileCode className="h-5 w-5" />,
      gitMerge: <GitMerge className="h-5 w-5" />,
    };
    return iconMap[iconName] || <Code className="h-5 w-5" />;
  };

  // Parse skill categories from content
  const skillCategories: SkillCategory[] = React.useMemo(() => {
    const skillsSection = getSection('skills');
    if (!skillsSection || !skillsSection.content.categories) return [];

    return skillsSection.content.categories.map((category: any) => {
      let icon;
      switch (category.title) {
        case 'Languages':
          icon = <Code className="h-5 w-5" />;
          break;
        case 'Databases':
          icon = <Database className="h-5 w-5" />;
          break;
        case 'DevOps & Infrastructure':
          icon = <Server className="h-5 w-5" />;
          break;
        case 'Machine Learning':
          icon = <Cpu className="h-5 w-5" />;
          break;
        case 'Tools & Frameworks':
          icon = <FileCode className="h-5 w-5" />;
          break;
        default:
          icon = <GitMerge className="h-5 w-5" />;
      }
      return {
        title: category.title,
        icon,
        skills: category.skills || []
      };
    });
  }, [aboutContent]);

  // Parse timeline entries from content
  const timeline: TimelineEntry[] = React.useMemo(() => {
    const experienceSection = getSection('experience');
    if (!experienceSection || !experienceSection.content.timeline) return [];

    return experienceSection.content.timeline.map((item: any) => ({
      title: item.title,
      company: item.company,
      period: item.period,
      description: item.description,
      icon: <Briefcase />
    }));
  }, [aboutContent]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-container flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-6 w-64 bg-muted rounded"></div>
            <div className="h-24 w-96 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Get specific sections
  const heroSection = getSection('hero');
  const backgroundSection = getSection('background');
  const philosophySection = getSection('philosophy');
  const ctaSection = getSection('cta');

  return (
    <Layout>
      <div className="section-container">
        {/* Hero Section */}
        {heroSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-3 py-1 mb-6 text-sm font-medium">
              <Terminal className="h-4 w-4 mr-2" />
              <span>{heroSection.title}</span>
            </div>
            <h1 className="mb-6">
              {heroSection.title} 
              <span className="text-primary"></span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {heroSection.content.tagline}
            </p>
          </motion.div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Background and Philosophy Section */}
          <motion.div 
            className="mb-16 flex flex-col md:flex-row gap-6 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {backgroundSection && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                  {backgroundSection.title}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {backgroundSection.content.paragraphs.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {philosophySection && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  {philosophySection.title}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {philosophySection.content.paragraphs.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Experience Timeline Section */}
          {timeline.length > 0 && (
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center">
                <Award className="mr-2 h-6 w-6 text-primary" />
                {getSection('experience')?.title || 'Professional Experience'}
                <span className="text-primary ml-2"></span>
              </h2>

              <div className="relative border-l border-primary/30 ml-4 pl-10 space-y-12 py-4">
                {timeline.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className="absolute -left-[42px] bg-background border-4 border-primary/30 rounded-full p-1 flex items-center justify-center">
                      {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
                    </div>
                    <div className="glass p-6 rounded-lg">
                      <div className="flex flex-wrap justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{item.company}</p>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Technical Skills Section */}
          {skillCategories.length > 0 && (
            <>
              <motion.h2 
                className="text-2xl font-bold mb-8 text-center flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Code className="mr-2 h-6 w-6 text-primary" />
                {getSection('skills')?.title || 'Technical Skills'}
                <span className="text-primary ml-2"></span>
              </motion.h2>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {skillCategories.map((category, index) => (
                  category.skills.length > 0 && (
                    <motion.div 
                      key={index} 
                      className="glass p-6 rounded-lg hover:shadow-md hover:shadow-primary/10 transition-all"
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-primary/10 p-2 rounded-md text-primary mr-3">
                          {category.icon}
                        </div>
                        <h3 className="font-bold">{category.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex} 
                            className="skill-tag transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                ))}
              </motion.div>
            </>
          )}

          {/* Call to Action Section */}
          {ctaSection && (
            <motion.div 
              className="mt-16 p-8 glass rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Coffee className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{ctaSection.content.title}</h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                {ctaSection.content.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {ctaSection.content.buttons.map((button: any, index: number) => (
                  <a 
                    key={index}
                    href={button.link} 
                    className={`inline-flex items-center px-6 py-3 ${
                      button.primary 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    } rounded-full transition-colors`}
                  >
                    {button.text}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default About;

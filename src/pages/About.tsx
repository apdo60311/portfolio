
import * as React from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { 
  Database, Server, Terminal, Code, 
  FileCode, GitMerge, Cpu, Coffee,
  Award, Briefcase, GraduationCap, Users
} from "lucide-react";

// Skill category type
interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

// Timeline entry type
interface TimelineEntry {
  title: string;
  company: string;
  period: string;
  description: string;
  icon: React.ReactNode;
}

const About = () => {
  // Define skill categories
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      icon: <Code className="h-5 w-5" />,
      skills: ["Python", "Java", "JavaScript/TypeScript", "Go", "SQL", "C++"]
    },
    {
      title: "Databases",
      icon: <Database className="h-5 w-5" />,
      skills: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "Neo4j"]
    },
    {
      title: "DevOps & Infrastructure",
      icon: <Server className="h-5 w-5" />,
      skills: ["Docker", "Kubernetes", "Terraform", "AWS", "GCP", "CI/CD", "Prometheus", "Grafana"]
    },
    {
      title: "Machine Learning",
      icon: <Cpu className="h-5 w-5" />,
      skills: ["TensorFlow", "PyTorch", "scikit-learn", "Keras", "Pandas", "NumPy", "MLOps"]
    },
    {
      title: "Tools & Frameworks",
      icon: <FileCode className="h-5 w-5" />,
      skills: ["Django", "FastAPI", "Spring Boot", "Express.js", "Flask", "gRPC", "RabbitMQ", "Kafka"]
    },
    {
      title: "Other",
      icon: <GitMerge className="h-5 w-5" />,
      skills: ["Git", "RESTful APIs", "GraphQL", "Microservices", "System Design", "Testing", "Agile"]
    }
  ];

  // Define experience timeline
  const timeline: TimelineEntry[] = [
    {
      title: "Lead Backend Engineer",
      company: "TechCorp Inc.",
      period: "2020 - Present",
      description: "Leading the backend engineering team in designing and implementing scalable microservices architecture. Reduced system latency by 40% and improved throughput by implementing advanced caching strategies.",
      icon: <Briefcase />
    },
    {
      title: "Senior Software Engineer",
      company: "DataSystems",
      period: "2017 - 2020",
      description: "Developed and maintained high-performance data processing pipelines handling petabytes of data. Implemented machine learning models for predictive analytics that increased business insights by 35%.",
      icon: <Server />
    },
    {
      title: "Software Engineer",
      company: "CloudScale",
      period: "2015 - 2017",
      description: "Built scalable cloud infrastructure and services using AWS and Kubernetes. Designed and implemented CI/CD pipelines that reduced deployment time from days to minutes.",
      icon: <Code />
    }
  ];

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
            <Terminal className="h-4 w-4 mr-2" />
            <span>About Me</span>
          </div>
          <h1 className="mb-6">
            Backend Engineer & <span className="text-primary">System Architect</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            With over 8 years of experience designing and building high-performance, 
            scalable backend systems for companies ranging from startups to Fortune 500s.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Background and Philosophy Section */}
          <motion.div 
            className="mb-16 flex flex-col md:flex-row gap-6 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                Background
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I specialize in building resilient, high-performance backend systems that can handle millions of users. 
                  My focus is on creating clean, maintainable code and designing architectures that are both scalable and efficient.
                </p>
                <p>
                  I've led teams in implementing complex data pipelines, machine learning infrastructures, and microservices 
                  architectures. My approach combines technical expertise with a deep understanding of business requirements.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Philosophy
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I believe in writing code that is not just functional but also maintainable and scalable. 
                  The best systems are those that elegantly solve complex problems while remaining simple to understand.
                </p>
                <p>
                  My work is guided by principles of continuous improvement, rigorous testing, and documentation. 
                  I'm passionate about knowledge sharing and mentoring other engineers to elevate the entire team's capabilities.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Experience Timeline Section */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center">
              <Award className="mr-2 h-6 w-6 text-primary" />
              Professional <span className="text-primary ml-2">Experience</span>
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

          {/* Technical Skills Section */}
          <motion.h2 
            className="text-2xl font-bold mb-8 text-center flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Code className="mr-2 h-6 w-6 text-primary" />
            Technical <span className="text-primary ml-2">Skills</span>
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillCategories.map((category, index) => (
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
            ))}
          </motion.div>

          {/* Call to Action Section */}
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
            <h3 className="text-2xl font-bold mb-3">Want to work together?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              I'm always open to discussing new projects, challenges, and opportunities. 
              Let's connect and create something amazing together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-colors">
                Contact Me
              </a>
              <a href="/projects" className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full transition-colors">
                View My Projects
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

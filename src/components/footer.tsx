
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} dev.backend. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with React, Tailwind CSS, and Framer Motion
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </Link>
          <Link 
            to="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={18} />
          </Link>
          <Link 
            to="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </Link>
          <Link 
            to="/contact" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Contact"
          >
            <Mail size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

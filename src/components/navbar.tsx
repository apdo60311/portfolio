
import * as React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeLink, setActiveLink] = React.useState("/");
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const path = window.location.pathname;
    setActiveLink(path);

    setIsMenuOpen(false);
    
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [window.location.pathname, isMenuOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuOpen && 
        mobileMenuRef.current && 
        menuButtonRef.current && 
        !mobileMenuRef.current.contains(target) && 
        !menuButtonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b",
        className
      )}
    >
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <Link
          to="/"
          className="font-mono text-base md:text-lg font-bold"
          onClick={() => setActiveLink("/")}
        >
          <span className="text-primary">&gt;_</span> dev.software
        </Link>

        <div className="flex md:hidden items-center">
          <ThemeToggle className="mr-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            ref={menuButtonRef}
            className="mobile-menu-button touch-fix"
          >
            {isMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <motion.nav
          className="hidden md:flex items-center gap-6"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          {links.map((link) => (
            <motion.div key={link.href} variants={linkVariants}>
              <Link
                to={link.href}
                className={cn(
                  "underline-animation text-sm font-medium transition-colors",
                  activeLink === link.href
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                )}
                onClick={() => setActiveLink(link.href)}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <ThemeToggle />
        </motion.nav>

        {isMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed inset-0 top-14 md:top-16 bg-background/95 backdrop-blur-lg border-b md:hidden z-50 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 3.5rem)" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container py-4 flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-base font-medium px-3 py-3 rounded-md transition-colors touch-fix",
                    activeLink === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => {
                    setActiveLink(link.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

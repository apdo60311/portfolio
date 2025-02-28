
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

  React.useEffect(() => {
    const path = window.location.pathname;
    setActiveLink(path);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="font-mono text-lg font-bold"
          onClick={() => setActiveLink("/")}
        >
          <span className="text-primary">&gt;_</span> dev.backend
        </Link>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <ThemeToggle className="mr-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
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

        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.div
            className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg border-b md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container py-4 flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium px-2 py-2 rounded-md transition-colors",
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

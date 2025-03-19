
import * as React from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        ]);

      if (error) {
        console.error("Error submitting form:", error);
        throw error;
      }

      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
        duration: 5000,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Mail className="h-4 w-4 mr-2" />
            <span>Get In Touch</span>
          </div>
          <h1 className="mb-6">
            Let's <span className="text-primary">Connect</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Have a project in mind or want to discuss a technical challenge? 
            I'm always open to new opportunities and collaborations.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="glass rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground">alex.johnson@example.com</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-muted-foreground">San Francisco, CA</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Availability</h3>
                  <p className="text-muted-foreground">
                    I'm currently open to:
                  </p>
                  <ul className="mt-2 space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Freelance projects</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Technical consulting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Full-time opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Open source collaboration</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="font-medium mb-4">Download Resume</h3>
                <a href="/resume.pdf" download>
                  <Button className="w-full">
                    Download Resume (PDF)
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <div className="glass rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Project Discussion"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="I'd like to discuss a potential project..."
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-4 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                  Your message will be saved to our database, and we'll get back to you soon.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

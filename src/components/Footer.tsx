
import React from 'react';
import { Cherry, Coffee, Rocket } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-accent/20 to-primary/20 py-12 relative overflow-hidden">
      <div className="absolute -bottom-8 right-8 text-5xl rotate-12 opacity-10">
        <Rocket className="w-24 h-24" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#home" className="text-xl font-heading font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                AndySprague<span className="text-accent animate-pulse">.</span>
              </span>
            </a>
            <p className="mt-2 text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Cherry className="h-4 w-4 text-accent" />
              Web Designer & Software Engineer
              <Coffee className="h-4 w-4 text-primary" />
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {currentYear} AndySprague. All rights reserved.
            </p>
            <p className="text-xs mt-2 font-mono">Built with ✨ imagination & ☕ coffee</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

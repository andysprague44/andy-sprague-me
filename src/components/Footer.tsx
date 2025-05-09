
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="#home" className="text-xl font-heading font-bold text-primary">
              AndySprague<span className="text-accent">.</span>
            </a>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Web Designer & Software Engineer
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {currentYear} AndySprague. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

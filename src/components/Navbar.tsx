import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
      
      // Find which section is visible
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200; // Add offset
      
      sections.forEach((section) => {
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isSticky ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3' : 'py-6'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a 
          href="#home" 
          className="text-xl md:text-2xl font-heading font-bold group"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            AndySprague
          </span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={`font-medium transition-all relative ${
                activeSection === item.id 
                  ? "text-primary" 
                  : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              }`}
              aria-label={`Navigate to ${item.label} section`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></span>
              )}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-gray-700 dark:text-gray-200 hover:text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 rounded-full -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary opacity-5 rounded-full translate-y-1/2"></div>
          
          <nav className="flex flex-col py-4 relative z-10">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeSection === item.id 
                    ? "text-primary bg-gray-50 dark:bg-gray-800" 
                    : "text-gray-700 dark:text-gray-200"
                }`}
                aria-label={`Navigate to ${item.label} section`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></span>
                )}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

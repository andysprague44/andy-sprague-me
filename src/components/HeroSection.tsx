
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-medium text-primary">Hello, I'm</h2>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-balance">
                AndySprague
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient">
                Web Designer & Software Engineer
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-lg">
                I build exceptional digital experiences that combine stunning design with high-performance code.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button onClick={scrollToContact} size="lg" className="group">
                  Let's Talk 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#projects">View My Work</a>
                </Button>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center overflow-hidden">
              <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                {/* Replace with your actual profile photo */}
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

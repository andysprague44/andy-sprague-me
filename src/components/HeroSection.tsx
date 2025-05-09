
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 section-padding bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 animate-bounce duration-700" style={{ animationDuration: '6s' }}>
        <Sparkles className="h-8 w-8 text-accent opacity-60" />
      </div>
      <div className="absolute bottom-20 left-10 animate-pulse" style={{ animationDuration: '4s' }}>
        <Sparkles className="h-6 w-6 text-primary opacity-50" />
      </div>
      
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-medium text-primary">
                <span className="inline-block animate-bounce" style={{animationDuration: '2s'}}>👋</span> Hello, I'm
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-balance">
                Andy<span className="relative">
                  Sprague
                  <span className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary"></span>
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient">
                Web Designer & <span className="relative inline-block">Software 
                <div className="absolute -top-1 -right-1 transform rotate-12">
                  <Rocket className="h-5 w-5 text-accent" />
                </div> Engineer</span>
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-lg">
                I build <span className="font-bold text-primary">exceptional</span> digital experiences that combine 
                <span className="italic"> stunning design</span> with 
                <span className="underline decoration-wavy decoration-accent underline-offset-4"> high-performance code</span>.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button onClick={scrollToContact} size="lg" className="group rounded-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-accent/20 transition-all">
                  Let's Talk 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" asChild className="rounded-full hover:border-accent border-2 transition-all">
                  <a href="#projects">View My Work</a>
                </Button>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Fun blob shape with gradient */}
              <div className="absolute inset-0 rounded-blob bg-gradient-to-tr from-primary via-accent to-primary animate-pulse" style={{ 
                animationDuration: '10s',
                borderRadius: '60% 40% 70% 30% / 30% 30% 70% 70%'
              }}></div>
              
              <div className="absolute inset-4 rounded-blob bg-white dark:bg-gray-900 flex items-center justify-center" style={{ 
                borderRadius: '60% 40% 70% 30% / 30% 30% 70% 70%'
              }}>
                {/* Replace with your actual profile photo */}
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                  style={{ 
                    borderRadius: '60% 40% 70% 30% / 30% 30% 70% 70%'
                  }}
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

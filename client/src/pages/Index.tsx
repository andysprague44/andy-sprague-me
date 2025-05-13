
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    document.title = "AndySprague | Web Designer & Software Engineer";
    
    // Create custom cursor effect
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
      width: 20px;
      height: 20px;
      border: 2px solid hsl(var(--primary));
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.2s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);
    
    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    
    const growCursor = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.borderColor = 'hsl(var(--accent))';
    };
    
    const shrinkCursor = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'hsl(var(--primary))';
    };
    
    document.addEventListener('mousemove', moveCursor);
    
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', growCursor);
      link.addEventListener('mouseleave', shrinkCursor);
    });
    
    // Add page transition
    document.body.classList.add('fade-in');
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      links.forEach(link => {
        link.removeEventListener('mouseenter', growCursor);
        link.removeEventListener('mouseleave', shrinkCursor);
      });
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
  <section id="hero">
    <HeroSection />
  </section>
  <section id="about">
    <AboutSection />
  </section>
  {/* <section id="projects">
    <ProjectsSection />
  </section> */}
  <section id="blog">
    <BlogSection />
  </section>
  <section id="contact">
    <ContactSection />
  </section>
</main>
      <Footer />
    </div>
  );
};

export default Index;

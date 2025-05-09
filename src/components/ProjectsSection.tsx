
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  demo?: string;
  code?: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-featured online shop with product catalog, cart, and checkout functionality.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "Web Development",
    demo: "#",
    code: "#"
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "A workout tracking app with personalized training plans and progress analytics.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    technologies: ["React Native", "Firebase", "Redux"],
    category: "Mobile App",
    demo: "#",
    code: "#"
  },
  {
    id: 3,
    title: "Banking Dashboard",
    description: "An admin dashboard for financial institutions with data visualization.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    technologies: ["Vue.js", "TypeScript", "D3.js"],
    category: "UI/UX Design",
    demo: "#"
  },
  {
    id: 4,
    title: "Travel Booking Platform",
    description: "A travel booking website with real-time availability and payment processing.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    technologies: ["Next.js", "GraphQL", "Tailwind CSS"],
    category: "Web Development",
    demo: "#",
    code: "#"
  }
];

const categories = ["All", "Web Development", "Mobile App", "UI/UX Design"];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredProjects = activeCategory === "All" 
    ? projectsData 
    : projectsData.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="section-padding">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">Portfolio</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Recent Projects</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Showcasing my best work across web development, mobile apps, and UI/UX design.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-full px-4 py-2"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="project-card overflow-hidden border-2 border-border hover:border-primary/50">
              <div className="h-60 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between px-6 pb-6 pt-0">
                {project.demo && (
                  <Button variant="default" size="sm" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Live Demo <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {project.code && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.code} target="_blank" rel="noopener noreferrer">
                      Source Code
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

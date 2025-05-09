
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Laptop, Smartphone, Calendar, ImageIcon } from 'lucide-react';

const skills = [
  { name: "Frontend Development", icon: <Laptop className="h-6 w-6" />, description: "HTML, CSS, JavaScript, React, Vue, Tailwind" },
  { name: "Mobile Development", icon: <Smartphone className="h-6 w-6" />, description: "React Native, Flutter, iOS/Android" },
  { name: "UI/UX Design", icon: <ImageIcon className="h-6 w-6" />, description: "Figma, Adobe XD, Sketch, User Research" },
  { name: "Project Management", icon: <Calendar className="h-6 w-6" />, description: "Agile, Scrum, Jira, Notion" }
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">About Me</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Skills & Experience</h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            I'm a passionate web designer and software engineer with experience in creating beautiful, 
            functional websites and applications. I focus on writing clean, efficient code and delivering 
            exceptional user experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:border-primary transition-all duration-300 animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
                    {skill.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{skill.name}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{skill.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 md:mt-24">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">Work Experience</h3>
          
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-primary/30 pb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
              <div className="mb-1 text-sm text-primary font-medium">2022 - Present</div>
              <h4 className="text-xl font-bold mb-1">Senior Frontend Engineer</h4>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">Tech Company Inc.</p>
              <p className="text-gray-700 dark:text-gray-300">
                Lead the development of responsive web applications, collaborating with designers and backend engineers to deliver exceptional user experiences.
              </p>
            </div>
            
            <div className="relative pl-8 border-l-2 border-primary/30 pb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
              <div className="mb-1 text-sm text-primary font-medium">2020 - 2022</div>
              <h4 className="text-xl font-bold mb-1">UI/UX Designer</h4>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">Design Agency</p>
              <p className="text-gray-700 dark:text-gray-300">
                Created user-centered designs for web and mobile applications, conducting user research and usability testing.
              </p>
            </div>
            
            <div className="relative pl-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
              <div className="mb-1 text-sm text-primary font-medium">2018 - 2020</div>
              <h4 className="text-xl font-bold mb-1">Web Developer</h4>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">Web Solutions Co.</p>
              <p className="text-gray-700 dark:text-gray-300">
                Developed and maintained client websites, implementing responsive designs and optimizing performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

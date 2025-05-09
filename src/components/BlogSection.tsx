
import React, { useRef, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Design in 2025",
    excerpt: "Exploring upcoming trends and technologies that will shape web design in the coming years.",
    date: "April 15, 2025",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    slug: "future-web-design-2025"
  },
  {
    id: 2,
    title: "Optimizing React Performance",
    excerpt: "Learn advanced techniques to improve your React application's performance and user experience.",
    date: "March 22, 2025",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    slug: "optimizing-react-performance"
  },
  {
    id: 3,
    title: "Accessibility Best Practices",
    excerpt: "How to make your websites more accessible to users with disabilities and improve overall UX.",
    date: "February 10, 2025",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    slug: "accessibility-best-practices"
  },
  {
    id: 4,
    title: "Building a Design System",
    excerpt: "A step-by-step guide to creating and implementing a scalable design system for your projects.",
    date: "January 5, 2025",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    slug: "building-design-system"
  }
];

const BlogSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const scrollNext = useCallback(() => {
    if (currentIndex < blogPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToIndex(currentIndex + 1);
    }
  }, [currentIndex]);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.scrollWidth / blogPosts.length;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="blog" className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">Blog</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Latest Articles</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Insights and tutorials about web design, development, and industry trends.
          </p>
        </div>
        
        <div className="relative">
          <div className="embla overflow-hidden">
            <div 
              ref={carouselRef}
              className="embla__container flex gap-6 px-1 pb-4"
            >
              {blogPosts.map((post) => (
                <div key={post.id} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.33%-16px)]">
                  <Card className="blog-card h-full border-2 hover:border-primary/50">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="text-sm text-primary mb-2">{post.date}</div>
                      <h4 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                      <Button variant="link" className="p-0 text-primary font-medium" asChild>
                        <a href={`/blog/${post.slug}`}>Read More</a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <Button 
              onClick={scrollPrev} 
              variant="outline" 
              size="icon" 
              disabled={currentIndex === 0}
              className="rounded-full"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              onClick={scrollNext} 
              variant="outline" 
              size="icon" 
              disabled={currentIndex === blogPosts.length - 1}
              className="rounded-full"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <a href="/blog">View All Articles</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

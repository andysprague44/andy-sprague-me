
import React, { useRef, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useEffect } from 'react';
import { fetchArticles } from '@/api/article';


// Define type for Strapi Article
interface StrapiArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  cover?: {
    url?: string;
  };
}

const BlogSection = () => {
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch((err) => {
        setError('Failed to load articles.')
        console.error('Error loading articles:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (carouselRef.current && carouselRef.current.children[index]) {
      const target = carouselRef.current.children[index] as HTMLElement;
      carouselRef.current.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const scrollNext = useCallback(() => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, articles.length]);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  if (loading) {
    return <div className="text-center py-12">Loading articles...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

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
          <div className="embla">
            <div 
              ref={carouselRef}
              className="embla__container flex gap-6 px-1 pb-4 overflow-x-auto scroll-smooth w-full"
              style={{ scrollBehavior: 'smooth' }}
            >
              {articles.map((article) => {
                return (
                  <div key={article.id} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.33%-16px)]">
                    <Card className="blog-card h-full border-2 hover:border-primary/50">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={article.cover?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="text-sm text-primary mb-2">{article.date}</div>
                        <h4 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                        <Button variant="link" className="p-0 text-primary font-medium" asChild>
                          <a href={`/blog/${article.slug}`}>Read More</a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
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
              disabled={currentIndex === articles.length - 1}
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

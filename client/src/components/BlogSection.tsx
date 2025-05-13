import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch((err) => {
        setError('Failed to load articles.')
        console.error('Error loading articles:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const location = useLocation();
  const isBlogPage = location.pathname === '/blog';

  if (loading) {
    return <div className="text-center py-12">Loading articles...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  // Sort articles by date descending (assume ISO 8601 date)
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayArticles = isBlogPage ? sortedArticles : sortedArticles.slice(0, 3);

  return (
    <section id="blog" className="section-padding bg-secondary/30">
      <div className="section-container">
        {!isBlogPage && (
          <div className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">Blog</h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Latest Articles</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Insights and tutorials about web design, development, and industry trends.
                </p>
              </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1 pb-4">
          {displayArticles.map((article) => (
            <a key={article.id} href={`/blog/${article.slug}`} className="block group" tabIndex={0} aria-label={`Read blog post: ${article.title}`}>
              <Card className="blog-card h-full border-2 hover:border-primary/50 group-hover:border-primary">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.cover?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-primary mb-2">{article.date}</div>
                  <h4 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        {!isBlogPage && (
          <div className="text-center mt-12">
            <Button asChild>
              <a href="/blog">View All Articles</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;

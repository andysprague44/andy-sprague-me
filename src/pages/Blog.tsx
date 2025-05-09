
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

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

const Blog = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Blog</h1>
            <p className="text-gray-700 dark:text-gray-300">
              Articles and insights about web design, development, and industry trends.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Link 
                to={`/blog/${post.slug}`} 
                key={post.id}
                className="no-underline"
              >
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
                    <h4 className="text-xl font-bold mb-3">{post.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

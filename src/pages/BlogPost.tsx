
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real application, you would fetch the blog post data from Strapi using the slug
  // This is a placeholder implementation
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all posts
            </Link>
          </Button>
          
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Blog Post Title
            </h1>
            
            <div className="flex items-center mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published on <time>January 1, 2025</time>
              </p>
            </div>
            
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80" 
                alt="Blog post featured image" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <p>
              This is a placeholder for the blog content that would be fetched from Strapi CMS.
              In a real implementation, this would contain the full article content with proper
              formatting, images, and other elements from your headless CMS.
            </p>
            
            <p>
              The content would be rendered here using HTML or Markdown, depending on how your
              content is structured in Strapi. You might use a library like react-markdown to
              render the content from your CMS.
            </p>
            
            <h2>Section Heading</h2>
            
            <p>
              Additional paragraphs and content sections would appear here, formatted according
              to your styling preferences and the structure defined in your CMS.
            </p>
            
            <blockquote>
              This is an example of a blockquote that might appear in your blog post.
              Quotes and highlighted content would be styled appropriately.
            </blockquote>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

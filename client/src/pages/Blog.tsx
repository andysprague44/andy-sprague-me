
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogSection from '@/components/BlogSection';


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
          
          <BlogSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { fetchArticleBySlug } from '@/api/article';
import ReactMarkdown from 'react-markdown';

interface BlogPostType {
  id: number;
  title: string;
  contents: string;
  date: string;
  excerpt: string;
  coverImage?: { url: string };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const found = await fetchArticleBySlug(slug || '');
        if (!found) {
          setError('Blog post not found.');
        } else {
          setPost(found);
        }
      } catch (err) {
        setError('Failed to load blog post.');
        // eslint-disable-next-line no-console
        console.error('Error loading blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

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

          {loading && <div className="text-center py-10">Loading...</div>}
          {error && <div className="text-center text-red-500 py-10">{error}</div>}
          {post && (
            <article className="prose prose-lg dark:prose-invert max-w-none animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
              <div className="flex items-center mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Published on <time>{post.date}</time>
                </p>
              </div>
              {post.coverImage?.url && (
                <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img {...props} className="rounded-lg shadow max-w-full mx-auto my-6" />
                  ),
                  h1: ({ node, ...props }) => <h1 className="mt-8 mb-4 text-3xl font-bold" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="mt-6 mb-3 text-2xl font-semibold" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="mt-5 mb-2 text-xl font-semibold" {...props} />,
                  code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded" {...props} />,
                  a: ({ node, ...props }) => <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 dark:text-gray-300 my-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4" {...props} />,
                }}
              >
                {post.contents}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

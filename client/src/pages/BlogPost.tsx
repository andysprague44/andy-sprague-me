
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SanityDocument } from '@sanity/client';
import { urlFor } from '@/sanity/client';
import { getPost } from '@/sanity/client';
import { PortableText } from '@portabletext/react';
import { sanityPortableTextComponents } from '@/components/SanityPortableText';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<SanityDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const found = await getPost(slug || '');
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
          <Button
            variant="ghost"
            className="mb-6 flex items-center"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Button>

          {loading && <div className="text-center py-10">Loading...</div>}
          {error && <div className="text-center text-red-500 py-10">{error}</div>}
          {post && (
            <article className="prose prose-lg dark:prose-invert max-w-none animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
              <div className="flex items-center mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Published on {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.publishedAt))}
                </p>
              </div>
              {post.image && (
                <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                  <img
                    src={urlFor(post.image).url()}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <PortableText value={post.body} components={sanityPortableTextComponents}/>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

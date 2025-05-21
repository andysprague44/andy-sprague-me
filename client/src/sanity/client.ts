import { createClient } from "@sanity/client";
import { SanityDocument } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: "ium7bs42",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{_id, title, slug, image, publishedAt}`;

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

export const getPosts = async () => {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);
  return posts;
};

export const getPost = async (slug: string) => {
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug });
  return post;
};

export const urlFor = (source: any) => {
  return builder.image(source)
}

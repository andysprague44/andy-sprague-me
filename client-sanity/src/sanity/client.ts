import { createClient } from "@sanity-typed/client";
import { SanityValues } from "sanity.config";

export const client = createClient<SanityValues>({
  projectId: "ium7bs42",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const options = { next: { revalidate: parseInt(process.env.NEXT_SANITY_REVALIDATE_SECONDS ?? "3600", 10) } };

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

export const getPosts = async () => {
  const posts = await client.fetch(POSTS_QUERY);
  return posts;
};

export const getPost = async (slug: string) => {
  const post = await client.fetch(POST_QUERY, { slug }, options);
  return post;
};

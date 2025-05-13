import axios from 'axios';
import strapiJson from '../strapi.json';

// Fetch all articles
export async function fetchArticles(): Promise<any[]> {
    const useRemote = import.meta.env.VITE_STRAPI_USE_REMOTE;
    if (useRemote === 'false') {
        // Fetch all articles from local file
        return strapiJson.data;
    }
    const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    const token = import.meta.env.VITE_STRAPI_API_TOKEN;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${strapiUrl}/api/articles?populate=*`, { headers });
    return res.data.data.map((item: any) => {
        let coverUrl = item.cover?.url;
        if (coverUrl && coverUrl.startsWith('/')) {
            coverUrl = strapiUrl.replace(/\/$/, '') + coverUrl;
        }
        console.log(coverUrl);
        return {
            ...item,
            cover: coverUrl ? { url: coverUrl } : undefined,
        };
    });
}

// Fetch a single article by slug
export async function fetchArticleBySlug(slug: string): Promise<any | null> {
    const useRemote = import.meta.env.VITE_STRAPI_USE_REMOTE;
    if (useRemote === 'false') {
        // Fetch all articles from local file
        return strapiJson.data.find((item: any) => item.slug === slug);
    }

    const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    const token = import.meta.env.VITE_STRAPI_API_TOKEN;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // Strapi filter query for slug
    const res = await axios.get(`${strapiUrl}/api/articles?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`, { headers });
    const item = res.data.data?.[0];
    if (!item) return null;
    let coverUrl = item.cover?.url;
    if (coverUrl && coverUrl.startsWith('/')) {
        coverUrl = strapiUrl.replace(/\/$/, '') + coverUrl;
    }
    return {
        ...item,
        cover: coverUrl ? { url: coverUrl } : undefined,
    };
}

// Fetch a single article by ID
export async function fetchArticleById(id: string | number): Promise<any> {
    const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    const token = import.meta.env.VITE_STRAPI_API_TOKEN;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${strapiUrl}/api/articles/${id}?populate=*`, { headers });
    const item = res.data.data;
    let coverUrl = item.coverImage?.url;
    if (coverUrl && coverUrl.startsWith('/')) {
        coverUrl = strapiUrl.replace(/\/$/, '') + coverUrl;
    }
    return {
        ...item,
        coverImage: coverUrl ? { url: coverUrl } : undefined,
    };
}

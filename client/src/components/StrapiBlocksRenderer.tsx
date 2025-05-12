import React from "react";
import ReactMarkdown from "react-markdown";

// Accepts an array of Strapi blocks (from your API)
const StrapiBlocksRenderer = ({ blocks }: { blocks: any[] }) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.__component) {
          case "shared.rich-text":
  return (
    <div key={block.id || idx} className="my-6">
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
        {block.body}
      </ReactMarkdown>
    </div>
  );
          case "shared.quote":
            return (
              <blockquote key={block.id || idx} className="border-l-4 border-primary pl-4 italic my-6">
                <div className="font-semibold mb-2">{block.title}</div>
                <div>{block.body}</div>
              </blockquote>
            );
          case "shared.media":
            // You can expand this for images, videos, etc.
            return (
              <div key={block.id || idx} className="my-6">
                {/* Render media here */}
                {block.url && block.mime.includes("image") ? (
                  <img
                    src={block.url}
                    alt={block.alternativeText || block.name}
                    className="rounded-lg shadow max-w-full mx-auto my-6"
                  />
                ) : (
                  <span className="text-gray-400">[Unsupported Media Block Placeholder]</span>
                )}
              </div>
            );
          case "shared.slider":
            return (
              <div key={block.id || idx} className="my-6">
                {/* Render slider here */}
                <span className="text-gray-400">[Slider Block Placeholder]</span>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default StrapiBlocksRenderer;

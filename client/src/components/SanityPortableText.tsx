import { PortableTextComponents } from '@portabletext/react';

export const sanityPortableTextComponents: PortableTextComponents = {
    block: {
      // Different styles for different block types
      h1: ({children}) => <h1 className="text-4xl font-bold my-5">{children}</h1>,
      h2: ({children}) => <h2 className="text-3xl font-bold my-4">{children}</h2>,
      h3: ({children}) => <h3 className="text-2xl font-bold my-3">{children}</h3>,
      normal: ({children}) => <p className="my-4">{children}</p>,
      blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">{children}</blockquote>,
    },
    list: {
      // Customize list rendering
      bullet: ({children}) => <ul className="list-disc ml-6 my-4">{children}</ul>,
      number: ({children}) => <ol className="list-decimal ml-6 my-4">{children}</ol>,
    },
    marks: {
      // Customize how marks are handled
      strong: ({children}) => <strong className="font-bold">{children}</strong>,
      em: ({children}) => <em className="italic">{children}</em>,
      code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm">{children}</code>,
      link: ({value, children}) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a 
            href={value?.href} 
            target={target} 
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {children}
          </a>
        );
      },
    },
  }
import os
import re
import requests
import glob

# CONFIGURATION
STRAPI_URL = 'http://localhost:1337/api/articles'  # Strapi API endpoint
API_TOKEN = '592069712bcf6c160d1c86fa09d60f0899eacf5da45eddfdbc80319887c54866520f9c52b32750bb5a87fbaf4a6abe74a9360b987680726644baee2df12b514d655c2570387df55e18e6d7efb19e9fbaa4142416342f46fe748ba7f845e10fcd16fc665319bb8fa51702a15e0b6bfcc4a4bcde28d7fc6e1b0623a7b6a56d4204'
MARKDOWN_DIR = 'wordpress-md-posts'  # Directory containing markdown files

# Helper to slugify titles for slugs
def slugify(title):
    title = title.lower()
    title = re.sub(r'[^a-z0-9]+', '-', title)
    title = re.sub(r'-+', '-', title)
    return title.strip('-')

# Extract title, description, and content from markdown file
def parse_markdown_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    title = lines[0].replace('#', '').strip() if lines and lines[0].startswith('#') else os.path.basename(filepath)
    description = ''
    content_lines = []
    found_desc = False
    for line in lines[1:]:
        if not found_desc and line.strip():
            description = line.strip()
            found_desc = True
        if found_desc:
            content_lines.append(line)
    content = ''.join(content_lines).strip()
    return title, description, content

# Prepare headers
headers = {'Content-Type': 'application/json'}
if API_TOKEN:
    headers['Authorization'] = f'Bearer {API_TOKEN}'

# Loop through markdown files and upload
def main():
    md_files = glob.glob(os.path.join(MARKDOWN_DIR, '*.md'))
    for md_file in md_files[:1]:
        title, description, content = parse_markdown_file(md_file)
        slug = slugify(title)
        # Prepare blocks for dynamic zone (assuming a 'markdown' component, update as needed)
        blocks = [
            {
                "__component": "shared.rich-text", 
                "body": content
            }
        ]
        data = {
            "data": {
                "title": title, 
                "description": description,
                "slug": slug,
                # Set cover, author, category as needed (null or default for now)
                "cover": None,
                "author": None,
                "category": None,
                "blocks": blocks
            }
        }
        print(f"Uploading: {title}")
        resp = requests.post(STRAPI_URL, json=data, headers=headers)
        if resp.status_code in (200, 201):
            print(f"Success: {title}")
        else:
            print(f"Failed: {title} - {resp.status_code} {resp.text}")

if __name__ == '__main__':
    main()

import os
import re
import html
import xml.etree.ElementTree as ET
from pathlib import Path

try:
    from markdownify import markdownify as md
except ImportError:
    raise ImportError("Please install markdownify: pip install markdownify")

# Path to your WordPress export file
EXPORT_FILE = "wordpress-export.xml"
# Output directory for markdown files
OUTPUT_DIR = "wordpress-md-posts"

# Helper to slugify titles for filenames
def slugify(title):
    title = title.lower()
    title = re.sub(r"[^a-z0-9]+", "-", title)
    title = re.sub(r"-+", "-", title)
    return title.strip('-')

# Remove WordPress-specific HTML comments
def remove_wp_comments(html_text):
    return re.sub(r"<!-- ?/?wp:[^>]*-->", "", html_text)

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Parse the XML file
ns = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp': 'http://wordpress.org/export/1.2/'
}
tree = ET.parse(EXPORT_FILE)
root = tree.getroot()

for item in root.findall('./channel/item'):
    title = item.findtext('title') or 'untitled'
    date = item.findtext('wp:post_date', namespaces=ns) or 'no-date'
    content = item.findtext('content:encoded', namespaces=ns) or ''
    # Unescape HTML entities
    content = html.unescape(content)
    # Remove WordPress-specific comments
    content = remove_wp_comments(content)
    # Convert HTML to Markdown
    content_md = md(content, heading_style="ATX")
    # Clean up filename
    slug = slugify(title)
    filename = f"{date[:10]}-{slug}.md"
    filepath = os.path.join(OUTPUT_DIR, filename)
    # Write markdown file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"# {title}\n")
        f.write(f"_Date: {date}_\n\n")
        f.write(content_md)

print(f"Exported markdown files to {OUTPUT_DIR}/")

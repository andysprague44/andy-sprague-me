import os
import re
import requests
import xml.etree.ElementTree as ET

XML_FILE = 'wordpress-export.xml'
OUTPUT_DIR = 'tmp'


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(XML_FILE, 'r', encoding='utf-8') as f:
        xml_content = f.read()
    pattern = r'https://andysprague\.com/wp-content/uploads/[^\s"<]+'
    urls = set(re.findall(pattern, xml_content))
    print(f"Found {len(urls)} images.")
    for url in urls:
        local_filename = os.path.join(OUTPUT_DIR, url.split('/')[-1])
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(local_filename, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {url}")

if __name__ == "__main__":
    main()
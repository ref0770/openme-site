import os
import re
from pathlib import Path

# Find all HTML files
html_files = list(Path('.').rglob('*.html'))
print(f"Found {len(html_files)} HTML files")

replaced_count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has burger button
    if '<button class="menu-toggle burger"' in content:
        # Replace button with checkbox + label
        old_pattern = r'<button class="menu-toggle burger" type="button" aria-label="[^"]*" aria-expanded="false"><span></span><span></span><span></span></button>'
        
        new_replacement = '''<input class="mobile-nav-checkbox" type="checkbox" id="mobileNavToggle" hidden>
    <label class="menu-toggle" for="mobileNavToggle" aria-label="Відкрити меню">
      <span></span>
      <span></span>
      <span></span>
    </label>'''
        
        new_content = re.sub(old_pattern, new_replacement, content)
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            replaced_count += 1
            print(f"✓ {file}")

print(f"\nReplaced burger button in {replaced_count} files")

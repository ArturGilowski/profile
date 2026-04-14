import glob

files = glob.glob('docs/*.html')
logo_html = '''<a href="index.html" class="nav-brand-logo">
                <img src="images/logo.png" alt="AG Logo" class="nav-brand-img">
            </a>'''

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'class="nav-brand-logo"' not in content:
        content = content.replace('<ul class="nav-menu" id="nav-menu">',
            logo_html + '\n            <ul class="nav-menu" id="nav-menu">'
        )
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f}')

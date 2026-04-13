const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));

const divingLink = '                <li><a href="nurkowanie.html" class="nav-link nav-btn-diving" data-i18n="nav_diving" style="color:white !important;">Nurkowanie</a></li>';

files.forEach(file => {
    const filePath = path.join(docsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already added
    if (content.includes('nav-btn-diving')) {
        console.log(`Skipping ${file} - already has diving link`);
        return;
    }

    // Find the end of the "Usługi" dropdown li
    // It's the one with class="dropdown"
    const dropdownEndTag = '</li>';
    const uslugiMatch = content.match(/<li[^>]*class="dropdown[^>]*"[\s\S]*?<\/li>/);
    
    if (uslugiMatch) {
        const fullMatch = uslugiMatch[0];
        const insertionPoint = content.indexOf(fullMatch) + fullMatch.length;
        
        content = content.slice(0, insertionPoint) + '\n' + divingLink + content.slice(insertionPoint);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find Usługi dropdown in ${file}`);
    }
});

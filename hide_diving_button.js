const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));

const divingNavLink = '<li><a href="nurkowanie.html" class="nav-link nav-btn-diving" data-i18n="nav_diving" style="color:white !important;">Nurkowanie</a></li>';

files.forEach(file => {
    const filePath = path.join(docsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Only remove the one in the navbar
    // We can target the specific string I added
    if (content.includes(divingNavLink)) {
        content = content.replace(divingNavLink + '\n', ''); // Try to remove with newline
        content = content.replace(divingNavLink, ''); // Fallback
        
        fs.writeFileSync(filePath, content);
        console.log(`Hidden diving button in ${file}`);
    } else {
        console.log(`No navbar diving button found in ${file}`);
    }
});

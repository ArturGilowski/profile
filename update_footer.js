const fs = require('fs');

const glob = fs.readdirSync('./docs').filter(f => f.endsWith('.html'));

glob.forEach(file => {
    let content = fs.readFileSync('./docs/' + file, 'utf8');
    
    // Replace slogan
    content = content.replace(
        /<p>Usługi od A do Z: AI, IT, Fotografia, SMM i Sport\.<\/p>/g,
        '<p data-i18n=\"footer_slogan\">Usługi od A do Z: AI, IT, Fotografia, SMM i Sport.</p>'
    );
    
    // Also if the slogan has a comma:
    content = content.replace(
        /<p>Usługi od A do Z, AI, IT, Fotografia, SMM i Sport\.<\/p>/g,
        '<p data-i18n=\"footer_slogan\">Usługi od A do Z, AI, IT, Fotografia, SMM i Sport.</p>'
    );
    
    // Replace copyright
    content = content.replace(
        /<p>&copy; 2026 Artur Gilowski\. Wszelkie prawa zastrzeżone\.<\/p>/g,
        '<p data-i18n=\"footer_copy\">&copy; 2026 Artur Gilowski. Wszelkie prawa zastrzeżone.</p>'
    );
    
    content = content.replace(
        /<p>© 2026 Artur Gilowski\. Wszelkie prawa zastrzeżone\.<\/p>/g,
        '<p data-i18n=\"footer_copy\">© 2026 Artur Gilowski. Wszelkie prawa zastrzeżone.</p>'
    );
    
    // In smm.html / ofm.html perhaps missing 'Wszelkie...':
    content = content.replace(
        /<p>&copy; 2026 Artur Gilowski\.<\/p>/g,
        '<p data-i18n=\"footer_copy\">&copy; 2026 Artur Gilowski. Wszelkie prawa zastrzeżone.</p>'
    );

    content = content.replace(
        /<p>© 2026 Artur Gilowski\.<\/p>/g,
        '<p data-i18n=\"footer_copy\">© 2026 Artur Gilowski. Wszelkie prawa zastrzeżone.</p>'
    );

    fs.writeFileSync('./docs/' + file, content);
});
console.log('Updated HTML files footer tags');

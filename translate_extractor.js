const cheerio = require('cheerio');
const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let dictionaryPL = {};
let counter = 0;

files.forEach(file => {
    // We skip o-mnie.html because it's already translated
    if (file === 'o-mnie.html') return;

    const html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false }); // keep formatting intact

    let modificationsMade = false;

    // Target elements
    const selectors = 'h1, h2, h3, p, li, .btn, th, td, label, div.img-placeholder, div.portfolio-tags span';

    $(selectors).each((i, el) => {
        const $el = $(el);
        
        // Skip if already translated
        if ($el.attr('data-i18n')) return;
        
        // Skip if inside navbar or footer to avoid messing up what's already translated mostly
        if ($el.closest('.nav-menu').length > 0 || $el.closest('.footer').length > 0) return;

        // Get own text only (ignore children like <i> icons)
        let ownText = '';
        $el.contents().each(function() {
            if (this.nodeType === 3) { // TEXT Node
                ownText += $(this).text();
            }
        });
        
        ownText = ownText.replace(/\s+/g, ' ').trim(); // normalize whitespace

        if (ownText.length > 2) {
            // To avoid replacing things like "&copy; 2026..."
            if (ownText.includes('Wszelkie prawa')) return;
            
            const key = `txt_${file.replace('.html', '').replace(/-/g, '_')}_${counter++}`;
            dictionaryPL[key] = ownText;
            
            $el.attr('data-i18n', key);
            modificationsMade = true;
        }
    });

    if (modificationsMade) {
        fs.writeFileSync(file, $.html());
    }
});

fs.writeFileSync('extracted_pl.json', JSON.stringify(dictionaryPL, null, 2));
console.log('Extraction complete! Check extracted_pl.json');

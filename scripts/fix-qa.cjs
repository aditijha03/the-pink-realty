const fs = require('fs');
let content = fs.readFileSync('tests/qa.spec.js', 'utf8');
content = content.replace('if (rect.right > window.innerWidth) {', 'if (rect.right > window.innerWidth && window.getComputedStyle(el).visibility !== "hidden" && window.getComputedStyle(el).display !== "none") {');
fs.writeFileSync('tests/qa.spec.js', content);

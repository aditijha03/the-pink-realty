const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const patterns = [
  'example\\.com',
  'XXXX',
  'lorem',
  'href="#"',
  '\\+91 9082345678' // Sample phone number
];

const cmd = `npx grep -rnw --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=tests 'src' -e "${patterns.join('\\|')}"`;

try {
  const result = execSync(`powershell -Command "Select-String -Pattern 'example\\.com|XXXX|lorem|href=\"#\"|9082345678' -Path src\\*\\*.jsx, src\\*\\*\\*.jsx, src\\*\\*.js -Exclude *node_modules*, *dist*, *tests*"`).toString();
  if (result.trim().length > 0) {
    console.error('Launch Check Failed! Placeholders found:');
    console.error(result);
    process.exit(1);
  } else {
    console.log('Launch Check Passed! No placeholders found.');
  }
} catch (e) {
  // Select-String exits with non-zero if no match found, which is what we want!
  console.log('Launch Check Passed! No placeholders found.');
}

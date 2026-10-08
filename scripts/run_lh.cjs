const { execSync } = require('child_process');

const urls = [
  'http://localhost:4173/',
  'http://localhost:4173/property-list',
  'http://localhost:4173/property/property-1-in-mumbai'
];

urls.forEach(url => {
  console.log(`Running lighthouse on ${url}...`);
  try {
    execSync(`npx lighthouse ${url} --quiet --output json --output-path ./scripts/out/qa/lh_${url.replace(/[^a-zA-Z0-9]/g, '_')}.json --chrome-flags="--headless"`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Lighthouse failed for ${url}`);
  }
});

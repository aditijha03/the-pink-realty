const fs = require('fs');

const fixMock = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/if \(import\.meta\.env\.VITE_USE_MOCK === 'true'\)/g, 
    "if (import.meta.env.VITE_USE_MOCK === 'true' && import.meta.env.DEV)");
  content = content.replace(/setProperties\(mockFeatured\..*?\);/g, "setProperties([]);");
  content = content.replace(/setProperties\(featured\.length > 0 \? featured\.slice\(0, 3\) : mockFeatured\.slice\(0, 3\)\);/g, "setProperties(featured.slice(0, 3));");
  content = content.replace(/setSimilarProperties\(mockProperties\);/g, "setSimilarProperties([]);");
  content = content.replace(/setPropertiesData\(mockProperties\);/g, "setPropertiesData([]);");
  fs.writeFileSync(file, content);
};

['src/components/FeaturedProperties.jsx', 'src/pages/PropertyDetail.jsx', 'src/pages/PropertyList.jsx'].forEach(fixMock);
console.log('Mocks fixed');

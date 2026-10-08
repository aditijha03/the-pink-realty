import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    async includedRoutes(paths, routes) {
      let propertySlugs = [];
      const useMock = process.env.VITE_USE_MOCK === 'true';
      
      if (!useMock) {
        const fetchProperties = async (retries = 3, timeout = 30000) => {
          for (let i = 0; i < retries; i++) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
              console.log(`Fetching properties from API (Attempt ${i + 1}/${retries})...`);
              const res = await fetch('http://localhost:5000/api/properties?limit=1000', { signal: controller.signal });
              clearTimeout(id);
              if (!res.ok) throw new Error(`API returned status: ${res.status}`);
              const data = await res.json();
              return data;
            } catch (error) {
              clearTimeout(id);
              console.error(`Attempt ${i + 1} failed: ${error.message}`);
              if (i === retries - 1) throw new Error('API unreachable after 3 attempts');
              // Wait 2s before retry
              await new Promise(r => setTimeout(r, 2000));
            }
          }
        };

        try {
          const data = await fetchProperties();
          if (data && data.success && data.data) {
            propertySlugs = data.data.properties.map(p => `/property/${p.slug}`);
          }
        } catch (e) {
          console.warn('API unreachable during build. Falling back to mock data.');
          propertySlugs = Array.from({ length: 24 }).map((_, i) => {
            const locations = ["Mumbai", "Navi Mumbai", "Thane", "Panvel", "Pune"];
            const location = locations[i % locations.length];
            return `/property/property-${i + 1}-in-${location.toLowerCase().replace(' ', '-')}`;
          });
        }
      } else {
        // useMock = true
        propertySlugs = Array.from({ length: 24 }).map((_, i) => {
          const locations = ["Mumbai", "Navi Mumbai", "Thane", "Panvel", "Pune"];
          const location = locations[i % locations.length];
          return `/property/property-${i + 1}-in-${location.toLowerCase().replace(' ', '-')}`;
        });
      }

      return paths.filter(p => !p.includes(':slug') && !p.includes('/admin')).concat(propertySlugs);
    },
  },
})

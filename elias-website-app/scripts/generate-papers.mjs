import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const cloudinary = require('cloudinary').v2;

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: 'dcyhkosqe',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function slugify(text) {
  return text
    .replace(/\.pdf$/i, '')
    .split('/')
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchPapers() {
  const allResources = [];

  for (const type of ['image', 'raw']) {
    try {
      const result = await cloudinary.api.resources_by_tag('paper', {
        resource_type: type,
        max_results: 500,
      });
      if (result && result.resources) {
        allResources.push(...result.resources);
      }
    } catch (err) {
      console.log(`No resources found for type ${type}: ${err.message}`);
    }
  }

  if (allResources.length === 0) {
    console.log('No papers found with tag "paper" on Cloudinary. Writing empty array.');
  }

  const papers = allResources
    .filter(r => r.format === 'pdf')
    .map(r => {
      const filename = r.public_id.split('/').pop().replace(/\.pdf$/i, '');
      const cleanName = filename.replace(/_[a-z0-9]{6}$/i, '');
      return {
        public_id: r.public_id,
        title: cleanName.replace(/[-_]/g, ' '),
        slug: slugify(cleanName),
        url: r.secure_url,
        format: r.format,
      };
    });

  const outputDir = resolve(__dirname, '..', 'src', 'data');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = resolve(outputDir, 'papers.json');
  writeFileSync(outputPath, JSON.stringify(papers, null, 2));
  console.log(`Generated src/data/papers.json with ${papers.length} papers:`);
  papers.forEach(p => console.log(`  - ${p.title} (${p.slug})`));
}

fetchPapers().catch(err => {
  console.error('Failed to generate papers.json:', err);
  process.exit(1);
});

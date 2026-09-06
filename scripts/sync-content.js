const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const outputFile = path.join(contentDir, 'content-manifest.json');

function parseFrontMatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { frontMatter: {}, body: raw };

  const frontMatterText = match[1];
  const body = match[2] || '';
  const data = {};

  frontMatterText.split(/\r?\n/).forEach((line) => {
    if (!line.includes(':')) return;
    const idx = line.indexOf(':');
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  });

  return { frontMatter: data, body };
}

function readMarkdownCollection(folderName) {
  const folderPath = path.join(contentDir, folderName);
  if (!fs.existsSync(folderPath)) return [];

  return fs.readdirSync(folderPath)
    .filter(file => file.endsWith('.md'))
    .sort()
    .map(file => {
      const filePath = path.join(folderPath, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { frontMatter, body } = parseFrontMatter(raw);
      return {
        ...frontMatter,
        body: body.trim(),
        file,
        slug: file.replace(/\.md$/, ''),
        type: folderName
      };
    });
}

const data = {
  berita: readMarkdownCollection('berita'),
  pengalaman: readMarkdownCollection('pengalaman')
};

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log(`Generated ${outputFile}`);
console.log(`Berita: ${data.berita.length}`);
console.log(`Pengalaman: ${data.pengalaman.length}`);

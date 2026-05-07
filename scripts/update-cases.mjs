import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../public/data/cases.json', import.meta.url);

async function updateCases() {
  const raw = await readFile(path, 'utf8');
  const json = JSON.parse(raw);

  json.updatedAt = new Date().toISOString();

  await writeFile(path, `${JSON.stringify(json, null, 2)}\n`);
  console.log('cases.json aggiornato:', json.updatedAt);
}

updateCases().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

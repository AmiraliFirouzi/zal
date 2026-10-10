import fs from 'fs';
import path from 'path';

const file = path.resolve('src/data/items.json');
const items = JSON.parse(fs.readFileSync(file, 'utf-8'));

async function fetchDownloads(url, kind) {
    try {
        let apiUrl = '';
        if (url.includes('/datasets/')) {
            const id = url.split('huggingface.co/datasets/')[1];
            if (!id) return null;
            apiUrl = `https://huggingface.co/api/datasets/${id}`;
        } else {
            const id = url.split('huggingface.co/')[1];
            if (!id) return null;
            apiUrl = `https://huggingface.co/api/models/${id}`;
        }

        console.log(`Fetching stats from: ${apiUrl}`);
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.error(`Failed to fetch ${apiUrl}: ${res.status} ${res.statusText}`);
            return null;
        }
        const data = await res.json();
        return data.downloads;
    } catch (e) {
        console.error(`Error fetching stats for ${url}:`, e);
        return null;
    }
}

async function main() {
    let updated = false;
    for (const item of items) {
        const hfLink = item.links?.find(l => l.type === 'huggingface' || l.url.includes('huggingface.co'));
        if (hfLink) {
            const dls = await fetchDownloads(hfLink.url, item.kind);
            if (dls !== null && dls !== undefined) {
                if (item.downloads !== dls) {
                    console.log(`Updating ${item.name} downloads from ${item.downloads} to ${dls}`);
                    item.downloads = dls;
                    updated = true;
                }
            }
        }
    }

    if (updated) {
        // preserve the format
        fs.writeFileSync(file, JSON.stringify(items, null, 2) + '\n');
        console.log('Downloads successfully updated in src/data/items.json');
    } else {
        console.log('No updates were needed. Everything is up to date.');
    }
}

main();

import fs from "fs";

const data = JSON.parse(fs.readFileSync("src/data/items.json", "utf-8"));
console.log(`Found ${data.length} items`);

for (const item of data) {
    const hfLink = item.links?.find(l => l.type === "huggingface" || l.url.includes("huggingface.co"));
    if (hfLink) {
        console.log(hfLink.url);
    }
}

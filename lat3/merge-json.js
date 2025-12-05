import fs from "fs";
import path from "path";

const dbFolder = path.join(process.cwd(), "db");
const outputFile = path.join(process.cwd(), "db.json");

let finalDB = {};

console.log("🔄 Merging JSON files from /db ...");

fs.readdirSync(dbFolder).forEach((file) => {
    if (file.endsWith(".json")) {
        const fullPath = path.join(dbFolder, file);

        try {
            const raw = fs.readFileSync(fullPath, "utf-8");
            const parsed = JSON.parse(raw);

            const key = path.basename(file, ".json");
            finalDB[key] = parsed;

            console.log(`  ✔ Loaded: ${file} → key: ${key}`);
        } catch (err) {
            console.error(`  ❌ Error parsing ${file}:`, err.message);
        }
    }
});

// Tulis hasil merge ke db.json
fs.writeFileSync(outputFile, JSON.stringify(finalDB, null, 2), "utf-8");

console.log("\n✅ Merge completed → db.json generated!");
console.log("You can now run json-server using db.json\n");

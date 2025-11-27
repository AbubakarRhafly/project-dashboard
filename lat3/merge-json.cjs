const fs = require("fs");
const path = require("path");

const dbFolder = path.join(__dirname, "db");
const outputFile = path.join(__dirname, "db.json");

if (!fs.existsSync(dbFolder)) {
    console.error("Folder /db tidak ditemukan.");
    process.exit(1);
}

const files = fs.readdirSync(dbFolder).filter(f => f.endsWith(".json"));
if (files.length === 0) {
    console.error("Tidak ada file .json di folder /db.");
    process.exit(1);
}

const combined = {};
for (const file of files) {
    const key = path.basename(file, ".json");
    const content = fs.readFileSync(path.join(dbFolder, file), "utf-8");
    combined[key] = JSON.parse(content);
}

fs.writeFileSync(outputFile, JSON.stringify(combined, null, 2));
console.log("✅ Berhasil generate db.json dari folder /db");

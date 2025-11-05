/* eslint-disable @typescript-eslint/no-var-requires */
const { createHash } = require("crypto");
const fs = require("fs");
const path = require("path");

const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const SHUFFLED_ALPHABET = "ph2QzJXkO5BqYDa9m8l1u0gALFy4e/ZvI+tMxNc6VSwW7TsKrHGniEjUodRCbPf3=";

function toObfuscatedAlphabet(input) {
  return Array.from(input)
    .map((char) => {
      const index = BASE64_ALPHABET.indexOf(char);
      return index === -1 ? char : SHUFFLED_ALPHABET[index];
    })
    .join("");
}

function chunkString(input, size) {
  const chunks = [];
  for (let i = 0; i < input.length; i += size) {
    chunks.push(input.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  const projectRoot = process.cwd();
  const sourcePath = path.resolve(projectRoot, "src/data/hero-buffs.json");
  const outputPath = path.resolve(projectRoot, "src/data/hero-buffs-encoded.ts");

  const raw = await fs.promises.readFile(sourcePath, "utf-8");
  const parsed = JSON.parse(raw);
  const normalized = JSON.stringify(parsed);

  const base64 = Buffer.from(normalized, "utf-8").toString("base64");
  const obfuscated = toObfuscatedAlphabet(base64);
  const checksum = createHash("sha256").update(normalized).digest("hex");

  const encodedLiteral = chunkString(obfuscated, 120)
    .map((chunk) => `  "${chunk}"`)
    .join(" +\n");

  const fileContent = `// \u26a0\ufe0f \u6b64\u6587\u4ef6\u7531 scripts/obfuscate-hero-buffs.cjs \u81ea\u52a8\u751f\u6210\uff0c\u8bf7\u52ff\u624b\u52a8\u4fee\u6539\u3002\n` +
    `// \u6700\u540e\u540c\u6b65\u65f6\u95f4\uff1a${new Date().toISOString()}\n` +
    `export const ENCODED_HERO_BUFFS =\n${encodedLiteral};\n` +
    `export const HERO_BUFFS_CHECKSUM = "${checksum}";\n`;

  await fs.promises.writeFile(outputPath, fileContent, "utf-8");
  console.info(`已生成混淆数据 -> ${path.relative(projectRoot, outputPath)}`);
}

main().catch((error) => {
  console.error("生成混淆数据失败", error);
  process.exitCode = 1;
});

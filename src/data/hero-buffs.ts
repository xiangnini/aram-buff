import { ENCODED_HERO_BUFFS, HERO_BUFFS_CHECKSUM } from "@/data/hero-buffs-encoded";

export type HeroBuff = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  damageDealtMultiplier: number;
  damageTakenMultiplier: number;
  healingGivenMultiplier: number;
  shieldingGivenMultiplier: number;
  abilityHasteBonus: number;
  attackSpeedBonus: number;
  tenacity?: number;
  energyRegenBonus?: number;
  notes?: string;
  roles?: string[];
  tags?: string[];
  patch?: string;
};

const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const SHUFFLED_ALPHABET = "ph2QzJXkO5BqYDa9m8l1u0gALFy4e/ZvI+tMxNc6VSwW7TsKrHGniEjUodRCbPf3=";

let heroBuffsCache: HeroBuff[] | null = null;

function fromObfuscatedAlphabet(input: string): string {
  return [...input]
    .map((char) => {
      const index = SHUFFLED_ALPHABET.indexOf(char);
      return index === -1 ? char : BASE64_ALPHABET[index];
    })
    .join("");
}

function decodeBase64ToString(base64: string): string {
  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }

  throw new Error("无法解码 Base64：缺少可用的全局解码器");
}

function createHeroBuffs(): HeroBuff[] {
  const base64 = fromObfuscatedAlphabet(ENCODED_HERO_BUFFS);
  const json = decodeBase64ToString(base64);
  const parsed = JSON.parse(json) as HeroBuff[];
  return parsed;
}

export function getHeroBuffs(): HeroBuff[] {
  if (!heroBuffsCache) {
    heroBuffsCache = createHeroBuffs();
  }
  return heroBuffsCache;
}

export const HERO_BUFFS: HeroBuff[] = getHeroBuffs();

export const HERO_BUFFS_SOURCE_CHECKSUM = HERO_BUFFS_CHECKSUM;

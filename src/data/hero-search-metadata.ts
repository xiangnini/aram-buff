export type HeroSearchMetadata = {
  /** 额外的中文或常用外号 */
  aliases?: string[];
  /** 便于检索的额外关键词，如常见定位或标签 */
  keywords?: string[];
};

export const HERO_SEARCH_METADATA: Record<string, HeroSearchMetadata> = {
  ashe: {
    aliases: ["艾希", "寒冰", "刮痧", "助手"],
    keywords: ["ADC", "下路"],
  },
  lux: {
    aliases: ["拉克丝", "光辉"],
    keywords: ["法师", "中单", "辅助"],
  },
  jinx: {
    aliases: ["金克丝"],
    keywords: ["ADC", "下路"],
  },
};

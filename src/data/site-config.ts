export const SITE_CONFIG = {
  name: "LOL 大乱斗 Buff 查询",
  description: "快速检索与对比英雄联盟大乱斗（ARAM）模式的英雄增益数据，支持智能阵容分析与数据可视化。大乱斗英雄buff",
  url: "https://xiangnini.github.io/aram-buff/",
  ogImage: "https://xiangnini.github.io/aram-buff/og.png",
  links: {
    github: "https://github.com/xiangnini/aram-buff"
  },
  author: "xiangnini",
  keywords: [
    "英雄联盟",
    "大乱斗",
    "ARAM",
    "Buff",
    "英雄增益",
    "阵容分析",
    "LOL"
  ],
  gameVersion: process.env.NEXT_PUBLIC_GAME_VERSION ?? "15.21",
  feedbackUrl:
    process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "https://github.com/xiangnini/aram-buff/issues"
} as const;

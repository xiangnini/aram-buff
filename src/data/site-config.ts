export const SITE_CONFIG = {
  gameVersion: process.env.NEXT_PUBLIC_GAME_VERSION ?? "15.21",
  feedbackUrl:
    process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "https://github.com/xiangnini/aram-buff/issues"
} as const;

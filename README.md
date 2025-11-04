
# LOL 大乱斗英雄 Buff 查询平台

## 项目简介

基于 Next.js 14 + App Router 构建的 ARAM（大乱斗）英雄增益数据中心，提供：

- 🔍 **智能搜索联想**：实时模糊匹配英雄/标签/定位，快速定位目标。
- 📊 **全英雄数据一览**：按输出、抗压、支援能力排序，快速筛选阵容短板。
- ⚔️ **当局阵容对比**：录入双方阵容后自动计算平均增益、位置分布与能力提醒。
- 🗃️ **独立数据维护**：通过 JSON 数据与 Prisma 脚本独立维护 buff，支持版本追溯与数据库同步。

## 技术栈

- **前端**：Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui · cmdk
- **数据层**：Prisma ORM · PostgreSQL（建议使用 Supabase）· Zod · Fuse.js 本地联想
- **工具链**：ESLint · Prettier · Vitest · tsx · npm

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量模版并填写数据库连接
copy .env.example .env
# 修改 DATABASE_URL / DIRECT_DATABASE_URL 指向 Supabase 或本地 PostgreSQL

# 3. 运行数据库迁移（首次执行）
npx prisma migrate dev --name init

# 4. 同步英雄 buff 数据到数据库（可选）
npx tsx scripts/sync-hero-buffs.ts

# 5. 启动开发服务
npm run dev

# 6. 打开浏览器访问
http://localhost:3000
```

## 项目结构

```
src/
	app/              # Next.js App Router 页面与 API Route
	components/       # UI 组件与业务组件（Tailwind + shadcn/ui）
	data/             # 英雄 buff JSON 数据与类型定义
	hooks/            # 通用 Hooks
	lib/              # 工具库（Prisma、样式、字体等）
	services/         # 业务逻辑与分析模块
prisma/             # Prisma schema 与迁移
scripts/            # 数据同步脚本（tsx）
```

## 数据维护策略

- **原始数据**：`src/data/hero-buffs.json`
	- 由运营/数值同学维护，支持版本号、notes 字段记录补充说明。
	- 前端直接消费 JSON，保障即时可查；
	- 可通过 `npx tsx scripts/sync-hero-buffs.ts` 将数据灌入数据库，供后端或分析使用。

- **数据库 Schema**：`prisma/schema.prisma`
	- `Hero`：英雄基础信息
	- `HeroBuff`：按版本记录 ARAM 增益倍率与额外属性
	- `PatchHistory`：版本发布记录（便于扩展补丁页）

## 功能亮点

- 联想搜索：采用 Fuse.js 实现前缀 + 模糊匹配，同时返回常见组合建议。
- 全局主题：内置明 / 暗主题切换，使用 `next-themes` 与 shadcn 组件。
- 阵容分析：支持 5v5 队伍录入，实时计算平均增益与位置分布。
- API 示例：
	- `GET /api/search?query=ashe`
	- `GET /api/heroes`
	- `POST /api/match/analyze` `{ "heroIds": ["ashe", "lux"] }`

## 开发指引

- Lint：`npm run lint`
- 构建：`npm run build`
- 单测（预留）：`npm run test`
- Prisma Studio：`npm run prisma:studio`
- 数据同步：`npx tsx scripts/sync-hero-buffs.ts`

## 后续规划

- ✅ 接入 Supabase 触发器，实现数据更新后自动重建搜索索引。
- ✅ 扩展 API 以支持实时对局分享链接与阵容评分。
- 🔜 引入 Meilisearch/pg_trgm，增强联想排序与多语支持。
- 🔜 增补 Playwright E2E 覆盖核心交互。

欢迎 issue/PR，共建更准确好用的 ARAM 数据工具！

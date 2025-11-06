const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const isCloudflarePages = process.env.CF_PAGES === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

// Optimize for Cloudflare Pages
if (isCloudflarePages) {
  nextConfig.webpack = (config, { isServer }) => {
    // Disable webpack cache to avoid large cache files
    config.cache = false;
    return config;
  };
}

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  nextConfig.output = 'export';
  nextConfig.basePath = `/${repo}`;
  nextConfig.images = {
    unoptimized: true,
  };
}

export default nextConfig;

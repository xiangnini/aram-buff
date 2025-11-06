const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  nextConfig.output = 'export';
  nextConfig.basePath = `/${repo}`;
  nextConfig.images = {
    unoptimized: true,
  };
}

export default nextConfig;

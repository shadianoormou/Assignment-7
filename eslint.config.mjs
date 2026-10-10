import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "data/*.db"],
  },
];

export default config;

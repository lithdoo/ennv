import { defineConfig } from 'dumi';

const repo = 'ennv'

export default defineConfig({
  themeConfig: {
    name: 'ENNV',
    logo: "/ennv/favicon500.png"
  },
  title: 'ennv',
  base:  `/${repo}/`,
  publicPath:  `/${repo}/`,
});

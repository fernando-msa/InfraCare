import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: { colors: { ok: '#16a34a', warn: '#eab308', crit: '#dc2626', info: '#2563eb' } } },
  plugins: [],
};
export default config;

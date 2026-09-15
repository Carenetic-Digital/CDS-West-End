import type { APIRoute } from 'astro';

/**
 * Live/indexing robots.txt (flipped at launch together with BaseLayout
 * noindex=false). Remember: AI crawlers (GPTBot, OAI-SearchBot,
 * PerplexityBot, ClaudeBot, Google-Extended) must not be blocked in Cloudflare.
 */
const getRobotsTxt = () =>
  [
    'User-agent: *',
    'Allow: /',
    '',
    'Sitemap: https://www.westenddentalcentre.com/sitemap-index.xml',
  ].join('\n');

export const GET: APIRoute = () => {
  return new Response(getRobotsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

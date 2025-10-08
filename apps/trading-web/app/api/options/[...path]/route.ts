import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const UPSTREAM = process.env.MARKET_DATA_INTERNAL_URL ?? 'http://localhost:8002';

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> } // Next 15: params is a Promise
) {
  const { path } = await ctx.params;
  const url = new URL(req.url);

  // 1) First try path-style upstream: /options/AMD/chain, /options/AMD/strategies, ...
  const direct = `${UPSTREAM}/options/${path.map(encodeURIComponent).join('/')}${url.search}`;
  let res = await fetch(direct, { cache: 'no-store' });

  // 2) Auto-fallback: if 404 and path looks like /:symbol/:endpoint, try query-style: /options/:endpoint?symbol=...
  if (res.status === 404 && path.length >= 2) {
    const [symbol, endpoint, ...rest] = path;
    const qs = new URLSearchParams(url.searchParams);
    qs.set('symbol', symbol);
    const fallback = `${UPSTREAM}/options/${[endpoint, ...rest].map(encodeURIComponent).join('/')}${
      qs.size ? `?${qs}` : ''
    }`;
    const res2 = await fetch(fallback, { cache: 'no-store' });
    if (res2.ok) res = res2; // use fallback if it worked
  }

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}

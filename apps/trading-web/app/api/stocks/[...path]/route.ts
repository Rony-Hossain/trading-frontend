import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_MARKET_DATA_URL = 'http://localhost:8002'

function getInternalMarketDataUrl() {
  const candidate = process.env.MARKET_DATA_INTERNAL_URL
  return (candidate && candidate.trim()) || DEFAULT_MARKET_DATA_URL
}

function buildUpstreamUrl(pathSegments: string[], search: string) {
  const sanitizedPath = pathSegments
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  const base = getInternalMarketDataUrl().replace(/\/$/, '')
  return `${base}/stocks/${sanitizedPath}${search}`
}

function cloneRelevantHeaders(source: Headers) {
  const headers = new Headers()
  const contentType = source.get('content-type')
  if (contentType) {
    headers.set('content-type', contentType)
  }

  const passthroughKeys = ['retry-after', 'x-ratelimit-limit', 'x-ratelimit-remaining']
  passthroughKeys.forEach((key) => {
    const value = source.get(key)
    if (value) {
      headers.set(key, value)
    }
  })

  return headers
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params
    if (!Array.isArray(path) || path.length === 0) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }

    const requestUrl = new URL(request.url)
    const upstreamUrl = buildUpstreamUrl(path, requestUrl.search)

    const upstreamResponse = await fetch(upstreamUrl, {
      cache: 'no-store',
    })

    const headers = cloneRelevantHeaders(upstreamResponse.headers)
    const body = await upstreamResponse.text()

    return new Response(body, {
      status: upstreamResponse.status,
      headers,
    })
  } catch (error) {
    console.error('[MarketDataProxy] Catch-all proxy failure:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 502 }
    )
  }
}

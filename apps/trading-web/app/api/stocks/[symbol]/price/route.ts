import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_MARKET_DATA_URL = 'http://localhost:8002'

function getInternalMarketDataUrl() {
  const configured = process.env.MARKET_DATA_INTERNAL_URL
  return (configured && configured.trim()) || DEFAULT_MARKET_DATA_URL
}

function buildUpstreamUrl(symbol: string) {
  const base = getInternalMarketDataUrl().replace(/\/$/, '')
  const encodedSymbol = encodeURIComponent(symbol)
  return `${base}/stocks/${encodedSymbol}/price`
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
  _request: Request,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await context.params
    const upstreamUrl = buildUpstreamUrl(symbol)

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
    console.error('[MarketDataProxy] Failed to reach upstream:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 502 }
    )
  }
}

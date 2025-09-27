// Lightweight intraday signal evaluator and options suggestion helper
// NOTE: This is a frontend-only heuristic. For production, move to a backend worker.

export type DirectionSignal = 'BUY' | 'SELL' | 'HOLD'

export interface PricePoint {
  t: number // epoch ms
  price: number
  volume?: number
}

export interface GreeksData {
  delta: number
  theta: number
  vega: number
  gamma: number
}

export interface OptionSuggestion {
  side: 'CALL' | 'PUT'
  strategy: 'DEBIT_SPREAD' | 'CREDIT_SPREAD' | 'NAKED' | 'IRON_CONDOR'
  strikes?: number[]
  targetDelta?: number
  dte?: number
  estimatedCost?: number
  maxProfit?: number
  maxLoss?: number
  breakEven?: number
  probabilityProfit?: number
  greeks?: GreeksData
  liquidityScore?: number
  notes?: string
}

export interface EvaluatedSignal {
  symbol: string
  signal: DirectionSignal
  confidence: number // 0-100
  reason: string
  target?: number
  stop?: number
  createdAt: Date
  optionSuggestion: OptionSuggestion
}

// Simple EMA
export function ema(values: number[], period: number): number | null {
  if (values.length < 2) return values[values.length - 1] ?? null
  const k = 2 / (period + 1)
  let e = values[0]
  for (let i = 1; i < values.length; i++) e = values[i] * k + e * (1 - k)
  return e
}

// Simple RSI (last window)
export function rsi(values: number[], period = 14): number | null {
  if (values.length < period + 1) return null
  let gains = 0, losses = 0
  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1]
    if (diff > 0) gains += diff; else losses -= diff
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

// Very rough VWAP using provided window (price*vol / vol)
export function vwap(points: PricePoint[]): number | null {
  if (!points.length) return null
  let pv = 0, vv = 0
  for (const p of points) {
    const v = p.volume ?? 1
    pv += p.price * v
    vv += v
  }
  return vv ? pv / vv : null
}

// Evaluate BUY/SELL/HOLD with simple confluence: EMA crossover + RSI + price vs VWAP
export function evaluateSignal(symbol: string, series: PricePoint[]): EvaluatedSignal | null {
  if (series.length < 20) return null
  const closes = series.map(p => p.price)
  const last = closes[closes.length - 1]
  const ema9 = ema(closes.slice(-30), 9)
  const ema20 = ema(closes.slice(-60), 20)
  const r = rsi(closes, 14)
  const w = vwap(series.slice(-120))
  const time = new Date(series[series.length - 1].t)

  let signal: DirectionSignal = 'HOLD'
  let score = 0
  const reasons: string[] = []

  if (ema9 != null && ema20 != null) {
    if (ema9 > ema20) { score += 30; reasons.push('EMA9 > EMA20') }
    if (ema9 < ema20) { score -= 30; reasons.push('EMA9 < EMA20') }
  }
  if (r != null) {
    if (r > 60) { score += 20; reasons.push(`RSI ${r.toFixed(0)} bullish`) }
    if (r < 40) { score -= 20; reasons.push(`RSI ${r.toFixed(0)} bearish`) }
  }
  if (w != null) {
    if (last > w) { score += 20; reasons.push('Price > VWAP') }
    if (last < w) { score -= 20; reasons.push('Price < VWAP') }
  }

  if (score >= 30) signal = 'BUY'
  else if (score <= -30) signal = 'SELL'

  // naive target/stop using ATR-like proxy (std dev of last N)
  const window = closes.slice(-30)
  const mean = window.reduce((a,b)=>a+b,0)/window.length
  const variance = window.reduce((s,x)=>s+(x-mean)*(x-mean),0)/window.length
  const vol = Math.sqrt(variance)
  const target = signal === 'BUY' ? last + 2*vol : signal === 'SELL' ? last - 2*vol : undefined
  const stop = signal === 'BUY' ? last - 1*vol : signal === 'SELL' ? last + 1*vol : undefined

  // Enhanced option suggestion with realistic pricing
  const atmStrike = Math.round(last / 5) * 5 // Round to nearest $5
  const otmStrike = signal === 'BUY' ? atmStrike + 10 : atmStrike - 10
  
  const optionSuggestion: OptionSuggestion = signal === 'BUY'
    ? { 
        side: 'CALL', 
        strategy: 'DEBIT_SPREAD', 
        strikes: [atmStrike, otmStrike],
        targetDelta: 0.35, 
        dte: 3,
        estimatedCost: vol * 2, // Rough estimate
        maxProfit: (otmStrike - atmStrike) - (vol * 2),
        maxLoss: vol * 2,
        breakEven: atmStrike + (vol * 2),
        probabilityProfit: 0.45,
        greeks: {
          delta: 0.35 - 0.15, // Net delta for spread
          theta: -0.08,
          vega: 0.12,
          gamma: 0.06
        },
        liquidityScore: 75,
        notes: `Buy ${atmStrike}C / Sell ${otmStrike}C debit spread. Max profit at ${otmStrike}+` 
      }
    : signal === 'SELL'
      ? { 
          side: 'PUT', 
          strategy: 'DEBIT_SPREAD', 
          strikes: [atmStrike, otmStrike],
          targetDelta: -0.35, 
          dte: 3,
          estimatedCost: vol * 2,
          maxProfit: (atmStrike - otmStrike) - (vol * 2),
          maxLoss: vol * 2,
          breakEven: atmStrike - (vol * 2),
          probabilityProfit: 0.45,
          greeks: {
            delta: -0.35 + 0.15, // Net delta for spread
            theta: -0.08,
            vega: 0.12,
            gamma: 0.06
          },
          liquidityScore: 75,
          notes: `Buy ${atmStrike}P / Sell ${otmStrike}P debit spread. Max profit below ${otmStrike}` 
        }
      : { 
          side: 'CALL', 
          strategy: 'IRON_CONDOR', 
          strikes: [atmStrike - 10, atmStrike - 5, atmStrike + 5, atmStrike + 10],
          targetDelta: 0.0, 
          dte: 5,
          estimatedCost: 0, // Credit strategy
          maxProfit: vol * 1.5,
          maxLoss: (5 * 2) - (vol * 1.5), // Wing width minus credit
          breakEven: atmStrike,
          probabilityProfit: 0.65,
          greeks: {
            delta: 0.0,
            theta: 0.15, // Positive theta decay
            vega: -0.08,
            gamma: -0.02
          },
          liquidityScore: 65,
          notes: `Iron condor: profit if price stays between ${atmStrike-5} and ${atmStrike+5}. Time decay works for you.` 
        }

  const confidence = Math.min(95, Math.max(0, 50 + score))

  return {
    symbol,
    signal,
    confidence,
    reason: reasons.join('; '),
    target,
    stop,
    createdAt: time,
    optionSuggestion
  }
}


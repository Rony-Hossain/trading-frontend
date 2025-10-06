/**
 * Comprehensive Trading Glossary Data
 * Full term set for GlossaryPage
 */

export interface GlossaryEntry {
  term: string
  category: 'technical' | 'fundamental' | 'options' | 'risk' | 'general'
  beginnerDefinition: string
  expertDefinition: string
  example?: string
  relatedTerms: string[]
  lastReviewed: string
}

export const GLOSSARY_TERMS: GlossaryEntry[] = [
  // Technical Analysis (20 terms)
  {
    term: 'RSI',
    category: 'technical',
    beginnerDefinition: 'Relative Strength Index - Shows if a stock is overbought (too high) or oversold (too low). Values range from 0-100.',
    expertDefinition: 'Momentum oscillator measuring the magnitude of recent price changes. Values above 70 suggest overbought conditions; below 30 suggest oversold. Calculated as: RSI = 100 - (100 / (1 + RS)) where RS = Average Gain / Average Loss.',
    example: 'If RSI > 70, the stock might be due for a pullback.',
    relatedTerms: ['MACD', 'Stochastic', 'Momentum'],
    lastReviewed: '2025-09-15'
  },
  {
    term: 'MACD',
    category: 'technical',
    beginnerDefinition: 'Moving Average Convergence Divergence - Shows the trend direction and momentum. When lines cross, it signals potential buy or sell opportunities.',
    expertDefinition: 'Trend-following momentum indicator showing relationship between two exponential moving averages (12-day and 26-day EMAs). MACD line = 12EMA - 26EMA. Signal line = 9-day EMA of MACD. Histogram shows difference between MACD and signal lines.',
    example: 'When MACD line crosses above signal line, it\'s a bullish signal.',
    relatedTerms: ['RSI', 'EMA', 'SMA', 'Moving Average'],
    lastReviewed: '2025-09-28'
  },
  {
    term: 'Bollinger Bands',
    category: 'technical',
    beginnerDefinition: 'Price bands above and below a moving average. When price touches the bands, it might reverse direction.',
    expertDefinition: 'Volatility indicator consisting of a middle band (20-period SMA) and upper/lower bands at ±2 standard deviations. Band width expands during high volatility and contracts during low volatility. Price touching outer bands suggests potential reversal or continuation breakout.',
    example: 'Price at the lower band in an uptrend may signal a buying opportunity.',
    relatedTerms: ['SMA', 'Volatility', 'Standard Deviation'],
    lastReviewed: '2025-09-20'
  },
  {
    term: 'SMA',
    category: 'technical',
    beginnerDefinition: 'Simple Moving Average - The average price over a specific number of days. Helps identify trends.',
    expertDefinition: 'Arithmetic mean of prices over a specified period. Each price point has equal weight. SMA(n) = (P1 + P2 + ... + Pn) / n. Commonly used periods: 20, 50, 200 days. Slower to respond to price changes than EMA.',
    example: '50-day SMA crossing above 200-day SMA is called a "Golden Cross" (bullish signal).',
    relatedTerms: ['EMA', 'Moving Average', 'Golden Cross'],
    lastReviewed: '2025-09-25'
  },
  {
    term: 'EMA',
    category: 'technical',
    beginnerDefinition: 'Exponential Moving Average - Like SMA but gives more weight to recent prices, reacting faster to changes.',
    expertDefinition: 'Weighted moving average giving more importance to recent data. EMA(t) = Price(t) × k + EMA(t-1) × (1-k), where k = 2/(N+1). More responsive than SMA. Common in MACD calculation. Less lag in trend identification.',
    example: '12-day EMA is used in MACD calculation for short-term momentum.',
    relatedTerms: ['SMA', 'MACD', 'Moving Average'],
    lastReviewed: '2025-09-25'
  },
  {
    term: 'Stochastic',
    category: 'technical',
    beginnerDefinition: 'Compares a stock\'s closing price to its price range over time. Values from 0-100 show if it\'s overbought or oversold.',
    expertDefinition: 'Momentum indicator comparing closing price to price range over period N. %K = (Close - Low(N)) / (High(N) - Low(N)) × 100. %D is 3-period SMA of %K. Values >80 suggest overbought, <20 suggest oversold. Divergence from price signals potential reversal.',
    example: 'Stochastic crossing above 20 from below signals potential upward reversal.',
    relatedTerms: ['RSI', 'Momentum', 'Overbought'],
    lastReviewed: '2025-09-18'
  },
  {
    term: 'ADX',
    category: 'technical',
    beginnerDefinition: 'Average Directional Index - Measures trend strength on a scale of 0-100. Higher values mean stronger trends.',
    expertDefinition: 'Non-directional indicator measuring trend strength derived from directional movement indicators (+DI, -DI). ADX > 25 suggests trending market; < 20 suggests ranging. Does not indicate direction, only strength. Calculated from smoothed averages of +DM and -DM.',
    example: 'ADX rising above 25 confirms a strong trend, regardless of direction.',
    relatedTerms: ['DMI', 'Trend Strength', 'Directional Movement'],
    lastReviewed: '2025-09-22'
  },
  {
    term: 'Fibonacci Retracement',
    category: 'technical',
    beginnerDefinition: 'Horizontal lines that show where support and resistance might occur, based on key percentages (38.2%, 50%, 61.8%).',
    expertDefinition: 'Technical analysis tool using horizontal lines at Fibonacci ratios (23.6%, 38.2%, 50%, 61.8%, 78.6%) to identify potential support/resistance levels. Applied between significant price points (swing high/low). Based on mathematical sequence where each number is sum of previous two.',
    example: 'After a rally from $100 to $150, 61.8% retracement suggests support at $119.',
    relatedTerms: ['Support', 'Resistance', 'Swing High'],
    lastReviewed: '2025-09-19'
  },
  {
    term: 'Volume',
    category: 'technical',
    beginnerDefinition: 'The number of shares traded in a given time period. High volume often confirms price movements.',
    expertDefinition: 'Total number of shares or contracts traded during specified period. Volume precedes price - accumulation/distribution patterns visible in volume before price moves. Volume profile shows distribution at price levels. Institutional activity often visible through volume spikes.',
    example: 'Breakout on high volume is more reliable than on low volume.',
    relatedTerms: ['OBV', 'Volume Profile', 'Liquidity'],
    lastReviewed: '2025-09-27'
  },
  {
    term: 'Support',
    category: 'technical',
    beginnerDefinition: 'A price level where a stock tends to stop falling and may bounce back up.',
    expertDefinition: 'Price level where buying interest is strong enough to overcome selling pressure, preventing further decline. Identified by historical price reactions, round numbers, moving averages, or Fibonacci levels. Broken support often becomes resistance.',
    example: 'Stock bounced off $50 three times - $50 is now a strong support level.',
    relatedTerms: ['Resistance', 'Price Level', 'Fibonacci Retracement'],
    lastReviewed: '2025-09-26'
  },
  {
    term: 'Resistance',
    category: 'technical',
    beginnerDefinition: 'A price level where a stock tends to stop rising and may fall back down.',
    expertDefinition: 'Price level where selling pressure overcomes buying demand, capping upward movement. Identified through previous highs, psychological levels, or technical indicators. Broken resistance often becomes support. Multiple tests weaken resistance.',
    example: 'Stock failed to break $100 twice - $100 is a resistance level.',
    relatedTerms: ['Support', 'Breakout', 'Price Level'],
    lastReviewed: '2025-09-26'
  },
  {
    term: 'Candlestick',
    category: 'technical',
    beginnerDefinition: 'A chart type showing open, high, low, and close prices for a period. Body color shows if price went up (green) or down (red).',
    expertDefinition: 'Visual representation of price action showing four key data points: open, high, low, close. Body shows open-close range; wicks show high-low range. Patterns (doji, hammer, engulfing) signal potential reversals or continuations. Originated in 18th century Japanese rice trading.',
    example: 'A long lower wick (hammer) after a downtrend suggests buyers stepping in.',
    relatedTerms: ['Chart Pattern', 'Doji', 'Price Action'],
    lastReviewed: '2025-09-24'
  },
  {
    term: 'ATR',
    category: 'technical',
    beginnerDefinition: 'Average True Range - Measures how much a stock typically moves in a day. Higher ATR means bigger price swings.',
    expertDefinition: 'Volatility indicator measuring average price range over period N (typically 14). TR = max(High-Low, |High-Close(prev)|, |Low-Close(prev)|). ATR is N-period moving average of TR. Used for position sizing and stop-loss placement. Does not indicate direction.',
    example: 'If ATR is $5, expect the stock to move about $5 per day on average.',
    relatedTerms: ['Volatility', 'True Range', 'Position Sizing'],
    lastReviewed: '2025-09-23'
  },
  {
    term: 'OBV',
    category: 'technical',
    beginnerDefinition: 'On-Balance Volume - Tracks volume flow. Rising OBV suggests buying pressure; falling OBV suggests selling.',
    expertDefinition: 'Cumulative volume-based momentum indicator. Adds volume on up days, subtracts on down days. OBV change precedes price change. Divergence between OBV and price signals potential reversal. Confirms trend strength when moving in same direction as price.',
    example: 'Price making new highs while OBV declining is bearish divergence.',
    relatedTerms: ['Volume', 'Divergence', 'Momentum'],
    lastReviewed: '2025-09-21'
  },
  {
    term: 'Momentum',
    category: 'technical',
    beginnerDefinition: 'The speed of price changes. Strong momentum means prices are changing quickly.',
    expertDefinition: 'Rate of price acceleration or deceleration. Measured by comparing current price to price N periods ago. Positive momentum = uptrend; negative = downtrend. Leading indicator - momentum peaks/troughs before price. Used to identify overbought/oversold conditions.',
    example: 'Momentum decreasing while price rising signals weakening uptrend.',
    relatedTerms: ['RSI', 'MACD', 'Rate of Change'],
    lastReviewed: '2025-09-17'
  },
  {
    term: 'Breakout',
    category: 'technical',
    beginnerDefinition: 'When price moves above resistance or below support, potentially starting a new trend.',
    expertDefinition: 'Price movement through defined support/resistance level with increased volume. Valid breakouts show sustained movement beyond level, ideally with 3%+ penetration. False breakouts (fakeouts) occur when price quickly reverses. Volume confirmation critical.',
    example: 'Stock breaking above $100 resistance on 2x average volume confirms breakout.',
    relatedTerms: ['Resistance', 'Support', 'Volume'],
    lastReviewed: '2025-09-29'
  },
  {
    term: 'Golden Cross',
    category: 'technical',
    beginnerDefinition: 'When a short-term average crosses above a long-term average, signaling a potential uptrend.',
    expertDefinition: '50-day SMA crossing above 200-day SMA, indicating long-term bullish momentum shift. Opposite is Death Cross (50 below 200). Lagging indicator due to long periods. More reliable in trending markets than ranging. Often confirms trend already in progress.',
    example: 'S&P 500 showing a Golden Cross historically preceded multi-month rallies.',
    relatedTerms: ['SMA', 'Death Cross', 'Moving Average'],
    lastReviewed: '2025-09-30'
  },
  {
    term: 'Chart Pattern',
    category: 'technical',
    beginnerDefinition: 'Recognizable shapes in price charts (like head and shoulders, triangles) that suggest future price direction.',
    expertDefinition: 'Geometric price formations indicating potential continuation or reversal. Continuation patterns: triangles, flags, pennants. Reversal patterns: head & shoulders, double top/bottom. Pattern validity requires volume confirmation and clear breakout. Statistical edge varies by pattern and market condition.',
    example: 'Head and shoulders pattern with neckline break suggests downward reversal.',
    relatedTerms: ['Head and Shoulders', 'Triangle', 'Breakout'],
    lastReviewed: '2025-09-16'
  },
  {
    term: 'Divergence',
    category: 'technical',
    beginnerDefinition: 'When price and an indicator move in opposite directions, warning of a potential trend change.',
    expertDefinition: 'Discrepancy between price action and indicator (RSI, MACD, OBV). Bullish divergence: price makes lower low, indicator makes higher low (potential reversal up). Bearish divergence: price makes higher high, indicator makes lower high (potential reversal down). Not timing tool - trend can continue despite divergence.',
    example: 'Price making new highs while RSI declining is bearish divergence.',
    relatedTerms: ['RSI', 'MACD', 'OBV'],
    lastReviewed: '2025-09-14'
  },
  {
    term: 'Volatility',
    category: 'technical',
    beginnerDefinition: 'How much and how quickly a stock\'s price changes. High volatility means bigger price swings.',
    expertDefinition: 'Statistical measure of price dispersion, typically measured by standard deviation or variance. Historical volatility: realized price movement. Implied volatility: market\'s forecast of future movement (derived from options). VIX measures S&P 500 implied volatility. Critical for options pricing and risk management.',
    example: 'Stock with 30% annual volatility typically moves ±30% per year.',
    relatedTerms: ['ATR', 'Bollinger Bands', 'VIX'],
    lastReviewed: '2025-09-13'
  },

  // Options (15 terms)
  {
    term: 'Delta',
    category: 'options',
    beginnerDefinition: 'How much an option\'s price changes when the stock price moves $1.',
    expertDefinition: 'First-order Greek measuring the rate of change of option price with respect to changes in underlying asset price. Call deltas range 0-1; put deltas range -1 to 0. Also approximates probability of finishing in-the-money. Delta hedging involves offsetting position delta to create delta-neutral portfolio.',
    example: 'A delta of 0.65 means if the stock goes up $1, the option goes up $0.65.',
    relatedTerms: ['Gamma', 'Theta', 'Vega', 'Greeks'],
    lastReviewed: '2025-09-20'
  },
  {
    term: 'Gamma',
    category: 'options',
    beginnerDefinition: 'How much delta changes when the stock price moves $1. Shows how quickly option risk changes.',
    expertDefinition: 'Second-order Greek measuring rate of change of delta with respect to underlying price. Gamma is highest for at-the-money options near expiration. Long options have positive gamma; short options have negative gamma. Critical for dynamic hedging as it measures delta instability.',
    example: 'High gamma means delta will change rapidly as stock price moves.',
    relatedTerms: ['Delta', 'Vega', 'Greeks'],
    lastReviewed: '2025-09-20'
  },
  {
    term: 'Theta',
    category: 'options',
    beginnerDefinition: 'Time decay - how much an option loses in value each day as it gets closer to expiration.',
    expertDefinition: 'Greek measuring rate of change of option value with respect to passage of time. Always negative for long options. Accelerates as expiration approaches, especially for at-the-money options. Theta decay is non-linear - increases exponentially in final weeks. Option sellers profit from positive theta.',
    example: 'Theta of -0.05 means option loses $0.05 per day from time decay.',
    relatedTerms: ['Delta', 'Time Decay', 'Expiration'],
    lastReviewed: '2025-09-20'
  },
  {
    term: 'Vega',
    category: 'options',
    beginnerDefinition: 'How much an option\'s price changes when volatility changes by 1%.',
    expertDefinition: 'Greek measuring sensitivity to changes in implied volatility. Long options have positive vega (benefit from volatility increases). Vega is highest for at-the-money options with longer time to expiration. Not a true Greek (no Greek letter nu). Critical during earnings or events.',
    example: 'Vega of 0.15 means option gains $0.15 if volatility increases 1%.',
    relatedTerms: ['Implied Volatility', 'Delta', 'Greeks'],
    lastReviewed: '2025-09-20'
  },
  {
    term: 'Rho',
    category: 'options',
    beginnerDefinition: 'How much an option\'s price changes when interest rates change by 1%.',
    expertDefinition: 'Greek measuring sensitivity to changes in risk-free interest rate. Positive for calls, negative for puts. Minimal impact for short-dated options. More significant for LEAPS and when interest rates are volatile. Least commonly monitored Greek in practice.',
    example: 'Rho of 0.05 means option gains $0.05 if interest rates rise 1%.',
    relatedTerms: ['Delta', 'Greeks', 'LEAPS'],
    lastReviewed: '2025-09-20'
  },
  {
    term: 'Strike Price',
    category: 'options',
    beginnerDefinition: 'The price at which you can buy (call) or sell (put) the stock if you exercise the option.',
    expertDefinition: 'Predetermined price at which option holder can execute the contract. Also called exercise price. Determines whether option is in-the-money, at-the-money, or out-of-the-money. Strike selection critical for defining risk/reward profile and probability of profit.',
    example: 'Call option with $100 strike gives right to buy stock at $100.',
    relatedTerms: ['Call Option', 'Put Option', 'In-the-Money'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Call Option',
    category: 'options',
    beginnerDefinition: 'A contract giving you the right (not obligation) to buy a stock at a specific price before expiration.',
    expertDefinition: 'Financial derivative granting the holder the right, but not obligation, to purchase underlying asset at strike price before or at expiration. Buyer pays premium for this right. Intrinsic value = max(0, Stock Price - Strike). Profit potential unlimited; loss limited to premium paid.',
    example: 'Buy $100 call for $5 premium. Stock at $110 at expiration = $5 profit ($10 intrinsic - $5 premium).',
    relatedTerms: ['Put Option', 'Strike Price', 'Premium'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Put Option',
    category: 'options',
    beginnerDefinition: 'A contract giving you the right (not obligation) to sell a stock at a specific price before expiration.',
    expertDefinition: 'Financial derivative granting the holder the right, but not obligation, to sell underlying asset at strike price before or at expiration. Used for downside protection or bearish speculation. Intrinsic value = max(0, Strike - Stock Price). Maximum gain = strike price; loss limited to premium.',
    example: 'Buy $100 put for $3 premium. Stock at $90 at expiration = $7 profit ($10 intrinsic - $3 premium).',
    relatedTerms: ['Call Option', 'Strike Price', 'Protective Put'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Premium',
    category: 'options',
    beginnerDefinition: 'The price you pay to buy an option contract.',
    expertDefinition: 'Price paid by option buyer to option seller for the rights conveyed by contract. Comprises intrinsic value plus time value. Determined by Black-Scholes or similar models considering: underlying price, strike, time to expiration, volatility, interest rates, dividends. Quoted per share; multiply by 100 for contract cost.',
    example: 'Premium of $2.50 means you pay $250 for one contract (100 shares).',
    relatedTerms: ['Intrinsic Value', 'Time Value', 'Extrinsic Value'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'In-the-Money',
    category: 'options',
    beginnerDefinition: 'An option with intrinsic value. Call: stock above strike. Put: stock below strike.',
    expertDefinition: 'Option with positive intrinsic value. Call ITM when underlying > strike; put ITM when underlying < strike. ITM options have higher delta (closer to 1.0 for calls, -1.0 for puts). Higher probability of expiring with value. More expensive than OTM options due to intrinsic value component.',
    example: 'Stock at $110, call with $100 strike is $10 in-the-money.',
    relatedTerms: ['Out-of-the-Money', 'At-the-Money', 'Intrinsic Value'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Out-of-the-Money',
    category: 'options',
    beginnerDefinition: 'An option with no intrinsic value. Call: stock below strike. Put: stock above strike.',
    expertDefinition: 'Option with zero intrinsic value; entire premium is time value. Call OTM when underlying < strike; put OTM when underlying > strike. Lower delta (further from 0.50). Lower cost but lower probability of profit. Used for leveraged directional bets or spreads.',
    example: 'Stock at $90, call with $100 strike is $10 out-of-the-money.',
    relatedTerms: ['In-the-Money', 'At-the-Money', 'Time Value'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Implied Volatility',
    category: 'options',
    beginnerDefinition: 'The market\'s expectation of how much a stock will move in the future. Higher IV means higher option prices.',
    expertDefinition: 'Forward-looking volatility metric derived from option prices using Black-Scholes model. Represents market consensus on future volatility. IV rank/percentile shows current IV relative to historical range. Increases before earnings/events. Mean-reverting over time. Critical for options valuation and strategy selection.',
    example: 'IV spike before earnings makes options expensive (good for selling, bad for buying).',
    relatedTerms: ['Vega', 'Volatility', 'VIX'],
    lastReviewed: '2025-09-30'
  },
  {
    term: 'Covered Call',
    category: 'options',
    beginnerDefinition: 'Owning stock and selling a call option against it. Generates income but limits upside.',
    expertDefinition: 'Income strategy where investor owns underlying stock and sells call option. Collects premium; caps upside at strike price. If called away, realizes gain up to strike plus premium collected. Best in neutral to slightly bullish outlook. Reduces cost basis by premium amount. Risk: unlimited downside minus premium.',
    example: 'Own stock at $100, sell $110 call for $2. Max gain = $12 ($10 + $2), unlimited downside.',
    relatedTerms: ['Call Option', 'Income Strategy', 'Wheel Strategy'],
    lastReviewed: '2025-09-28'
  },
  {
    term: 'Protective Put',
    category: 'options',
    beginnerDefinition: 'Buying a put option to protect stock you own from big losses. Like insurance for your position.',
    expertDefinition: 'Risk management strategy where investor owns stock and buys put option as downside protection. Put acts as insurance, establishing floor price. Cost is premium paid. Unlimited upside minus premium; downside limited to strike minus purchase price minus premium. Alternative to stop-loss orders. Delta-hedged position.',
    example: 'Own stock at $100, buy $95 put for $2. Max loss = $7 ($5 + $2 premium).',
    relatedTerms: ['Put Option', 'Risk Management', 'Hedge'],
    lastReviewed: '2025-09-28'
  },
  {
    term: 'Iron Condor',
    category: 'options',
    beginnerDefinition: 'Selling a put spread and call spread at the same time. Profits if stock stays within a range.',
    expertDefinition: 'Defined-risk, neutral strategy combining short put vertical spread and short call vertical spread. Maximum profit = net credit received. Max loss = width of wider spread minus credit. Profit zone between short strikes. Benefits from time decay and decreasing volatility. Best in low-volatility, range-bound markets.',
    example: 'Sell $95 put, buy $90 put, sell $105 call, buy $110 call. Profit if stock stays between $95-$105.',
    relatedTerms: ['Vertical Spread', 'Theta', 'Range-Bound'],
    lastReviewed: '2025-09-27'
  },

  // Risk Management (10 terms)
  {
    term: 'Stop-Loss',
    category: 'risk',
    beginnerDefinition: 'A safety line that automatically sells your stock if it drops to a certain price to limit your losses.',
    expertDefinition: 'Risk management order that executes at market when a specified price threshold is breached. Stop-limit orders provide price control but may not execute in fast markets. Trailing stops adjust dynamically with favorable price movements. Placement based on volatility (ATR), support levels, or percentage risk.',
    example: 'If you buy at $100 and set a stop-loss at $95, your position will sell if price hits $95.',
    relatedTerms: ['Safety Line', 'Risk Management', 'Position Sizing'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Position Sizing',
    category: 'risk',
    beginnerDefinition: 'Deciding how many shares to buy based on how much you\'re willing to lose.',
    expertDefinition: 'Process of determining optimal number of shares/contracts for a trade. Common methods: fixed dollar, fixed percentage, volatility-adjusted (using ATR), Kelly Criterion. Accounts for account size, risk per trade (typically 1-2%), entry price, and stop-loss distance. Critical for long-term survival and geometric growth.',
    example: 'With $10,000 account, 2% risk, $100 entry, $95 stop = 40 shares ($200 / $5 risk per share).',
    relatedTerms: ['Risk Management', 'ATR', 'Kelly Criterion'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Risk-Reward Ratio',
    category: 'risk',
    beginnerDefinition: 'Compares potential profit to potential loss. 2:1 means you could make $2 for every $1 you risk.',
    expertDefinition: 'Ratio of potential profit to potential loss in a trade. Calculated as (Target - Entry) / (Entry - Stop). Minimum acceptable ratio typically 2:1 or 3:1. Must be evaluated with win rate - lower win rate requires higher risk-reward. Not predictive - just sets parameters for trade management.',
    example: 'Entry $100, target $110, stop $95: Risk-Reward = ($110-$100) / ($100-$95) = 2:1.',
    relatedTerms: ['Stop-Loss', 'Target Price', 'Win Rate'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Drawdown',
    category: 'risk',
    beginnerDefinition: 'The decline from your account\'s peak to its lowest point. Shows how much you lost during a rough period.',
    expertDefinition: 'Peak-to-trough decline in account equity during specific period. Maximum drawdown = largest historical peak-to-trough decline. Drawdown percentage = (Peak - Trough) / Peak × 100. Recovery time critical metric. Understanding drawdown tolerance essential for position sizing and strategy selection. Exponential to recover (50% loss requires 100% gain).',
    example: 'Account peaks at $100K, drops to $80K = 20% drawdown. Needs 25% gain to recover.',
    relatedTerms: ['Risk Management', 'Recovery Factor', 'Max Drawdown'],
    lastReviewed: '2025-09-29'
  },
  {
    term: 'Diversification',
    category: 'risk',
    beginnerDefinition: 'Spreading your money across different investments to reduce risk. Don\'t put all eggs in one basket.',
    expertDefinition: 'Risk reduction through allocation across uncorrelated or low-correlated assets. Modern Portfolio Theory shows diversification can reduce portfolio variance without reducing expected return. Optimal number of stocks: 15-30 for individual investors. Over-diversification ("diworsification") dilutes returns. Sector, geography, asset class, and time diversification all relevant.',
    example: 'Holding tech, healthcare, and energy stocks reduces sector-specific risk.',
    relatedTerms: ['Correlation', 'Portfolio Theory', 'Allocation'],
    lastReviewed: '2025-09-26'
  },
  {
    term: 'Correlation',
    category: 'risk',
    beginnerDefinition: 'How closely two investments move together. Positive correlation means they move in same direction.',
    expertDefinition: 'Statistical measure of how two securities move relative to each other. Range: -1 (perfect inverse) to +1 (perfect positive). Near 0 = uncorrelated. Pearson correlation most common. Changes over time, especially during crises (correlations tend to 1). Critical for portfolio construction and hedging.',
    example: 'Stocks and bonds often have low/negative correlation, providing diversification.',
    relatedTerms: ['Diversification', 'Beta', 'Hedging'],
    lastReviewed: '2025-09-25'
  },
  {
    term: 'Beta',
    category: 'risk',
    beginnerDefinition: 'Measures how much a stock moves compared to the overall market. Beta of 1.5 means it moves 50% more than the market.',
    expertDefinition: 'Measure of systematic risk (market risk) in CAPM. Beta = Covariance(Stock, Market) / Variance(Market). Beta > 1: more volatile than market. Beta < 1: less volatile. Beta = 1: moves with market. Used in portfolio risk assessment and expected return calculation (CAPM). Regression-based over 3-5 years typical.',
    example: 'Stock with beta of 1.2 typically gains 12% when market gains 10%.',
    relatedTerms: ['Systematic Risk', 'CAPM', 'Volatility'],
    lastReviewed: '2025-09-24'
  },
  {
    term: 'Sharpe Ratio',
    category: 'risk',
    beginnerDefinition: 'Measures return per unit of risk. Higher Sharpe ratio means better risk-adjusted returns.',
    expertDefinition: 'Risk-adjusted performance metric. Sharpe = (Return - Risk-Free Rate) / Standard Deviation. Measures excess return per unit of total risk. > 1 good, > 2 very good, > 3 excellent. Assumes normal distribution (fails in fat-tailed distributions). Compare strategies or managers. Sortino ratio uses downside deviation only.',
    example: 'Strategy returning 15% with 10% volatility, 2% risk-free rate: Sharpe = (15-2)/10 = 1.3.',
    relatedTerms: ['Risk-Adjusted Return', 'Sortino Ratio', 'Standard Deviation'],
    lastReviewed: '2025-09-23'
  },
  {
    term: 'Maximum Adverse Excursion',
    category: 'risk',
    beginnerDefinition: 'The worst loss a position showed before it hit your stop or target. Helps optimize stop placement.',
    expertDefinition: 'Largest unrealized loss experienced during a trade\'s life. MAE analysis plots MAE vs. final P&L to optimize stop-loss placement. Shows whether trades that eventually win experience deep drawdowns. Helps distinguish between noise and fatal moves. Paired with MFE (Maximum Favorable Excursion) for complete picture.',
    example: 'Entry at $100, dips to $97, closes at $105. MAE = $3.',
    relatedTerms: ['Stop-Loss', 'Trade Analysis', 'MFE'],
    lastReviewed: '2025-09-22'
  },
  {
    term: 'Kelly Criterion',
    category: 'risk',
    beginnerDefinition: 'A formula to calculate optimal position size based on win rate and average win/loss. Helps maximize long-term growth.',
    expertDefinition: 'Position sizing formula maximizing logarithmic wealth growth. Kelly % = (Win% × Avg Win - Loss% × Avg Loss) / Avg Win. Assumes known probabilities and infinite bankroll. Aggressive - most use fractional Kelly (1/4 or 1/2). Optimal for geometric growth but high variance. Incorrect probabilities lead to overbetting and ruin.',
    example: '60% win rate, $200 avg win, $100 avg loss: Kelly = (0.6×200 - 0.4×100)/200 = 40% (use 10-20%).',
    relatedTerms: ['Position Sizing', 'Risk Management', 'Geometric Growth'],
    lastReviewed: '2025-09-21'
  },

  // Fundamental Analysis (8 terms)
  {
    term: 'P/E Ratio',
    category: 'fundamental',
    beginnerDefinition: 'Price-to-Earnings ratio. Shows how much you pay for each dollar of earnings. Higher P/E might mean stock is expensive.',
    expertDefinition: 'Valuation ratio calculated as Market Price per Share / Earnings per Share. Forward P/E uses estimated future earnings. Trailing P/E uses last 12 months. Sector-dependent (tech typically higher than utilities). PEG ratio (P/E / Growth Rate) adjusts for growth. Not useful for unprofitable companies.',
    example: 'Stock at $100 with $5 EPS has P/E of 20 (paying $20 for every $1 of earnings).',
    relatedTerms: ['EPS', 'PEG Ratio', 'Valuation'],
    lastReviewed: '2025-09-18'
  },
  {
    term: 'EPS',
    category: 'fundamental',
    beginnerDefinition: 'Earnings Per Share - How much profit a company makes per share. Higher is generally better.',
    expertDefinition: 'Net Income / Weighted Average Shares Outstanding. Diluted EPS accounts for potential share dilution from options, convertibles. Reported quarterly and annually. Quality matters - look for sustainable, cash-backed earnings. Non-GAAP vs. GAAP EPS can differ significantly. Used in P/E ratio calculation.',
    example: 'Company with $10M profit and 1M shares has EPS of $10.',
    relatedTerms: ['P/E Ratio', 'Net Income', 'Diluted Shares'],
    lastReviewed: '2025-09-18'
  },
  {
    term: 'Market Cap',
    category: 'fundamental',
    beginnerDefinition: 'Market Capitalization - The total value of all a company\'s shares. Calculated as share price × total shares.',
    expertDefinition: 'Current Share Price × Total Shares Outstanding. Categories: Mega ($200B+), Large ($10-200B), Mid ($2-10B), Small ($300M-2B), Micro (<$300M). Not enterprise value (which includes debt, cash). Flawed for companies with dual share classes. Changes with stock price, buybacks, issuances.',
    example: 'Stock at $50 with 100M shares outstanding = $5B market cap (large cap).',
    relatedTerms: ['Enterprise Value', 'Share Price', 'Outstanding Shares'],
    lastReviewed: '2025-09-17'
  },
  {
    term: 'Dividend Yield',
    category: 'fundamental',
    beginnerDefinition: 'The annual dividend payment divided by stock price, shown as a percentage. Measures income from dividends.',
    expertDefinition: 'Annual Dividends Per Share / Current Stock Price × 100. Forward yield uses expected dividends. Yield increases when price falls (potential value trap). Sustainability measured by payout ratio. REITs and utilities typically high yield. Growth stocks typically low/no yield. Tax treatment varies by account type.',
    example: 'Stock at $100 paying $4 annual dividend has 4% yield.',
    relatedTerms: ['Dividend', 'Payout Ratio', 'Total Return'],
    lastReviewed: '2025-09-16'
  },
  {
    term: 'Revenue',
    category: 'fundamental',
    beginnerDefinition: 'Total money a company brings in from sales before any expenses. Also called "top line."',
    expertDefinition: 'Total income from sales of goods/services before deductions. Revenue recognition timing critical (subscription vs. one-time, accrual vs. cash). Revenue growth rate key metric for growth stocks. Quality matters - sustainable, recurring revenue preferred. Not same as cash flow. Revenue per employee measures efficiency.',
    example: 'SaaS company with 1,000 customers at $100/month = $1.2M annual revenue.',
    relatedTerms: ['Profit', 'Revenue Growth', 'Gross Margin'],
    lastReviewed: '2025-09-15'
  },
  {
    term: 'EBITDA',
    category: 'fundamental',
    beginnerDefinition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. Shows operating profitability.',
    expertDefinition: 'Operating performance metric = Net Income + Interest + Taxes + Depreciation + Amortization. Removes capital structure and accounting policy effects. Used in valuation (EV/EBITDA). Not GAAP metric. Can be manipulated. Doesn\'t reflect capex needs. Better for comparing companies in same industry.',
    example: 'Company with $100M revenue, $80M expenses, $5M D&A, $3M interest, $2M tax: EBITDA = $20M.',
    relatedTerms: ['Operating Income', 'Enterprise Value', 'Cash Flow'],
    lastReviewed: '2025-09-14'
  },
  {
    term: 'Free Cash Flow',
    category: 'fundamental',
    beginnerDefinition: 'Cash a company generates after spending on operations and assets. Available for dividends, buybacks, or growth.',
    expertDefinition: 'Operating Cash Flow - Capital Expenditures. Measures cash available to investors after maintaining/growing asset base. More reliable than earnings (harder to manipulate). Negative FCF acceptable for growth companies investing heavily. FCF yield = FCF / Market Cap. Used in DCF valuation models.',
    example: 'Company with $50M operating cash flow and $20M capex has $30M free cash flow.',
    relatedTerms: ['Cash Flow', 'Operating Cash Flow', 'DCF'],
    lastReviewed: '2025-09-13'
  },
  {
    term: 'Book Value',
    category: 'fundamental',
    beginnerDefinition: 'The value of a company\'s assets minus its liabilities. Also called "net asset value" or "shareholders\' equity."',
    expertDefinition: 'Total Assets - Total Liabilities = Shareholders\' Equity. Book value per share = Equity / Shares Outstanding. Price-to-Book ratio compares market price to book value. Tangible book value excludes intangibles/goodwill. More relevant for asset-heavy businesses (banks, industrials) than asset-light (software). Historical cost basis limits usefulness.',
    example: 'Company with $500M assets, $300M liabilities has $200M book value.',
    relatedTerms: ['P/B Ratio', 'Assets', 'Shareholders\' Equity'],
    lastReviewed: '2025-09-12'
  },

  // General Trading Terms (7 terms)
  {
    term: 'Liquidity',
    category: 'general',
    beginnerDefinition: 'How easy it is to buy or sell a stock without affecting its price. High liquidity means easier to trade.',
    expertDefinition: 'Ability to execute trades quickly at stable prices. Measured by volume, bid-ask spread, market depth. High liquidity = tight spreads, minimal slippage. Illiquid securities show wide spreads, price impact. Varies by time of day (market open/close most liquid). Critical for large positions and options trading.',
    example: 'Apple stock is highly liquid - you can instantly trade millions of shares with minimal price impact.',
    relatedTerms: ['Bid-Ask Spread', 'Volume', 'Slippage'],
    lastReviewed: '2025-10-02'
  },
  {
    term: 'Bid-Ask Spread',
    category: 'general',
    beginnerDefinition: 'The difference between the highest price buyers will pay (bid) and lowest price sellers will accept (ask).',
    expertDefinition: 'Difference between best bid and best ask price. Represents cost of immediate execution and market maker profit. Spread = Ask - Bid. Percentage spread = (Ask - Bid) / Midpoint × 100. Tighter spreads in liquid markets. Widens in volatile or illiquid conditions. Half the spread is typical cost per round trip.',
    example: 'Stock bid $99.95, ask $100.05, spread = $0.10 (0.1%).',
    relatedTerms: ['Liquidity', 'Market Maker', 'Slippage'],
    lastReviewed: '2025-10-02'
  },
  {
    term: 'Slippage',
    category: 'general',
    beginnerDefinition: 'The difference between your expected trade price and the actual executed price.',
    expertDefinition: 'Price degradation between order placement and execution. Caused by market movement, low liquidity, large order size. Positive slippage = better than expected; negative = worse. Impact cost measures slippage for large orders. Minimized through limit orders, algorithmic execution, trading during liquid hours. Backtesting must account for realistic slippage.',
    example: 'Market order at $100 midpoint, filled at $100.10 = $0.10 negative slippage.',
    relatedTerms: ['Liquidity', 'Market Order', 'Execution'],
    lastReviewed: '2025-10-02'
  },
  {
    term: 'Market Order',
    category: 'general',
    beginnerDefinition: 'An order to buy or sell immediately at the best available price. Guarantees execution but not price.',
    expertDefinition: 'Order type prioritizing execution speed over price. Fills at current best available price(s). No price protection - subject to slippage in fast markets. Appropriate for liquid stocks with tight spreads. Can walk through multiple price levels for large orders. Executes against limit orders in order book.',
    example: 'Market buy order fills at current ask price(s) available.',
    relatedTerms: ['Limit Order', 'Slippage', 'Liquidity'],
    lastReviewed: '2025-10-02'
  },
  {
    term: 'Limit Order',
    category: 'general',
    beginnerDefinition: 'An order to buy or sell at a specific price or better. Guarantees price but not execution.',
    expertDefinition: 'Order type specifying maximum buy price or minimum sell price. Joins order book at limit price. Executes only at limit price or better. No price slippage but execution not guaranteed. Requires patience - may sit unfilled. Good-til-canceled (GTC) or day orders. Can be used to provide liquidity and capture spread.',
    example: 'Buy limit at $99 means you\'ll only buy at $99 or lower.',
    relatedTerms: ['Market Order', 'Order Book', 'Fill'],
    lastReviewed: '2025-10-02'
  },
  {
    term: 'Short Selling',
    category: 'general',
    beginnerDefinition: 'Borrowing shares to sell them, hoping to buy them back cheaper later. Profits from price declines.',
    expertDefinition: 'Selling borrowed securities with obligation to return them. Mechanics: broker borrows shares, you sell at current price, later buy to cover and return shares. Profit = Sell Price - Buy Price - Borrowing Costs. Unlimited loss potential. Requires margin account. Short squeeze risk when heavily shorted stock rallies. Borrow fees vary by availability.',
    example: 'Short at $100, cover at $80 = $20 profit per share (minus fees).',
    relatedTerms: ['Margin', 'Short Squeeze', 'Borrow Fee'],
    lastReviewed: '2025-10-01'
  },
  {
    term: 'Margin',
    category: 'general',
    beginnerDefinition: 'Borrowing money from your broker to trade. Amplifies both gains and losses.',
    expertDefinition: 'Using borrowed funds to increase position size (leverage). Reg T allows 2:1 initial leverage (50% margin requirement). Portfolio margin allows higher leverage based on risk. Margin interest charged on borrowed amount. Minimum maintenance margin (typically 25-30%). Margin call when equity falls below maintenance. Forced liquidation possible.',
    example: 'With $10,000 cash and 2:1 margin, you can buy $20,000 worth of stock.',
    relatedTerms: ['Leverage', 'Margin Call', 'Maintenance Margin'],
    lastReviewed: '2025-10-01'
  },
]

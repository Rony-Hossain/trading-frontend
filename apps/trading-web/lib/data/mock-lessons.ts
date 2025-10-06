/**
 * Shared mock lesson data
 * Phase 7: Learn Hub & Micro-Lessons
 * Central source of truth for mock data used across Learn Hub and Lesson Viewer
 */

import type { Lesson, LearningPath, LessonProgress, RecommendedLesson } from '@/lib/types/contracts'

export const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    slug: 'what-is-a-stock',
    title: 'What is a Stock?',
    description: 'Learn the basics of stock ownership and how the stock market works',
    category: 'basics',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    prerequisites: [],
    blocks: [
      {
        type: 'text',
        content: '# What is a Stock?\n\nA stock represents ownership in a company. When you buy a stock, you become a shareholder and own a small piece of that company.'
      },
      {
        type: 'text',
        content: '## Why Own Stocks?\n\nStocks can provide returns through:\n- Price appreciation (capital gains)\n- Dividends (income payments)\n- Voting rights in company decisions'
      },
      {
        type: 'text',
        content: '## How Stocks Work\n\nCompanies issue stocks to raise capital. Investors buy these stocks on exchanges like NYSE or NASDAQ. The price fluctuates based on supply and demand.'
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does owning a stock represent?',
        options: ['Ownership in a company', 'A loan to a company', 'A commodity', 'A currency'],
        correctAnswer: 0,
        explanation: 'A stock represents partial ownership (equity) in a company.',
      },
      {
        id: 'q2',
        question: 'What are the two main ways stocks can provide returns?',
        options: ['Price appreciation and dividends', 'Interest and fees', 'Rent and royalties', 'Taxes and credits'],
        correctAnswer: 0,
        explanation: 'Stocks provide returns through price appreciation (capital gains) and dividends (income payments).',
      },
    ],
    tags: ['stocks', 'fundamentals', 'ownership'],
    author: 'Trading Platform Team',
    publishedAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    version: 1,
  },
  {
    id: '2',
    slug: 'understanding-rsi',
    title: 'Understanding RSI',
    description: 'Master the Relative Strength Index indicator for identifying overbought and oversold conditions',
    category: 'technical',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    prerequisites: ['1'],
    blocks: [
      {
        type: 'text',
        content: '# RSI Indicator\n\nThe Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of price changes.'
      },
      {
        type: 'text',
        content: '## How RSI Works\n\nRSI ranges from 0 to 100:\n- Above 70: Overbought (potential sell signal)\n- Below 30: Oversold (potential buy signal)\n- 50: Neutral'
      },
      {
        type: 'text',
        content: '## Using RSI in Trading\n\nTraders use RSI to:\n- Identify reversal points\n- Confirm trend strength\n- Spot divergences between price and momentum'
      },
    ],
    quiz: [
      {
        id: 'q1-rsi',
        question: 'What does an RSI reading above 70 typically indicate?',
        options: ['Overbought conditions', 'Oversold conditions', 'Neutral market', 'Strong downtrend'],
        correctAnswer: 0,
        explanation: 'RSI above 70 indicates overbought conditions, suggesting a potential price reversal downward.',
      },
    ],
    tags: ['rsi', 'indicators', 'technical-analysis'],
    author: 'Trading Platform Team',
    publishedAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    version: 1,
  },
  {
    id: '3',
    slug: 'risk-management-basics',
    title: 'Risk Management Basics',
    description: 'Learn how to protect your capital with proper position sizing and stop-losses',
    category: 'risk',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    prerequisites: [],
    blocks: [
      {
        type: 'text',
        content: '# Risk Management\n\nRisk management is the most important skill in trading. Never risk more than you can afford to lose.'
      },
      {
        type: 'text',
        content: '## Position Sizing\n\nNever risk more than 1-2% of your account on a single trade. This ensures you can survive a losing streak.'
      },
      {
        type: 'text',
        content: '## Stop Losses\n\nAlways use stop losses to limit downside:\n- Technical stops (below support)\n- Percentage stops (5-10% below entry)\n- ATR-based stops (based on volatility)'
      },
    ],
    quiz: [
      {
        id: 'q1-risk',
        question: 'What is the recommended maximum risk per trade?',
        options: ['1-2% of account', '5-10% of account', '20% of account', 'All available capital'],
        correctAnswer: 0,
        explanation: 'Risk management experts recommend risking no more than 1-2% of your account on any single trade.',
      },
    ],
    tags: ['risk', 'stop-loss', 'position-sizing'],
    author: 'Trading Platform Team',
    publishedAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
    version: 1,
  },
]

export const MOCK_PATHS: LearningPath[] = [
  {
    id: 'p1',
    slug: 'beginner-fundamentals',
    title: 'Trading Fundamentals',
    description: 'Start your trading journey with the essential basics',
    lessons: ['1', '3'],
    difficulty: 'beginner',
    estimatedHours: 1,
    tags: ['beginner', 'fundamentals'],
  },
  {
    id: 'p2',
    slug: 'technical-analysis-mastery',
    title: 'Technical Analysis Mastery',
    description: 'Deep dive into technical indicators and chart patterns',
    lessons: ['1', '2'],
    difficulty: 'intermediate',
    estimatedHours: 3,
    tags: ['technical', 'intermediate'],
  },
]

export const MOCK_PROGRESS: LessonProgress[] = [
  {
    lessonId: '2',
    userId: 'user-1',
    status: 'in_progress',
    currentBlockIndex: 1,
    startedAt: '2025-10-03T10:00:00Z',
    timeSpentSeconds: 180,
  },
  {
    lessonId: '1',
    userId: 'user-1',
    status: 'completed',
    currentBlockIndex: 3,
    quizScore: 100,
    startedAt: '2025-10-02T14:00:00Z',
    completedAt: '2025-10-02T14:10:00Z',
    timeSpentSeconds: 300,
  },
]

export function getMockRecommended(): RecommendedLesson[] {
  return [
    {
      lesson: MOCK_LESSONS[2],
      reason: 'Build on your risk knowledge',
      relevanceScore: 0.9,
    },
  ]
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return MOCK_LESSONS.find(lesson => lesson.slug === slug)
}

export function getLessonById(id: string): Lesson | undefined {
  return MOCK_LESSONS.find(lesson => lesson.id === id)
}

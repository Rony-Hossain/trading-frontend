'use client'

import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'
import type { Lesson, LessonProgress } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface ContinueBannerProps {
  progress: LessonProgress
  lesson?: Lesson
}

export function ContinueBanner({ progress, lesson }: ContinueBannerProps) {
  const router = useRouter()

  if (!lesson) return null

  const progressPercent = Math.round((progress.currentBlockIndex / lesson.blocks.length) * 100)

  const handleClick = () => {
    trackEvent({
      category: TelemetryCategory.LEARN,
      action: 'continue_lesson_clicked',
      lesson_id: lesson.id,
    })
    router.push(`/learn/${lesson.slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 mb-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium opacity-90">Continue where you left off</p>
          <h3 className="text-lg font-semibold">{lesson.title}</h3>
          <div className="mt-2 w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-white"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{progressPercent}%</p>
          <p className="text-xs opacity-90">complete</p>
        </div>
      </div>
    </button>
  )
}

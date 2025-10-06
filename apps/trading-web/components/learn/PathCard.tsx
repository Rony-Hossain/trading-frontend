'use client'

import { useRouter } from 'next/navigation'
import { Map, Clock, CheckCircle } from 'lucide-react'
import type { LearningPath, LessonProgress } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface PathCardProps {
  path: LearningPath
  userProgress: LessonProgress[]
}

export function PathCard({ path, userProgress }: PathCardProps) {
  const router = useRouter()

  const completedLessons = path.lessons.filter(lessonId =>
    userProgress.find(p => p.lessonId === lessonId && p.status === 'completed')
  ).length

  const progressPercent = Math.round((completedLessons / path.lessons.length) * 100)

  const handleClick = () => {
    trackEvent({
      category: TelemetryCategory.LEARN,
      action: 'path_started',
      path_id: path.id,
      path_title: path.title,
    })
    router.push(`/learn/paths/${path.slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Map className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {path.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {path.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {path.estimatedHours}h
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {completedLessons}/{path.lessons.length} lessons
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  )
}

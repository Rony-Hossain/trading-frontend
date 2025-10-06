'use client'

/**
 * LessonCard - Individual lesson card component
 * Phase 7: Learn Hub & Micro-Lessons
 */

import { useRouter } from 'next/navigation'
import { Clock, Award, CheckCircle, Play, Circle, Star } from 'lucide-react'
import type { Lesson, LessonProgress } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface LessonCardProps {
  lesson: Lesson
  progress?: LessonProgress
  recommended?: string // Reason why recommended
}

export function LessonCard({ lesson, progress, recommended }: LessonCardProps) {
  const router = useRouter()

  const getDifficultyColor = () => {
    switch (lesson.difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    }
  }

  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      basics: 'Basics',
      technical: 'Technical',
      fundamental: 'Fundamental',
      risk: 'Risk',
      psychology: 'Psychology',
      platform: 'Platform',
      strategy: 'Strategy',
    }
    return labels[lesson.category] || lesson.category
  }

  const getProgressIcon = () => {
    if (!progress || progress.status === 'not_started') {
      return <Circle className="h-5 w-5 text-gray-400" />
    }
    if (progress.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    return <Play className="h-5 w-5 text-blue-600" />
  }

  const getProgressText = () => {
    if (!progress || progress.status === 'not_started') {
      return 'Not started'
    }
    if (progress.status === 'completed') {
      return 'Completed'
    }
    const percent = Math.round((progress.currentBlockIndex / lesson.blocks.length) * 100)
    return `${percent}% complete`
  }

  const handleClick = () => {
    if (progress?.status === 'in_progress') {
      trackEvent({
        category: TelemetryCategory.LEARN,
        action: 'continue_lesson_clicked',
        lesson_id: lesson.id,
      })
    } else if (recommended) {
      trackEvent({
        category: TelemetryCategory.LEARN,
        action: 'recommended_lesson_clicked',
        lesson_id: lesson.id,
        reason: recommended,
      })
    } else {
      trackEvent({
        category: TelemetryCategory.LEARN,
        action: 'lesson_started',
        lesson_id: lesson.id,
        lesson_title: lesson.title,
        difficulty: lesson.difficulty,
        category: lesson.category,
      })
    }
    router.push(`/learn/${lesson.slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
    >
      {/* Recommended badge */}
      {recommended && (
        <div className="flex items-center gap-1 mb-2 text-xs text-amber-600 dark:text-amber-400">
          <Star className="h-3 w-3" />
          <span>Recommended: {recommended}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {lesson.title}
          </h3>
        </div>
        {getProgressIcon()}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {lesson.description}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor()}`}>
          {lesson.difficulty}
        </span>
        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
          {getCategoryLabel()}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {lesson.estimatedMinutes} min
        </div>
        {lesson.quiz && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Award className="h-3 w-3" />
            Quiz
          </div>
        )}
      </div>

      {/* Progress */}
      {progress && progress.status !== 'not_started' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {getProgressText()}
            </span>
            {progress.quizScore !== undefined && (
              <span className="text-xs font-medium text-green-600">
                Quiz: {progress.quizScore}%
              </span>
            )}
          </div>
          {progress.status === 'in_progress' && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-blue-600"
                style={{
                  width: `${(progress.currentBlockIndex / lesson.blocks.length) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </button>
  )
}

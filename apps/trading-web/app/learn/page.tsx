'use client'

/**
 * Learn Hub - Main catalog page
 * Phase 7: Learn Hub & Micro-Lessons
 */

import { useState, useEffect } from 'react'
import { Search, Book, Clock, Award, Play, CheckCircle, Circle } from 'lucide-react'
import type { Lesson, LearningPath, LessonProgress, RecommendedLesson } from '@/lib/types/contracts'
import { useUserStore } from '../../lib/stores/userStore'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'
import { LessonCard } from '@/components/learn/LessonCard'
import { PathCard } from '@/components/learn/PathCard'
import { ContinueBanner } from '@/components/learn/ContinueBanner'
import { GlossarySearch } from '@/components/learn/GlossarySearch'
import { MOCK_LESSONS, MOCK_PATHS, MOCK_PROGRESS, getMockRecommended } from '@/lib/data/mock-lessons'
import ModuleGuard from '@/components/security/ModuleGuard'

export default function LearnHubPage() {
  const { preferences } = useUserStore()
  const mode = preferences.dashboardMode || 'beginner'

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [userProgress, setUserProgress] = useState<LessonProgress[]>([])
  const [recommended, setRecommended] = useState<RecommendedLesson[]>([])
  const [continueLesson, setContinueLesson] = useState<LessonProgress | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchLearnHub = async () => {
      setIsLoading(true)
      try {
        // Use shared mock data
        const mockLessons = MOCK_LESSONS
        const mockPaths = MOCK_PATHS
        const mockProgress = MOCK_PROGRESS
        const mockRecommended = getMockRecommended()
        const mockContinue = mockProgress.find(p => p.status === 'in_progress')

        setLessons(mockLessons)
        setPaths(mockPaths)
        setUserProgress(mockProgress)
        setRecommended(mockRecommended)
        setContinueLesson(mockContinue || null)

        trackEvent({
          category: TelemetryCategory.LEARN,
          action: 'hub_viewed',
          lesson_count: mockLessons.length,
          mode,
        })
      } catch (error) {
        console.error('Failed to load learn hub:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLearnHub()
  }, [mode])

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return userProgress.find(p => p.lessonId === lessonId)
  }

  const getProgressIcon = (lessonId: string) => {
    const progress = getLessonProgress(lessonId)
    if (!progress || progress.status === 'not_started') {
      return <Circle className="h-5 w-5 text-gray-400" />
    }
    if (progress.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    return <Play className="h-5 w-5 text-blue-600" />
  }

  return (
    <ModuleGuard moduleId="learn" mode={mode}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Learn Hub
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'beginner'
              ? 'Master trading concepts at your own pace'
              : 'Advanced trading education and strategy development'}
          </p>
        </div>

        {/* Continue Banner */}
        {continueLesson && (
          <ContinueBanner
            progress={continueLesson}
            lesson={lessons.find(l => l.id === continueLesson.lessonId)}
          />
        )}

        {/* Glossary Search */}
        <GlossarySearch />

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="basics">Basics</option>
              <option value="technical">Technical Analysis</option>
              <option value="fundamental">Fundamental Analysis</option>
              <option value="risk">Risk Management</option>
              <option value="psychology">Trading Psychology</option>
              <option value="platform">Platform Features</option>
              <option value="strategy">Strategies</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Recommended Lessons */}
        {recommended.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.slice(0, 3).map((rec) => (
                <LessonCard
                  key={rec.lesson.id}
                  lesson={rec.lesson}
                  progress={getLessonProgress(rec.lesson.id)}
                  recommended={rec.reason}
                />
              ))}
            </div>
          </div>
        )}

        {/* Learning Paths */}
        {paths.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Learning Paths
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paths.map((path) => (
                <PathCard key={path.id} path={path} userProgress={userProgress} />
              ))}
            </div>
          </div>
        )}

        {/* All Lessons */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            All Lessons ({filteredLessons.length})
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading lessons...</p>
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No lessons found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={getLessonProgress(lesson.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ModuleGuard>
  )
}

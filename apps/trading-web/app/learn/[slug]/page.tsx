'use client'

/**
 * Lesson Viewer - Individual lesson page with blocks and quiz
 * Phase 7: Learn Hub & Micro-Lessons
 */

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import type { Lesson } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'
import { getLessonBySlug } from '@/lib/data/mock-lessons'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [startTime] = useState(Date.now())
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  useEffect(() => {
    const slug = params.slug as string
    const foundLesson = getLessonBySlug(slug)

    if (foundLesson) {
      setLesson(foundLesson)

      trackEvent({
        category: TelemetryCategory.LEARN,
        action: 'lesson_started',
        lesson_id: foundLesson.id,
        lesson_title: foundLesson.title,
        difficulty: foundLesson.difficulty,
        category: foundLesson.category,
      })
    } else {
      // Lesson not found, redirect back to hub
      router.push('/learn')
    }
  }, [params.slug, router])

  useEffect(() => {
    if (lesson && currentBlockIndex >= 0) {
      const block = lesson.blocks[currentBlockIndex]
      trackEvent({
        category: TelemetryCategory.LEARN,
        action: 'lesson_block_viewed',
        lesson_id: lesson.id,
        block_index: currentBlockIndex,
        block_type: block?.type || 'unknown',
      })
    }
  }, [currentBlockIndex, lesson])

  const handleQuizAnswer = (questionId: string, answerIndex: number, correctAnswer: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })

    trackEvent({
      category: TelemetryCategory.LEARN,
      action: 'quiz_answered',
      lesson_id: lesson!.id,
      question_id: questionId,
      correct: answerIndex === correctAnswer,
    })
  }

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const quizScore = lesson?.quiz
      ? Math.round((Object.values(quizAnswers).filter((ans, idx) =>
          ans === lesson.quiz![idx].correctAnswer
        ).length / lesson.quiz.length) * 100)
      : undefined

    trackEvent({
      category: TelemetryCategory.LEARN,
      action: 'lesson_completed',
      lesson_id: lesson!.id,
      time_spent_seconds: timeSpent,
      quiz_score: quizScore,
    })

    router.push('/learn')
  }

  if (!lesson) return <div>Loading...</div>

  const currentBlock = lesson.blocks[currentBlockIndex]
  const isLastBlock = currentBlockIndex === lesson.blocks.length - 1
  const hasQuiz = lesson.quiz && lesson.quiz.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.push('/learn')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Learn Hub
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {lesson.title}
          </h1>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${((currentBlockIndex + 1) / lesson.blocks.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentBlockIndex + 1} / {lesson.blocks.length}
            </span>
          </div>

          {/* Current Block */}
          {currentBlock && currentBlock.type === 'text' && (
            <div className="prose dark:prose-invert max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: currentBlock.content.replace(/\n/g, '<br />') }} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={() => setCurrentBlockIndex(Math.max(0, currentBlockIndex - 1))}
              disabled={currentBlockIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {!isLastBlock ? (
              <button
                onClick={() => setCurrentBlockIndex(currentBlockIndex + 1)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : hasQuiz ? (
              <button
                onClick={() => setShowQuizResults(true)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Take Quiz
                <CheckCircle className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Lesson
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quiz Section */}
        {hasQuiz && showQuizResults && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quiz</h2>
            {lesson.quiz!.map((question, qIdx) => (
              <div key={question.id} className="mb-6">
                <p className="font-semibold text-gray-900 dark:text-white mb-3">
                  {qIdx + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleQuizAnswer(question.id, oIdx, question.correctAnswer)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        quizAnswers[question.id] === oIdx
                          ? oIdx === question.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {quizAnswers[question.id] !== undefined && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {question.explanation}
                  </p>
                )}
              </div>
            ))}
            <button
              onClick={handleComplete}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Complete Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

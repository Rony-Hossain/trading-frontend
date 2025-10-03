/**
 * RouteProgressBar - Top loading indicator for route transitions
 */

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { LinearProgress, Box } from '@mui/material'

export function RouteProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      <LinearProgress />
    </Box>
  )
}

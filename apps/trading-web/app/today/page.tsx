/**
 * Today Page - Today's trading plan
 * Main view for beginner mode
 */

'use client'

import { Container, Typography, Box, Alert } from '@mui/material'
import { PlanList } from '@/components/today/PlanList'
import { EnforcementBadgeGroup } from '@/components/badges/EnforcementBadge'
import { useBeginnerDefaults } from '@/lib/hooks/useBeginnerDefaults'
import { getCopy } from '@/lib/copy/copy-service'

export default function TodayPage() {
  const { data: defaultsData } = useBeginnerDefaults()
  const mode = defaultsData?.mode || 'beginner'

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          {getCopy('plan.title', mode)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered recommendations tailored to your risk profile
        </Typography>
      </Box>

      {/* Show enforcement badges for beginner mode */}
      {defaultsData && defaultsData.mode === 'beginner' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Safety Features Active
            </Typography>
          </Box>
          <EnforcementBadgeGroup defaults={defaultsData.defaults} mode={mode} size="small" />
        </Alert>
      )}

      <PlanList />
    </Container>
  )
}

/**
 * ExplainPopover - Popover with term explanation
 */

'use client'

import { Popover, Box, Typography, CircularProgress, Divider, Chip } from '@mui/material'
import { useExplainEntry } from '@/lib/hooks/useExplainEntry'

interface ExplainPopoverProps {
  term: string
  mode: 'beginner' | 'expert'
  anchorEl: HTMLElement | null
  onClose: () => void
}

export function ExplainPopover({ term, mode, anchorEl, onClose }: ExplainPopoverProps) {
  const { data, isLoading } = useExplainEntry(term)

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: { maxWidth: 400, p: 2 },
      }}
    >
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {data && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {data.term}
          </Typography>

          <Typography variant="body2" paragraph>
            {data.plain}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            How we use it:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {data.how_we_use}
          </Typography>

          {mode === 'expert' && data.math && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Formula:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: 'action.hover',
                  p: 1,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                {data.math.formula}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Example: {data.math.example}
              </Typography>
            </>
          )}

          {data.related_terms && data.related_terms.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Related terms:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {data.related_terms.map((relatedTerm) => (
                  <Chip key={relatedTerm} label={relatedTerm} size="small" variant="outlined" />
                ))}
              </Box>
            </>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 2, textAlign: 'right' }}
          >
            Last reviewed: {data.last_reviewed}
          </Typography>
        </Box>
      )}
    </Popover>
  )
}

/**
 * ExplainChip - Inline glossary term explanation
 */

'use client'

import { IconButton, Tooltip } from '@mui/material'
import { HelpOutlineOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { ExplainPopover } from './ExplainPopover'

interface ExplainChipProps {
  term: string
  mode: 'beginner' | 'expert'
}

export function ExplainChip({ term, mode }: ExplainChipProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    // TODO: Emit telemetry event (tooltip_opened)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title={`Explain: ${term}`} arrow>
        <IconButton
          size="small"
          onClick={handleClick}
          aria-label={`Explain ${term}`}
          sx={{ ml: 0.5, p: 0.25 }}
        >
          <HelpOutlineOutlined sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <ExplainPopover
        term={term}
        mode={mode}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  )
}

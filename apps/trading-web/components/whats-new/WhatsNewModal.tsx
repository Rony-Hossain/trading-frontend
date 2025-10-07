'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material'
import { Sparkles, Rocket, CheckCircle2 } from 'lucide-react'
import type { WhatsNewEntry } from '@/lib/content/whats-new'

interface WhatsNewModalProps {
  open: boolean
  entry: WhatsNewEntry
  onClose: () => void
}

export function WhatsNewModal({ open, entry, onClose }: WhatsNewModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Sparkles size={20} />
        <span>What&apos;s new • v{entry.version}</span>
        <Chip
          label={new Date(entry.date).toLocaleDateString()}
          size="small"
          color="primary"
          sx={{ ml: 'auto' }}
        />
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Highlights from the latest launch and iteration cycle.
          </Typography>

          <List dense>
            {entry.highlights.map((highlight, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {index === 0 ? <Rocket size={18} /> : <CheckCircle2 size={18} />}
                </ListItemIcon>
                <ListItemText primary={highlight} />
              </ListItem>
            ))}
          </List>

          {entry.flagsImpacted && entry.flagsImpacted.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Feature flags touched
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {entry.flagsImpacted.map((flag) => (
                  <Chip key={flag} label={flag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Let&apos;s go
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WhatsNewModal

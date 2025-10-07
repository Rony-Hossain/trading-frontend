'use client'

import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import { ExternalLink, EyeOff } from 'lucide-react'
import type { NewsItem } from '@/lib/types/contracts'
import { useUserStore } from '../../lib/stores/userStore'
import { getCopy } from '@/lib/copy/copy-service'

interface NewsQuickListProps {
  items: NewsItem[]
  mode: 'beginner' | 'expert'
}

export function NewsQuickList({ items, mode }: NewsQuickListProps) {
  const hiddenSources = useUserStore((state) => state.preferences.hiddenNewsSources)
  const hideSource = useUserStore((state) => state.hideNewsSource)

  const visibleItems = items.filter((item) => !hiddenSources.includes(item.source))

  if (visibleItems.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        {mode === 'beginner'
          ? 'All news from hidden sources. Adjust personalization settings to see more.'
          : 'No visible news — modify source filters to restore items.'}
      </Typography>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {mode === 'beginner' ? 'Latest news' : 'News drivers'}
        </Typography>
        <Chip label="Personalized" size="small" variant="outlined" />
      </Box>
      <List dense disablePadding>
        {visibleItems.slice(0, 4).map((item) => (
          <ListItem
            key={`${item.source}-${item.id}`}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Open source">
                  <IconButton
                    component="a"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open news source"
                    size="small"
                  >
                    <ExternalLink size={14} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Hide this source">
                  <IconButton
                    size="small"
                    aria-label="Hide this source"
                    onClick={() => hideSource(item.source)}
                  >
                    <EyeOff size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{ py: 0.5 }}
          >
            <ListItemText
              primaryTypographyProps={{
                variant: 'body2',
                sx: { fontWeight: 500 },
              }}
              secondaryTypographyProps={{
                variant: 'caption',
                color: 'text.secondary',
              }}
              primary={item.headline}
              secondary={`${item.source} • ${new Date(item.publishedAt).toLocaleTimeString()}`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {mode === 'beginner'
          ? 'News providers supply content under their respective licenses. Data retained for 30 days.'
          : 'Attribution enforced per provider ToS. Feedback stored for 30 days per privacy policy.'}
      </Typography>
    </Box>
  )
}

export default NewsQuickList

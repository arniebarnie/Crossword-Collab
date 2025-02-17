'use client'
import { Box, Typography, IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CrosswordCard from './CrosswordCard'
import { useState } from 'react'

interface CrosswordData {
  id: string
  title: string
  lastModified: Date
}

interface CrosswordCarouselProps {
  title: string
  crosswords: CrosswordData[]
  onNewClick: () => void
  onCrosswordClick: (id: string) => void
  sx?: any
}

export default function CrosswordCarousel({
  title,
  crosswords,
  onNewClick,
  onCrosswordClick,
  sx,
}: CrosswordCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const cardWidth = 200 // Width of each card
  const cardGap = 16   // Gap between cards (MUI's spacing 2 = 16px)
  const scrollStep = cardWidth + cardGap

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Ensure we scroll by full card widths
      const newPosition = Math.floor(scrollPosition / scrollStep) * scrollStep - scrollStep
      setScrollPosition(Math.max(0, newPosition))
    } else {
      const maxScroll = (crosswords.length + 1) * scrollStep - scrollStep // +1 for new card
      const newPosition = Math.ceil(scrollPosition / scrollStep) * scrollStep + scrollStep
      setScrollPosition(Math.min(maxScroll, newPosition))
    }
  }

  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Typography variant="h5" gutterBottom sx={{ ml: 2 }}>
        {title}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <Box 
          sx={{ 
            mx: 6,
            overflow: 'hidden',
            position: 'relative',
            px: 1, // Add padding to prevent cut-off
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              transition: 'transform 0.3s ease',
              transform: `translateX(-${scrollPosition}px)`,
              px: 1, // Add padding to prevent cut-off
            }}
          >
            <CrosswordCard isNew onClick={onNewClick} />
            {crosswords.map((crossword) => (
              <CrosswordCard
                key={crossword.id}
                title={crossword.title}
                lastModified={crossword.lastModified}
                onClick={() => onCrosswordClick(crossword.id)}
              />
            ))}
          </Box>
        </Box>
        {scrollPosition > 0 && (
          <IconButton
            sx={{ 
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.default' },
              zIndex: 1,
            }}
            onClick={() => handleScroll('left')}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
        {crosswords.length > 0 && (
          <IconButton
            sx={{ 
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.default' },
              zIndex: 1,
            }}
            onClick={() => handleScroll('right')}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  )
} 
'use client'
import { Paper, Typography, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface CrosswordCardProps {
  title?: string
  lastModified?: Date
  isNew?: boolean
  onClick: () => void
}

export default function CrosswordCard({ title, lastModified, isNew, onClick }: CrosswordCardProps) {
  if (isNew) {
    return (
      <Paper
        sx={{
          width: 200,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.default',
          },
        }}
        onClick={onClick}
      >
        <AddIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        width: 200,
        height: 200,
        p: 2,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'background.default',
        },
      }}
      onClick={onClick}
    >
      <Typography variant="h6" gutterBottom noWrap>
        {title}
      </Typography>
      {lastModified && (
        <Typography variant="body2" color="text.secondary">
          Last modified: {lastModified.toLocaleDateString()}
        </Typography>
      )}
    </Paper>
  )
} 
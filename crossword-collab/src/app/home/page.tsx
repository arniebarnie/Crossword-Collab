'use client'
import { Box, Container } from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/config'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import NavBar from '@/components/NavBar'
import CrosswordCarousel from '@/components/CrosswordCarousel'

const mockRecentlyPlayed = [
  { id: '1', title: 'Sunday Puzzle', lastModified: new Date('2024-03-10') },
  { id: '2', title: 'Weekly Challenge', lastModified: new Date('2024-03-09') },
]

const mockRecentlyModified = [
  { id: '3', title: 'My First Crossword', lastModified: new Date('2024-03-08') },
]

export default function HomePage() {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (!loading && !user) {
      redirect('/')
    }
  }, [user, loading])

  const handleNewCrossword = () => {
    // TODO: Implement new crossword creation
    console.log('Create new crossword')
  }

  const handleCrosswordClick = (id: string) => {
    // TODO: Navigate to crossword
    console.log('Navigate to crossword:', id)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <NavBar 
        username={user?.displayName || 'User'} 
        crosswordsCreated={mockRecentlyModified.length}
        crosswordsSolved={mockRecentlyPlayed.length}
      />
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <CrosswordCarousel
          title="Recently Played"
          crosswords={mockRecentlyPlayed}
          onNewClick={handleNewCrossword}
          onCrosswordClick={handleCrosswordClick}
          sx={{ mb: 8 }}
        />
        <CrosswordCarousel
          title="Recently Modified"
          crosswords={mockRecentlyModified}
          onNewClick={handleNewCrossword}
          onCrosswordClick={handleCrosswordClick}
        />
      </Container>
    </Box>
  )
} 
'use client';

import { Box, Container, Typography, Paper, Button, Stack } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { auth } from '@/firebase/config'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      redirect('/home')
    }
  }, [user])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Crossword Collab
        </Typography>

        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Stack spacing={2}>
            <Typography variant="h6" align="center" gutterBottom>
              Sign in to get started
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={signInWithGoogle}
            >
              Sign in with Google
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

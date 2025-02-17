import { render, screen, act } from '@testing-library/react'
import Page from '@/app/page'

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  signInWithPopup: jest.fn(),
  getAuth: () => ({
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      callback(null)
      return () => {}
    }
  })
}))

describe('Page', () => {
  it('renders the main heading', async () => {
    await act(async () => {
      render(<Page />)
    })
    
    expect(screen.getByRole('heading', { level: 1, name: /Crossword Collab/i })).toBeInTheDocument()
  })
}) 
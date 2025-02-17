import { render, screen, waitFor, act } from '@testing-library/react'
import HomePage from '@/app/home/page'
import Home from '@/app/page'
import userEvent from '@testing-library/user-event'

// Mock Next.js redirect
const mockRedirect = jest.fn()
jest.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path)
}))

// Mock Firebase auth
jest.mock('firebase/auth', () => {
  const createMockAuth = () => {
    let currentUser: any = null
    const authStateListeners: ((user: any) => void)[] = []

    const notifyAuthStateChange = (user: any) => {
      currentUser = user
      authStateListeners.forEach(listener => listener(user))
    }

    return {
      currentUser,
      authStateListeners,
      notifyAuthStateChange,
      resetAuthState: () => {
        currentUser = null
        authStateListeners.length = 0
      }
    }
  }

  const mockAuth = createMockAuth()

  return {
    ...jest.requireActual('firebase/auth'),
    signInWithPopup: jest.fn(() => {
      const user = { displayName: 'Test User', email: 'test@example.com', uid: '123' }
      mockAuth.notifyAuthStateChange(user)
      return Promise.resolve({ user })
    }),
    signOut: jest.fn(() => {
      mockAuth.notifyAuthStateChange(null)
      return Promise.resolve()
    }),
    getAuth: () => ({
      currentUser: mockAuth.currentUser,
      onAuthStateChanged: (callback: (user: any) => void) => {
        mockAuth.authStateListeners.push(callback)
        callback(mockAuth.currentUser)
        return () => {
          const index = mockAuth.authStateListeners.indexOf(callback)
          if (index > -1) mockAuth.authStateListeners.splice(index, 1)
        }
      }
    }),
    __mockAuth: mockAuth // Export for testing
  }
})

describe('Authentication Flow', () => {
  let mockAuth: any

  beforeEach(() => {
    mockRedirect.mockClear()
    mockAuth = require('firebase/auth').__mockAuth
    mockAuth.resetAuthState()
  })

  it('prevents access to /home when not signed in', async () => {
    await act(async () => {
      render(<HomePage />)
    })

    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })
  }, 10000)

  it('redirects to /home after signing in', async () => {
    const user = userEvent.setup()
    
    await act(async () => {
      render(<Home />)
    })

    const signInButton = await screen.findByText(/Sign in with Google/i)
    await act(async () => {
      await user.click(signInButton)
    })

    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith('/home')
    })
  }, 10000)

  it('redirects to landing page after signing out', async () => {
    const user = userEvent.setup()
    mockAuth.notifyAuthStateChange({ displayName: 'Test User', email: 'test@example.com', uid: '123' })
    
    await act(async () => {
      render(<HomePage />)
    })

    const accountButton = await screen.findByText(/Account/i)
    await user.click(accountButton)

    const signOutButton = await screen.findByText(/Sign Out/i)
    await act(async () => {
      await user.click(signOutButton)
    })

    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })
  }, 10000)
}) 
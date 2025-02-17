'use client'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#124E66',  // Dark blue
      light: '#748D92', // Light gray-blue
    },
    secondary: {
      main: '#2E3944', // Dark gray
    },
    background: {
      default: '#D3D9D4', // Light gray
      paper: '#FFFFFF',   // White
    },
    text: {
      primary: '#212A31', // Very dark gray
    },
  },
  typography: {
    fontFamily: 'EB Garamond, serif',
    h1: {
      color: '#212A31',
      fontFamily: 'EB Garamond, serif',
      fontWeight: 500,
    },
    h2: {
      color: '#212A31',
      fontFamily: 'EB Garamond, serif',
      fontWeight: 500,
    },
    h4: {
      color: '#124E66',
      fontFamily: 'EB Garamond, serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'EB Garamond, serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: 'EB Garamond, serif',
      fontWeight: 500,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          padding: '12px 24px',
        },
        contained: {
          backgroundColor: '#124E66',
          '&:hover': {
            backgroundColor: '#2E3944',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            padding: '0 32px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
}) 
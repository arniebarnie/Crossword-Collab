'use client'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem,
  Stack,
  Button
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import { auth } from '@/firebase/config'
import { signOut } from 'firebase/auth'

export default function NavBar({ 
  username, 
  crosswordsCreated = 0, 
  crosswordsSolved = 0 
}: { 
  username: string
  crosswordsCreated?: number
  crosswordsSolved?: number
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      handleClose()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 0,  // Sharp corners
        width: '100%',
        mb: 4  // Add margin bottom
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main', mr: 4 }}>
          {username}
        </Typography>
        
        <Stack direction="row" spacing={4}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Crosswords Created: {crosswordsCreated}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Crosswords Solved: {crosswordsSolved}
          </Typography>
        </Stack>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleMenu}
            sx={{ 
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Account
            <SettingsIcon sx={{ ml: 1 }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 
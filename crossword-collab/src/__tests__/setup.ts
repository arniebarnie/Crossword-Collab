import 'whatwg-fetch'

// Mock Firebase config before any imports
jest.mock('@/firebase/config', () => {
  const { initializeApp } = require('firebase/app')
  const { getAuth, connectAuthEmulator } = require('firebase/auth')
  
  const app = initializeApp({
    apiKey: 'fake-api-key',
    projectId: 'test-project',
    authDomain: 'test-project.firebaseapp.com'
  })
  
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  
  return { app, auth }
}) 
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { beforeAll, afterAll, afterEach } from '@testing-library/react'

const testConfig = {
  apiKey: 'fake-api-key',
  projectId: 'test-project',
  authDomain: 'test-project.firebaseapp.com'
}

export const setupEmulators = () => {
  const app = initializeApp(testConfig)
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  return { app, auth }
}

export const clearEmulatorData = async () => {
  // Clear auth data
  await fetch('http://127.0.0.1:9099/emulator/v1/projects/test-project/accounts', {
    method: 'DELETE'
  })
} 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { getGoogleOAuthClientId } from './app/frontend/src/config/googleAuth.js'

const googleClientId = getGoogleOAuthClientId()

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)

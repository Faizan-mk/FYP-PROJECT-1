import { Navigate } from 'react-router-dom'

/** Legacy URL — send users to login forgot view (avoids catch-all redirect to home). */
export default function ForgotPasswordPage() {
  return <Navigate to="/login?view=forgot" replace />
}

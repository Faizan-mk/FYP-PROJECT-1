 import { Link } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import SocialButtons from './components/SocialButtons'
import SignupForm from './components/SignupForm'

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Sign up to start planning">
      <SignupForm />

      <div className="my-6 flex items-center gap-3 text-gray-500">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs">Or Continue With</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <SocialButtons />

      <div className="mt-6 text-sm text-gray-700">
        Already have an account?{' '}
        <Link className="text-blue-600 hover:underline" to="/login">Log in</Link>
      </div>
    </AuthLayout>
  )
}

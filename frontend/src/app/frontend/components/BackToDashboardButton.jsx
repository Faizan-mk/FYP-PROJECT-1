import { useNavigate } from 'react-router-dom'

function BackToDashboardButton() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/dashboard')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm border border-gray-200 hover:shadow-md hover:bg-indigo-50 transition-colors"
    >
      <span className="text-lg" aria-hidden>
        ←
      </span>
      <span>Back to Dashboard</span>
    </button>
  )
}

export default BackToDashboardButton


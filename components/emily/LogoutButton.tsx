"use client"

export default function LogoutButton() {
  function handleLogout() {
    document.cookie = 'emily_admin=; path=/emily; max-age=0'
    window.location.href = '/emily/admin'
  }

  return (
    <button
      onClick={handleLogout}
      className="group relative p-5 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl hover:border-red-400 hover:shadow-lg transition-all"
    >
      <div className="text-3xl mb-3">🚪</div>
      <div className="text-sm font-semibold text-red-700 group-hover:text-red-800 transition">
        Logout
      </div>
      <div className="text-xs text-red-500 mt-1">End session</div>
    </button>
  )
}

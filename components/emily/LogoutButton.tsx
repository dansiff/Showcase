"use client"

export default function LogoutButton() {
  function handleLogout() {
    document.cookie = 'emily_admin=; path=/emily; max-age=0'
    window.location.href = '/emily/admin'
  }

  return (
    <button
      onClick={handleLogout}
      className="p-4 border rounded-xl hover:bg-red-50 transition text-center border-red-200"
    >
      <div className="text-sm font-medium text-red-600">Logout</div>
      <div className="text-xs text-red-400 mt-1">Clear session</div>
    </button>
  )
}

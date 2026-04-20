'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const links = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/rooms', label: 'Rooms', icon: '🏠' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Hostel Admin</h1>
          <p className="text-sm text-gray-500">Management Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  active
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <span>{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition">
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

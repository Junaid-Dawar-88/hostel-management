'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './theme-toggle'

const links = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/rooms', label: 'Rooms', icon: '🏠' },
  { href: '/students', label: 'Students', icon: '🎓' },
  { href: '/menu', label: 'Food Menu', icon: '🍽️' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    if (open) setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">Hostel Admin</h1>
        <ThemeToggle />
      </div>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div>
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hostel Admin</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Management Panel</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="lg:hidden p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
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
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <span>{l.icon}</span>
                  <span>{l.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

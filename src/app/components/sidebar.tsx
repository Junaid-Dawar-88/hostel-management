'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X, ChevronUp, LogOut, Settings, User, Phone, Building2 } from 'lucide-react'
import ThemeToggle from './theme-toggle'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const links = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/rooms', label: 'Rooms', icon: '🏠' },
  { href: '/students', label: 'Students', icon: '🎓' },
  { href: '/menu', label: 'Food Menu', icon: '🍽️' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

interface SidebarProps {
  warden: { name: string; email: string }
}

const Sidebar = ({ warden }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/login')
    router.refresh()
  }

  const initials = warden.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

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
        <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">Life Star Hostel</h1>
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
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Life Star Hostel</h1>
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
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-xl p-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition outline-none cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{warden.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{warden.email}</p>
              </div>
              <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" sideOffset={8} className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{warden.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{warden.email}</p>
              </div>
              <DropdownMenuSeparator />
              <Link href="/settings">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Profile & Account
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Building2 className="h-4 w-4" />
                Life Star Hostel
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Phone className="h-4 w-4" />
                Contact Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

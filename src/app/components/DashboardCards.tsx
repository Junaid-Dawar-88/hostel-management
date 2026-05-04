'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Room = {
  id: number
  number: string
  floor: number
  capacity: number
  _count: { students: number }
}

type Student = {
  id: number
  name: string
  rollNo: string
  feeTotal: number | null
  feePaid: number
  room: { number: string } | null
}

type CardType = 'rooms' | 'students' | 'occupancy' | 'vacant' | 'paid' | 'partial' | 'unpaid'

type Props = {
  rooms: Room[]
  students: Student[]
  stats: {
    totalRooms: number
    totalStudents: number
    occupancy: number
    occupiedBeds: number
    totalCapacity: number
    vacantBeds: number
    fullRooms: number
    fullyPaid: number
    partial: number
    unpaid: number
  }
}

const CARD_TITLES: Record<CardType, string> = {
  rooms: 'All Rooms',
  students: 'All Students',
  occupancy: 'Available Rooms',
  vacant: 'Vacant Rooms',
  paid: 'Fully Paid Students',
  partial: 'Partially Paid Students',
  unpaid: 'Unpaid Students',
}

const ROOM_CARDS: CardType[] = ['rooms', 'occupancy', 'vacant']

function StatCard({
  label,
  value,
  accent,
  sub,
  onClick,
}: {
  label: string
  value: string | number
  accent: string
  sub?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition h-full cursor-pointer"
    >
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</h3>
      <p className={`text-3xl font-bold mt-2 ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </button>
  )
}

export default function DashboardCards({ rooms, students, stats }: Props) {
  const [open, setOpen] = useState(false)
  const [activeCard, setActiveCard] = useState<CardType | null>(null)
  const [search, setSearch] = useState('')

  function openCard(type: CardType) {
    setActiveCard(type)
    setSearch('')
    setOpen(true)
  }

  const isRoomCard = ROOM_CARDS.includes(activeCard ?? ('' as CardType))

  const filteredRooms = useMemo((): Room[] => {
    if (!activeCard || !isRoomCard) return []
    const q = search.toLowerCase()
    let base = rooms
    if (activeCard === 'occupancy') base = rooms.filter((r) => r._count.students > 0)
    if (activeCard === 'vacant') base = rooms.filter((r) => r._count.students === 0)
    if (!q) return base
    return base.filter(
      (r) => r.number.toLowerCase().includes(q) || String(r.floor).includes(q),
    )
  }, [activeCard, isRoomCard, rooms, search])

  const filteredStudents = useMemo((): Student[] => {
    if (!activeCard || isRoomCard) return []
    const q = search.toLowerCase()
    let base = students
    if (activeCard === 'paid') base = students.filter((s) => s.feeTotal && s.feePaid >= s.feeTotal)
    if (activeCard === 'partial')
      base = students.filter(
        (s) => s.feeTotal && s.feePaid > 0 && s.feePaid < s.feeTotal,
      )
    if (activeCard === 'unpaid')
      base = students.filter((s) => !s.feeTotal || s.feePaid === 0)
    if (!q) return base
    return base.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q),
    )
  }, [activeCard, isRoomCard, students, search])

  const count = isRoomCard ? filteredRooms.length : filteredStudents.length

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          onClick={() => openCard('rooms')}
          label="Total Rooms"
          value={stats.totalRooms}
          accent="text-blue-600"
          sub={`${stats.fullRooms} full`}
        />
        <StatCard
          onClick={() => openCard('students')}
          label="Total Students"
          value={stats.totalStudents}
          accent="text-green-600"
        />
        <StatCard
          onClick={() => openCard('occupancy')}
          label="Occupancy"
          value={`${stats.occupancy}%`}
          accent="text-indigo-600"
          sub={`${stats.occupiedBeds}/${stats.totalCapacity} beds`}
        />
        <StatCard
          onClick={() => openCard('vacant')}
          label="Vacant Beds"
          value={stats.vacantBeds}
          accent="text-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          onClick={() => openCard('paid')}
          label="Fully Paid"
          value={stats.fullyPaid}
          accent="text-emerald-600"
        />
        <StatCard
          onClick={() => openCard('partial')}
          label="Partial"
          value={stats.partial}
          accent="text-amber-500"
        />
        <StatCard
          onClick={() => openCard('unpaid')}
          label="Unpaid"
          value={stats.unpaid}
          accent="text-red-500"
        />
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className="w-[95vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeCard ? CARD_TITLES[activeCard] : ''}</DialogTitle>
          </DialogHeader>

          <input
            type="text"
            placeholder={
              isRoomCard ? 'Search by room number or floor number…' : 'Search by name or roll number…'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />

          <div className="max-h-72 overflow-y-auto">
            {isRoomCard ? (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-gray-900">
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="py-2 pr-4 font-medium">Room</th>
                    <th className="py-2 pr-4 font-medium">Floor</th>
                    <th className="py-2 pr-4 font-medium">Occupancy</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No rooms found
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((r) => {
                      const full = r._count.students >= r.capacity
                      const empty = r._count.students === 0
                      return (
                        <tr
                          key={r.id}
                          className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                        >
                          <td className="py-2 pr-4 font-medium text-gray-800 dark:text-gray-100">
                            {r.number}
                          </td>
                          <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{r.floor}</td>
                          <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                            {r._count.students}/{r.capacity}
                          </td>
                          <td className="py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                full
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                  : empty
                                    ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              }`}
                            >
                              {full ? 'Full' : empty ? 'Empty' : 'Available'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-gray-900">
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Roll No</th>
                    <th className="py-2 pr-4 font-medium">Room</th>
                    <th className="py-2 font-medium">Fee Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const paid = s.feeTotal && s.feePaid >= s.feeTotal
                      const partial = s.feeTotal && s.feePaid > 0 && s.feePaid < s.feeTotal
                      return (
                        <tr
                          key={s.id}
                          className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                        >
                          <td className="py-2 pr-4 font-medium text-gray-800 dark:text-gray-100">
                            {s.name}
                          </td>
                          <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{s.rollNo}</td>
                          <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                            {s.room?.number ?? '—'}
                          </td>
                          <td className="py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                paid
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                  : partial
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              }`}
                            >
                              {paid ? 'Paid' : partial ? 'Partial' : 'Unpaid'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            {count} {isRoomCard ? 'room' : 'student'}
            {count !== 1 ? 's' : ''} found
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const StatCard = ({
  label,
  value,
  accent,
  sub,
  href,
}: {
  label: string
  value: string | number
  accent: string
  sub?: string
  href?: string
}) => {
  const body = (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg hover:border-blue-300 transition h-full">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</h3>
      <p className={`text-3xl font-bold mt-2 ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
  return href ? <Link href={href} className="block">{body}</Link> : body
}

const Page = async () => {
  const [totalRooms, totalStudents, feeStats, rooms, recentStudents] =
    await Promise.all([
      prisma.room.count(),
      prisma.student.count(),
      prisma.student.findMany({ select: { feeTotal: true, feePaid: true } }),
      prisma.room.findMany({
        include: { _count: { select: { students: true } } },
        orderBy: { number: 'asc' },
      }),
      prisma.student.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { room: true },
      }),
    ])

  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0)
  const occupiedBeds = rooms.reduce((s, r) => s + r._count.students, 0)
  const fullRooms = rooms.filter((r) => r._count.students >= r.capacity).length
  const vacantBeds = Math.max(totalCapacity - occupiedBeds, 0)
  const occupancy = totalCapacity ? Math.round((occupiedBeds / totalCapacity) * 100) : 0
  const fullyPaid = feeStats.filter((s) => s.feeTotal && s.feePaid >= s.feeTotal).length
  const partial = feeStats.filter(
    (s) => s.feeTotal && s.feePaid > 0 && s.feePaid < s.feeTotal,
  ).length
  const unpaid = totalStudents - fullyPaid - partial

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your hostel</p>
        </div>
        <Link
          href="/rooms"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition whitespace-nowrap"
        >
          Manage Rooms
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard href="/rooms" label="Total Rooms" value={totalRooms} accent="text-blue-600" sub={`${fullRooms} full`} />
        <StatCard href="/students" label="Total Students" value={totalStudents} accent="text-green-600" />
        <StatCard href="/rooms?filter=available" label="Occupancy" value={`${occupancy}%`} accent="text-indigo-600" sub={`${occupiedBeds}/${totalCapacity} beds`} />
        <StatCard href="/rooms?filter=empty" label="Vacant Beds" value={vacantBeds} accent="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard href="/students?fee=paid" label="Fully Paid" value={fullyPaid} accent="text-emerald-600" />
        <StatCard href="/students?fee=partial" label="Partial" value={partial} accent="text-amber-500" />
        <StatCard href="/students?fee=unpaid" label="Unpaid" value={unpaid} accent="text-red-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Room Occupancy</h2>
            <Link href="/rooms" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No rooms yet. Create one from the Rooms page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2">Room</th>
                    <th className="py-2">Floor</th>
                    <th className="py-2">Occupancy</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.slice(0, 8).map((r) => {
                    const full = r._count.students >= r.capacity
                    return (
                      <tr key={r.id} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                        <td className="py-2 font-medium text-gray-800 dark:text-gray-100">{r.number}</td>
                        <td className="py-2 text-gray-600 dark:text-gray-300">{r.floor}</td>
                        <td className="py-2 text-gray-600 dark:text-gray-300">
                          {r._count.students}/{r.capacity}
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              full
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                : r._count.students === 0
                                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            }`}
                          >
                            {full ? 'Full' : r._count.students === 0 ? 'Empty' : 'Available'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Students</h2>
          {recentStudents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No students yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentStudents.map((s) => {
                const paidFull = s.feeTotal && s.feePaid >= s.feeTotal
                const isPartial = s.feeTotal && s.feePaid > 0 && s.feePaid < s.feeTotal
                return (
                  <li key={s.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{s.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {s.rollNo} {s.room ? `• Room ${s.room.number}` : ''}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        paidFull
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : isPartial
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                    >
                      {paidFull ? 'Paid' : isPartial ? 'Partial' : 'Unpaid'}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page

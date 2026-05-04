import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'
import DashboardCards from '@/app/components/DashboardCards'
import LandingPage from '@/app/components/LandingPage'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const warden = token ? await verifyJWT(token) : null
  if (!warden) return <LandingPage />

  const wardenId = warden.wardenId

  const [totalRooms, totalStudents, rooms, allStudents, recentStudents] = await Promise.all([
    prisma.room.count({ where: { wardenId } }),
    prisma.student.count({ where: { wardenId } }),
    prisma.room.findMany({
      where: { wardenId },
      include: { _count: { select: { students: true } } },
      orderBy: { number: 'asc' },
    }),
    prisma.student.findMany({
      where: { wardenId },
      select: { id: true, name: true, rollNo: true, feeTotal: true, feePaid: true, room: { select: { number: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.student.findMany({
      where: { wardenId },
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
  const fullyPaid = allStudents.filter((s) => s.feeTotal && s.feePaid >= s.feeTotal).length
  const partial = allStudents.filter(
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

      <DashboardCards
        rooms={rooms}
        students={allStudents}
        stats={{
          totalRooms,
          totalStudents,
          occupancy,
          occupiedBeds,
          totalCapacity,
          vacantBeds,
          fullRooms,
          fullyPaid,
          partial,
          unpaid,
        }}
      />

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

'use client'
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useRooms, type StudentSummary } from '@/hooks/api/rooms'
import { computeFeeStatus, type FeeStatus } from '@/lib/schemas/student'

type StudentWithRoom = StudentSummary & { roomNumber: string | null; roomId: number | null }

const filterLabel: Record<string, string> = {
  paid: 'Fully Paid',
  partial: 'Partial',
  unpaid: 'Unpaid',
}

const StudentsClient = () => {
  const sp = useSearchParams()
  const feeFilter = sp.get('fee') as FeeStatus | null
  const { data: rooms = [], isLoading } = useRooms()
  const [query, setQuery] = useState('')

  const students: StudentWithRoom[] = useMemo(
    () =>
      rooms.flatMap((r) =>
        r.students.map((s) => ({ ...s, roomNumber: r.number, roomId: r.id })),
      ),
    [rooms],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      if (feeFilter && computeFeeStatus(s.feePaid, s.feeTotal) !== feeFilter) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        (s.fatherName?.toLowerCase().includes(q) ?? false) ||
        (s.phone?.toLowerCase().includes(q) ?? false) ||
        (s.cnic?.toLowerCase().includes(q) ?? false) ||
        (s.roomNumber?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [students, query, feeFilter])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading…' : `${filtered.length} of ${students.length} shown`}
            {feeFilter && (
              <>
                {' '}• Filter: <span className="font-medium">{filterLabel[feeFilter]}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {feeFilter && (
            <Link
              href="/students"
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-accent"
            >
              Clear filter
            </Link>
          )}
          <div className="relative flex-1 sm:flex-none">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, roll, room…"
              className="pl-9 w-full sm:w-72"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              {isLoading ? 'Loading…' : 'No students match your filters.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const status = computeFeeStatus(s.feePaid, s.feeTotal)
                  const variant =
                    status === 'paid' ? 'default' : status === 'partial' ? 'secondary' : 'destructive'
                  const remaining = s.feeTotal ? Math.max(s.feeTotal - s.feePaid, 0) : null
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {s.imageUrl ? (
                            <Image
                              src={s.imageUrl}
                              alt={s.name}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                              {s.name
                                .split(' ')
                                .map((n) => n[0])
                                .filter(Boolean)
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{s.name}</p>
                            {s.fatherName && (
                              <p className="text-xs text-muted-foreground">
                                S/O {s.fatherName}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.rollNo}</TableCell>
                      <TableCell>
                        {s.roomNumber ? (
                          <Link
                            href="/rooms"
                            className="text-blue-600 hover:underline"
                          >
                            Room {s.roomNumber}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{s.phone || '—'}</TableCell>
                      <TableCell className="text-sm">
                        {s.feeTotal
                          ? `${s.feePaid}/${s.feeTotal}`
                          : s.feePaid
                            ? `${s.feePaid}`
                            : '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {remaining === null ? (
                          <span className="text-muted-foreground">—</span>
                        ) : remaining === 0 ? (
                          <span className="text-emerald-600 font-medium">0</span>
                        ) : (
                          <span className="text-red-600 font-medium">{remaining}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={variant}>
                          {status === 'paid' ? 'Paid' : status === 'partial' ? 'Partial' : 'Unpaid'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentsClient

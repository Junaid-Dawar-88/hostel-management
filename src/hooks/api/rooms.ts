'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RoomCreateInput } from '@/lib/schemas/room'

export type StudentSummary = {
  id: number
  rollNo: string
  name: string
  fatherName: string | null
  address: string | null
  phone: string | null
  guardPhone: string | null
  cnic: string | null
  course: string | null
  feesPaid: boolean
}

export type RoomWithStudents = {
  id: number
  number: string
  floor: number
  capacity: number
  students: StudentSummary[]
  _count?: { students: number }
}

const ROOMS_KEY = ['rooms'] as const

export const useRooms = () =>
  useQuery({
    queryKey: ROOMS_KEY,
    queryFn: async (): Promise<RoomWithStudents[]> => {
      const res = await fetch('/api/rooms')
      if (!res.ok) throw new Error('Failed to load rooms')
      return res.json()
    },
  })

export const useCreateRoom = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: RoomCreateInput) => {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create room')
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOMS_KEY }),
  })
}

export const useDeleteRoom = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete room')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOMS_KEY }),
  })
}

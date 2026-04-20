'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { StudentCreateInput } from '@/lib/schemas/student'

export const useCreateStudent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: StudentCreateInput) => {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create student')
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  })
}

export const useDeleteStudent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete student')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  })
}

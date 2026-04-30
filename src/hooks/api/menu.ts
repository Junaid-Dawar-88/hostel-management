'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MenuItemCreateInput, MenuItemUpdateInput } from '@/lib/schemas/menu'

export type MenuItem = {
  id: number
  day: string
  meal: string
  items: string
  createdAt: string
  updatedAt: string
}

const MENU_KEY = ['menu'] as const

export const useMenu = () =>
  useQuery({
    queryKey: MENU_KEY,
    queryFn: async (): Promise<MenuItem[]> => {
      const res = await fetch('/api/menu')
      if (!res.ok) throw new Error('Failed to load menu')
      return res.json()
    },
  })

export const useCreateMenuItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: MenuItemCreateInput) => {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create menu')
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  })
}

export const useUpdateMenuItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MenuItemUpdateInput }) => {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to update menu')
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  })
}

export const useDeleteMenuItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete menu')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  })
}

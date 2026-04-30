import { z } from 'zod'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const MEALS = ['Breakfast', 'Lunch', 'Dinner'] as const

export const menuItemCreateSchema = z.object({
  day: z.enum(DAYS),
  meal: z.enum(MEALS),
  items: z.string().trim().min(1, 'Items are required'),
})

export type MenuItemCreateInput = z.infer<typeof menuItemCreateSchema>

export const menuItemUpdateSchema = menuItemCreateSchema.partial()
export type MenuItemUpdateInput = z.infer<typeof menuItemUpdateSchema>

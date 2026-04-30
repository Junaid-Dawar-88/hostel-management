import { z } from 'zod'

export const roomCreateSchema = z.object({
  number: z.string().trim().min(1, 'Room number is required'),
  floor: z.number().int().min(1).max(5),
  capacity: z.number().int().min(2).max(4),
})

export type RoomCreateInput = z.infer<typeof roomCreateSchema>

export const roomUpdateSchema = roomCreateSchema.partial()
export type RoomUpdateInput = z.infer<typeof roomUpdateSchema>

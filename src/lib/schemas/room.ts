import { z } from 'zod'

export const roomCreateSchema = z.object({
  number: z.string().trim().min(1, 'Room number is required'),
  floor: z.coerce.number().int().min(1).max(5),
  capacity: z.coerce.number().int().min(2).max(4),
})

export type RoomCreateInput = z.infer<typeof roomCreateSchema>

export const roomSchema = z.object({
  id: z.number(),
  number: z.string(),
  floor: z.number(),
  capacity: z.number(),
  createdAt: z.union([z.string(), z.date()]),
})

export type RoomDTO = z.infer<typeof roomSchema>

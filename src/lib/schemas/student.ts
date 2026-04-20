import { z } from 'zod'

export const studentCreateSchema = z.object({
  rollNo: z.string().trim().min(1, 'Roll number is required'),
  name: z.string().trim().min(1, 'Name is required'),
  fatherName: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  guardPhone: z.string().trim().optional().nullable(),
  cnic: z.string().trim().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('').transform(() => null)),
  course: z.string().trim().optional().nullable(),
  feesPaid: z.boolean().optional().default(false),
  roomId: z.coerce.number().int().positive().optional().nullable(),
})

export type StudentCreateInput = z.infer<typeof studentCreateSchema>

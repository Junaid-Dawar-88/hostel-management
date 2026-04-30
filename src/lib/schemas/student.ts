import { z } from 'zod'

export const studentCreateSchema = z.object({
  rollNo: z.string().trim().min(1, 'Roll number is required'),
  name: z.string().trim().min(1, 'Name is required'),
  fatherName: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  guardPhone: z.string().trim().optional().nullable(),
  cnic: z.string().trim().optional().nullable(),
  imageUrl: z.string().trim().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('').transform(() => null)),
  course: z.string().trim().optional().nullable(),
  feeTotal: z.number().min(0).optional().nullable(),
  feePaid: z.number().min(0),
  roomId: z.number().int().positive().optional().nullable(),
})

export type StudentCreateInput = z.infer<typeof studentCreateSchema>

export const studentUpdateSchema = studentCreateSchema.partial()
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>

export type FeeStatus = 'paid' | 'partial' | 'unpaid'

export const computeFeeStatus = (
  feePaid: number,
  feeTotal: number | null | undefined,
): FeeStatus => {
  if (!feeTotal || feeTotal <= 0) return feePaid > 0 ? 'paid' : 'unpaid'
  if (feePaid <= 0) return 'unpaid'
  if (feePaid >= feeTotal) return 'paid'
  return 'partial'
}

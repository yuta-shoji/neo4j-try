import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format')
})

export const createRelationshipSchema = z.object({
  fromUserId: z.string().min(1, 'From user ID is required'),
  toUserId: z.string().min(1, 'To user ID is required'),
  type: z.enum(['FRIEND', 'COLLEAGUE', 'FAMILY'])
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema> 
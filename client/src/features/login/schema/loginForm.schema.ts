import { z } from 'zod';

// Base schema with all fields
/* export const loginFormSchema = z.object({
    email: z.string().min(1, 'Email is required').max(100, 'Email is too long')
        .regex(/^\S+@\S+\.\S+$/, 'Invalid email format'),
    password: z.string()
        .regex(/^[a-z0-9]+$/, 'Password can only contain lowercase letters and numbers')
        .regex(/[a-z]/, 'Password must contain at least one letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters'),
}); */


export const loginFormSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required')
});

export type LoginInput = z.infer<typeof loginFormSchema>;
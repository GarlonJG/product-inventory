import { z } from 'zod';

export const itemSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    sku: z.string()
        .length(6, 'SKU must be exactly 6 digits')
        .regex(/^\d+$/, 'SKU must contain only numbers'),
    description: z.string().max(500, 'Description is too long').optional(),
    price: z.preprocess((val) => {
        // Convert input to string for regex validation
        if (typeof val === 'number') return val.toFixed(2);
        if (typeof val === 'string') return val;
        return val;
    }, z.string()
        .regex(/^\d+\.\d{2}$/, 'Price must have exactly 2 decimal places (e.g., 0.00)')
    ).transform((val) => Number(val))
        .refine((num) => !isNaN(num) && num >= 0, {
        message: 'Price must be a non-negative number',
    }),
    stock: z.preprocess((val) => {
        // Convert input from DOM to number
        if (typeof val === 'string' && val.trim() !== '') {
            return Number(val);
        }
        return val;
    }, z.number()
        .int('Stock must be a whole number')
        .min(0, 'Stock cannot be negative')
    )
});

export type ItemInput = z.infer<typeof itemSchema>;
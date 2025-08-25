import { z } from 'zod';
import { StallStatus } from './enums';

// Export inferred types from Zod schemas
export type LoginForm = z.infer<typeof loginSchema>;
export type UserForm = z.infer<typeof userSchema>;
export type StallForm = z.infer<typeof stallSchema>;
export type TransactionForm = z.infer<typeof transactionSchema>;

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  yearOfBirth: z.coerce.number().min(1900, 'Year of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  phoneNumber: z.string().min(8, 'Phone number must be at least 8 characters'),
  email: z.email('Invalid email address'),
});

export const stallSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  deviceName: z.string().min(2, 'Device name must be at least 2 characters'),
  location: z.array(z.coerce.number()).length(2, 'Location must be an array with exactly 2 numbers [lat, lng]')
    .refine((coords) => coords[0] >= -90 && coords[0] <= 90, 'Latitude must be between -90 and 90')
    .refine((coords) => coords[1] >= -180 && coords[1] <= 180, 'Longitude must be between -180 and 180'),
  umbrellaCount: z.coerce.number().min(0, 'Umbrella count must be 0 or greater'),
  status: z.enum(StallStatus),
});

export const transactionSchema = z.object({
  user: z.string().nullable(),
  stall: z.string().nullable(),
  amount: z.number().min(0, 'Amount must be 0 or greater'),
  borrowDate: z.date().nullable(),
  returnDate: z.date().nullable(),
}).refine((data) => {
  if (data.borrowDate && data.returnDate) {
    return data.returnDate > data.borrowDate;
  }
  return true;
}, {
  message: "Return date must be after borrow date",
  path: ["returnDate"],
});

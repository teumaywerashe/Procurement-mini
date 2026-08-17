import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export const tenderStatusEnum = z.enum([
  "draft",
  "published",
  "closed",
  "awarded",
  "cancelled",
]);

export const tenderSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  name: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  status: tenderStatusEnum,
  closingDate: z
    .string()
    .min(1, "Closing date is required")
    .refine((v) => !isNaN(Date.parse(v)), "Enter a valid closing date")
    .refine(
      (v) => new Date(v) > new Date(),
      "Closing date must be in the future",
    ),
  estimatedValue: z
    .string()
    .min(1, "Estimated value is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
});

export type TenderFormValues = z.infer<typeof tenderSchema>;

export const vendorSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  registrationNumber: z
    .string()
    .min(3, "Registration number must be at least 3 characters"),
  email: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
  phoneNumber: z
    .string()
    .regex(/^[+\d\s\-()]{0,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;

export const bidSchema = z.object({
  amount: z
    .string()
    .min(1, "Bid amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Amount must be a positive number"),
});

export type BidFormValues = z.infer<typeof bidSchema>;

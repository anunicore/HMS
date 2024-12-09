import { z } from "zod";

export const specialtySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Specialty name is required!" }),
  doctors: z.array(z.string()), //doctor ids
});

export type SpecialtySchema = z.infer<typeof specialtySchema>;

export const departmentSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Specialty name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  areasId: z.coerce.number().min(1, { message: "Areas name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type DepartmentSchema = z.infer<typeof departmentSchema>;

export const doctorSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  Qualifications: z.string().min(1, { message: "Qualifications is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  specialties: z.array(z.string()).optional(), // specialty ids
});

export type DoctorSchema = z.infer<typeof doctorSchema>;

export const patientSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!"}),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  areasId: z.coerce.number().min(1, { message: "Areas is required!" }),
  departmentId: z.coerce
    .number()
    .min(1, { message: "Department is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type PatientSchema = z.infer<typeof patientSchema>;

export const medicaldescriptionSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  medicalId: z.coerce.number({ message: "Medical is required!" }),
});

export type MedicalDescriptionSchema = z.infer<typeof medicaldescriptionSchema>;

"use server";

import { revalidatePath } from "next/cache";
import {
  DepartmentSchema,
  MedicalDescriptionSchema,
  PatientSchema,
  SpecialtySchema,
  DoctorSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSpecialty = async (
  currentState: CurrentState,
  data: SpecialtySchema
) => {
  try {
    await prisma.specialty.create({
      data: {
        name: data.name,
        doctors: {
          connect: data.doctors.map((doctorId) => ({ id: doctorId })),
        },
      },
    });

    // revalidatePath("/list/specialties");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSpecialty = async (
  currentState: CurrentState,
  data: SpecialtySchema
) => {
  try {
    await prisma.specialty.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        doctors: {
          set: data.doctors.map((doctorId) => ({ id: doctorId })),
        },
      },
    });

    // revalidatePath("/list/specialties");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSpecialty = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.specialty.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/specialties");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createDepartment = async (
  currentState: CurrentState,
  data: DepartmentSchema
) => {
  try {
    await prisma.department.create({
      data,
    });

    // revalidatePath("/list/department");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateDepartment = async (
  currentState: CurrentState,
  data: DepartmentSchema
) => {
  try {
    await prisma.department.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/department");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteDepartment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.department.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/department");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createDoctor = async (
  currentState: CurrentState,
  data: DoctorSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "doctor" },
    });

    await prisma.doctor.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        qualifications: data.Qualifications,
        sex: data.sex,
        birthday: data.birthday,
        specialties: {
          connect: data.specialties?.map((specialtyId: string) => ({
            id: parseInt(specialtyId),
          })),
        },
      },
    });

    // revalidatePath("/list/doctors");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateDoctor = async (
  currentState: CurrentState,
  data: DoctorSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.doctor.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        qualifications: data.Qualifications,
        sex: data.sex,
        birthday: data.birthday,
        specialties: {
          set: data.specialties?.map((specialtyId: string) => ({
            id: parseInt(specialtyId),
          })),
        },
      },
    });
    // revalidatePath("/list/doctors");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteDoctor = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.doctor.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/doctors");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createPatient = async (
  currentState: CurrentState,
  data: PatientSchema
) => {
  console.log(data);
  try {
    const departmentItem = await prisma.department.findUnique({
      where: { id: data.departmentId },
      include: { _count: { select: { patients: true } } },
    });

    if (departmentItem && departmentItem.capacity === departmentItem._count.patients) {
      return { success: false, error: true };
    }

    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      // publicMetadata: { role: "patient" },
    });

    await prisma.patient.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        areasId: data.areasId,
        departmentId: data.departmentId,
        parentId: data.parentId,
      },
    });

    // revalidatePath("/list/patients");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updatePatient = async (
  currentState: CurrentState,
  data: PatientSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.patient.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        areasId: data.areasId,
        departmentId: data.departmentId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/patients");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deletePatient = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.patient.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/patients");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createMedicalDescription = async (
  currentState: CurrentState,
  data: MedicalDescriptionSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "doctor") {
    //   const doctorMedical = await prisma.medical.findFirst({
    //     where: {
    //       doctorId: userId!,
    //       id: data.medicalId,
    //     },
    //   });

    //   if (!doctorMedical) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.description.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        medicalId: data.medicalId,
      },
    });

    // revalidatePath("/list/specialties");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateMedicalDescription = async (
  currentState: CurrentState,
  data: MedicalDescriptionSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "doctor") {
    //   const doctorMedical = await prisma.medical.findFirst({
    //     where: {
    //       doctorId: userId!,
    //       id: data.medicalId,
    //     },
    //   });

    //   if (!doctorMedical) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.description.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        medicalId: data.medicalId,
      },
    });

    // revalidatePath("/list/specialties");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteDescription = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.description.delete({
      where: {
        id: parseInt(id),
        // ...(role === "doctor" ? { medical: { doctorId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/specialties");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

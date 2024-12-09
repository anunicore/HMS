// import prisma from "@/lib/prisma";
// import FormModal from "./FormModal";
// import { auth } from "@clerk/nextjs/server";

// export type FormContainerProps = {
//   table:
//     | "doctor"
//     | "patient"
//     | "parent"
//     | "specialty"
//     | "department"
//     | "medical"
//     | "description"
//     | "assignment"
//     | "prescription"
//     | "attendance"
//     | "event"
//     | "announcement";
//   type: "create" | "update" | "delete";
//   data?: any;
//   id?: number | string;
// };

// const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
//   let relatedData = {};

//   const { userId, sessionClaims } = auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;
//   const currentUserId = userId;

//   if (type !== "delete") {
//     switch (table) {
//       case "specialty":
//         const specialtyDoctors = await prisma.doctor.findMany({
//           select: { id: true, name: true, surname: true },
//         });
//         relatedData = { doctors: specialtyDoctors };
//         break;
//       case "department":
//         const departmentAreas = await prisma.areas.findMany({
//           select: { id: true, tower: true },
//         });
//         const departmentDoctors = await prisma.doctor.findMany({
//           select: { id: true, name: true, surname: true },
//         });
//         relatedData = { doctors: departmentDoctors, areas: departmentAreas };
//         break;
//       case "doctor":
//         const doctorSpecialties = await prisma.specialty.findMany({
//           select: { id: true, name: true },
//         });
//         relatedData = { specialties: doctorSpecialties };
//         break;
//       case "doctor":
//         const doctorAreas = await prisma.areas.findMany({
//           select: { id: true, tower: true },
//         });
//         const doctorDepartments = await prisma.department.findMany({
//           include: { _count: { select: { patients: true } } },
//         });
//         relatedData = { departments: doctorDepartments, areas: doctorAreas };
//         break;
//       case "description":
//         const description = await prisma.medical.findMany({
//           where: {
//             ...(role === "doctor" ? { doctorId: currentUserId! } : {}),
//           },
//           select: { id: true, name: true },
//         });
//         relatedData = { medicals: description };
//         break;

//       default:
//         break;
//     }
//   }

//   return (
//     <div className="">
//       <FormModal
//         table={table}
//         type={type}
//         data={data}
//         id={id}
//         relatedData={relatedData}
//       />
//     </div>
//   );
// };

// export default FormContainer;
import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "doctor"
    | "patient"
    | "parent"
    | "specialty"
    | "department"
    | "medical"
    | "description"
    | "assignment"
    | "prescription"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  defaultValues?: {
    name?: string;
    capacity?: number;
    supervisorId?: string | null;
    areasId?: number | null;
  };
};

const FormContainer = async ({
  table,
  type,
  data,
  id,
  defaultValues,
}: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "patient":
        const departments = await prisma.department.findMany({
          select: { id: true, name: true },
        });
        relatedData = { departments };
        break;
      case "specialty":
        const specialtyDoctors = await prisma.doctor.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { doctors: specialtyDoctors };
        break;
      case "department":
        const departmentAreas = await prisma.areas.findMany({
          select: { id: true, tower: true },
        });
        const departmentDoctors = await prisma.doctor.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { doctors: departmentDoctors, areas: departmentAreas };
        break;
      case "doctor":
        const doctorSpecialties = await prisma.specialty.findMany({
          select: { id: true, name: true },
        });
        relatedData = { specialties: doctorSpecialties };
        break;
      case "description":
        const description = await prisma.medical.findMany({
          where: {
            ...(role === "doctor" ? { doctorId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { medicals: description };
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default FormContainer;

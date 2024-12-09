import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Doctor, Medical, Prisma, Specialty } from "@prisma/client";
import Image from "next/image";

// type MedicalList = Medical & { specialty: Specialty } & {
//   department: Department;
// } & {
//   doctor: Doctor;
// };
type MedicalList = Medical & {
  specialties: Specialty & {
    doctors: Doctor[];
  };
};

const MedicalListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  console.log("User role:", role); // Verify this
  const columns = [
    {
      header: "Specialty Name",
      accessor: "name",
    },
    {
      header: "Department",
      accessor: "department",
      className: "",
    },
    {
      header: "Doctor Handler",
      accessor: "doctor",
      className: "hidden md:table-cell",
    }, {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },

    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: MedicalList) => {

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">{item .name || "N/A"}</td>
        <td className="flex items-center gap-4 p-4">{item.specialties?.name || "N/A"}</td>
        <td>{item.departmentId || "N/A"}</td>
        {/* <td>
        {item.specialties
          .map((specialty: Specialty & { doctors: Doctor[] }) => specialty.name)
          .join(", ") || "N/A"}
      </td> */}
        <td>{item.specialties.id || "N/A"}</td>
        <td className="hidden md:table-cell">
          {/* {item.doctor ? `${item.doctor.name}`:"N/A"} */}
          {/* {item.specialties
          .reduce(
            (acc: string[], specialty: Specialty & { doctors: Doctor[] }) =>
              acc.concat(
                specialty.doctors.map((doctor: Doctor) => doctor.name)
              ),
            []
          )
          .join(", ") || "N/A"} */}
        </td>
        <td>
        <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>
            {/* <td className="flex items-center gap-4 p-4">{item.specialty?.name}</td>
        <td>{item.department.name}</td>
        <td className="hidden md:table-cell">
          {item.doctor?.name}
        </td>
        <td>
           */}
           <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
          {role === "admin" || role ==="doctor" && (
              <>
                <FormContainer table="medical" type="update" data={item} />
                <FormContainer table="medical" type="delete" id={item.id} />
              </>
            )}
          </div>

          </div>
        </td>
      </tr>
    );
  };
  const { page, ...queryParams } = searchParams;

  console.log(queryParams, "queryParams");

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.MedicalWhereInput = {};

  query.department= {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "departmentId":
            query.departmentId = parseInt(value);
            break;
          case "doctorId":
            query.doctorId = value;
            break;
          case "search":
            query.OR = [
              { specialty: { name: { contains: value, mode: "insensitive" } } },
              { doctor: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.medical.findMany({
      where: query,
      include: {
        specialty: { select: { name: true } },
        department: { select: { name: true } },
        doctor: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.medical.count({ where: query }),
  ]);

  console.log(data, "data");

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Medicals</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role ==="doctor" && (
              <FormContainer table="medical" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};
export default MedicalListPage;



// import FormContainer from "@/components/FormContainer";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import { Specialty, Medical, Prisma, Doctor, Department } from "@prisma/client";
// import Image from "next/image";
// import { auth } from "@clerk/nextjs/server";

// type MedicalList = Medical & {
//   department: Department;
//   doctor: Doctor;
//   specialty: Specialty;
// };

// const ExamListPage = async ({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | undefined };
// }) => {
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;
//   const currentUserId = userId;

//   const columns = [
//     {
//       header: "Specialty",
//       accessor: "specialty",
//     },
//     {
//       header: "Department",
//       accessor: "department",
//     },
//     {
//       header: "Doctor",
//       accessor: "doctor",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Date",
//       accessor: "date",
//       className: "hidden md:table-cell",
//     },
//     ...(role === "admin" || role === "doctor"
//       ? [
//           {
//             header: "Actions",
//             accessor: "action",
//           },
//         ]
//       : []),
//   ];

//   const renderRow = (item: MedicalList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">{item.specialty.name}</td>
//       <td>{item.department.name}</td>
//       <td className="hidden md:table-cell">
//         {item.doctor.name + " " + item.doctor.surname}
//       </td>
//       <td className="hidden md:table-cell">
//         {new Intl.DateTimeFormat("en-US").format(item.startTime)}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {(role === "admin" || role === "doctor") && (
//             <>
//               <FormContainer table="medical" type="update" data={item} />
//               <FormContainer table="medical" type="delete" id={item.id} />
//             </>
//           )}
//         </div>
//       </td>
//     </tr>
//   );

//   const { page, ...queryParams } = searchParams;
//   const p = page ? parseInt(page) : 1;

//   // Filtering Query Based on Role and Search Parameters
//   const query: Prisma.MedicalWhereInput = {};

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value) {
//         switch (key) {
//           case "departmentId":
//             query.departmentId = parseInt(value);
//             break;
//           case "doctorId":
//             query.doctorId = value;
//             break;
//           case "search":
//             query.specialty = {
//               name: { contains: value, mode: "insensitive" },
//             };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   // Role-Based Access Control for Data Filtering
//   switch (role) {
//     case "admin":
//       break;
//     case "doctor":
//       query.doctorId = currentUserId!;
//       break;
//     case "patient":
//       query.department = {
//         patients: {
//           some: {
//             id: currentUserId!,
//           },
//         },
//       };
//       break;
//     case "parent":
//       query.department = {
//         patients: {
//           some: {
//             parentId: currentUserId!,
//           },
//         },
//       };
//       break;

//     default:
//       break;
//   }

//   // Fetch Data from Prisma
//   const [data, count] = await prisma.$transaction([
//     prisma.medical.findMany({
//       where: query,
//       include: {
//         specialty: { select: { name: true } },
//         department: { select: { name: true } },
//         doctor: { select: { name: true, surname: true } },
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (p - 1),
//     }),
//     prisma.medical.count({ where: query }),
//   ]);

//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* Top Section */}
//       <div className="flex items-center justify-between">
//         <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/filter.png" alt="Filter" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/sort.png" alt="Sort" width={14} height={14} />
//             </button>
//             {(role === "admin" || role === "doctor") && (
//               //   <FormContainer table="medical" type="create" />
//               <FormContainer table="medical" type="create" />
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Table Section */}
//       <Table columns={columns} renderRow={renderRow} data={data} />
//       {/* Pagination */}
//       <Pagination page={p} count={count} />
//     </div>
//   );
// };

// export default ExamListPage;

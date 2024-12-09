import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Department, Prisma, Doctor, Areas } from '@prisma/client';
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";


type DepartmentList = Department & { supervisor: Doctor;
  area:{tower:string; }
};

const DepartmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Department Name",
      accessor: "name",
    },
    {
      header: "Capacity",
      accessor: "capacity",
      className: "hidden md:table-cell",
    },
    {
      header: "Floor",
      accessor: "floor",
      className: "hidden md:table-cell",
    },{
      header: "Areas",
      accessor: "area",
      className: "hidden md:table-cell",
    },{
      header: "Lead Doctor",
      accessor: "lead doctor",
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

  const renderRow = (item: DepartmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      {/* <td className="hidden md:table-cell">{item.area?.tower}</td> */}
      <td className="hidden md:table-cell">{item.areasId}</td>

      <td className="hidden md:table-cell">{item.name[0]}</td>
     
      <td className="hidden md:table-cell">
        {item.supervisor.name}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="department" type="update" data={item} />
              <FormContainer table="department" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.DepartmentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.department.findMany({
      where: query,
      include: {
        supervisor: true,
        areas: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.department.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Departments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="department" type="create" />
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

export default DepartmentListPage;
//  import FormContainer from "@/components/FormContainer";
//  import Pagination from "@/components/Pagination";
//  import Table from "@/components/Table";
//  import TableSearch from "@/components/TableSearch";
//  import prisma from "@/lib/prisma";
//  import { ITEM_PER_PAGE } from "@/lib/settings";
//  import { Department, Prisma, Doctor} from "@prisma/client";
//  import Image from "next/image";
//  import { auth } from "@clerk/nextjs/server";
//  import { specialtiesData } from '../../../../lib/data';
//   import DoctorListPage from '../departments/page';

// type DepartmentListPage = Department & { supervisors: Doctor[] };

// const DepartmentListPage = async ({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | undefined };
// }) => {
//   const { sessionClaims } = auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   const columns = [
//          {
//            header: "Department Name",
//           accessor: "name",
//          },
//          {
//           header: "Capacity",
//            accessor: "capacity",
//            className: "hidden md:table-cell",
//      },
//          {
//            header: "Areas",
//            accessor: "area",
//            className: "hidden md:table-cell",
//          },
//         {
//            header: "Supervisor",
//           accessor: "supervisor",
//           className: "hidden md:table-cell",
//         },
//         ...(role === "admin"
//       ? [
//                {
//                  header: "Actions",
//                accessor: "action",
//               },
//              ]
//           : []),
//        ];

//   const renderRow = (item: DepartmentListPage) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">{item.name}</td>
//       <td className="hidden md:table-cell">{item.capacity}</td>
//       <td className="hidden md:table-cell">{item.name}</td>
//       <td className="hidden md:table-cell">
//         {item.supervisors?.map((doctor) => doctor.name).join(",")}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {role === "admin" && (
//             <>
//               <FormContainer table="department" type="update" data={item} />
//               <FormContainer table="department" type="delete" id={item.id} />
//             </>
//           )}
//         </div>
//       </td>
//     </tr>
//   );

//   const { page, ...queryParams } = searchParams;

//   const p = page ? parseInt(page) : 1;

//   // URL PARAMS CONDITION

//   const query: Prisma.DepartmentWhereInput = {};

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
//           case "search":
//             query.name = { contains: value, mode: "insensitive" };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//    const [data, count] = await prisma.$transaction([
//      prisma.department.findMany({
//        where: query,
//        include: {
//          supervisor: true,
//        },
//        take: ITEM_PER_PAGE,
//        skip: ITEM_PER_PAGE * (p - 1),
//      }),
//      prisma.department.count({ where: query }),
//    ]);

//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between">
//         <h1 className="hidden md:block text-lg font-semibold">
//           All Specialties
//         </h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {role === "admin" && (
//               <FormContainer table="department" type="create" />
//             )}
//           </div>
//         </div>
//       </div>
//       {/* LIST */}
//       <Table columns={columns} renderRow={renderRow} data={data} />
//       {/* PAGINATION */}
//       <Pagination page={p} count={count} />
//     </div>
//   );
// };

// export default DepartmentListPage;

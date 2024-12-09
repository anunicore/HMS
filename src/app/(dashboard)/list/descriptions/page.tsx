import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Department, Description, Prisma, Specialty, Doctor } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type DescriptionList = Description & {
  medical: {
    specialty: Specialty;
    department: Department;
    // doctor: Doctor;
  };
};

const DescriptionListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Specialties",
      accessor: "specialties",
    },
    {
      header: "Department",
      accessor: "department",
    },
    {
      header: "Drug Name",
      accessor: "name",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "doctor"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: DescriptionList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {item.medical.specialty?.name || "N/A"}
      </td>
      <td>{item.medical.department?.name || "N/A"}</td>
      <td className="flex items-center gap-4 p-4">{item.title || "N/A"}</td>
      {/* <td className="hidden md:table-cell">
        
        {item.medical.doctor.name + " " + item.medical.doctor.surname}
      </td> */}
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "doctor") && (
            <>
              <FormContainer table="description" type="update" data={item} />
              <FormContainer table="description" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.DescriptionWhereInput = {};

  query.medical = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "departmentId":
            query.medical.departmentId = parseInt(value);
            break;
          case "doctorId":
            query.medical.doctorId = value;
            break;
          case "search":
            query.medical.specialty = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  switch (role) {
    case "admin":
      break;
    case "doctor":
      query.medical.doctorId = currentUserId!;
      break;
    case "patient":
      query.medical.department = {
        patients: {
          some: {
            id: currentUserId!,
          },
        },
      };
      break;
    case "parent":
      query.medical.department = {
        patients: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.description.findMany({
      where: query,
      include: {
        medical: {
          select: {
            specialty: { select: { name: true } },
            doctor: { select: { name: true, surname: true } },
            department: { select: { name: true } },
            
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.description.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Medical/Medicine Description</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {
            (role === "admin" || role === "doctor") && (
              <FormContainer table="description" type="create" />
              
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

export default DescriptionListPage;

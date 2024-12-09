import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";

import { auth } from "@clerk/nextjs/server";

type PrescriptionList = {
  id: number;
  title: string;
  patientName: string;
  patientSurname: string;
  doctorName: string;
  doctorSurname: string;
  score: number;
  startTime: Date;
  patientId: String;
  startDate: Date;
  
};

const PrescriptionListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Patient",
      accessor: "patient",
    },
    {
      header: "Quantity",
      accessor: "quantity",
      className: "hidden md:table-cell",
    },
    {
      header: "Doctor",
      accessor: "doctor",
      className: "hidden md:table-cell",
    },
    {
      header: "Department",
      accessor: "department",
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

  const renderRow = (item: PrescriptionList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.patientName + " " + item.patientName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">
        {item.doctorName + " " + item.doctorSurname}
      </td>
      <td className="hidden md:table-cell">{item.patientId}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "doctor") && (
            <>
              <FormContainer table="prescription" type="update" data={item} />
              <FormContainer table="prescription" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.PrescriptionWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "patientId":
            query.patientId = value;
            break;
          case "search":
            query.OR = [
              { description: { title: { contains: value, mode: "insensitive" } } },
              { patient: { name: { contains: value, mode: "insensitive" } } },
            ];
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
      query.OR = [
        { description: { medical: { doctorId: currentUserId! } } },
        { medicalResult: { medical: { doctorId: currentUserId! } } },
      ];
      break;

    case "patient":
      query.patientId = currentUserId!;
      break;

    case "parent":
      query.patient = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.prescription.findMany({
      where: query,
      include: {
        patient: { select: { name: true, surname: true } },
        description: {
          include: {
            medical: {
              select: {
                department: { select: { name: true } },
                doctor: { select: { name: true, surname: true } },
              },
            },
          },
        },
        medicalResult: {
          include: {
            medical: {
              select: {
                department: { select: { name: true } },
                doctor: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.prescription.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assessment = item.description || item.medicalResult;

    if (!assessment) return null;

    const isMedicalDescription = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.title,
      patientName: item.patient.name,
      patientSurname: item.patient.surname,
      doctorName: assessment.medical.doctor.name,
      doctorSurname: assessment.medical.doctor.surname,
      score: item.score,
      className: assessment.medical.department.name,
      startTime: isMedicalDescription ? assessment.startTime : assessment.startDate,
    };
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Medical Prescription</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "doctor") && (
              <FormContainer table="prescription" type="create" />
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

export default PrescriptionListPage;

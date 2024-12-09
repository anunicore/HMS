"use client";
import {
  deleteDepartment,
  deleteDescription,
  deletePatient,
  deleteSpecialty,
  deleteDoctor,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  specialty: deleteSpecialty,
  department: deleteDepartment,
  doctor: deleteDoctor,
  patient: deletePatient,
  description: deleteDescription,
  // TODO: OTHER DELETE ACTIONS
  parent: deleteSpecialty,
  medical: deleteSpecialty,
  assignment: deleteSpecialty,
  prescription: deleteSpecialty,
  attendance: deleteSpecialty,
  event: deleteSpecialty,
  announcement: deleteSpecialty,
};

// USE LAZY LOADING

// import DoctorForm from "./forms/DoctorForm";
// import PatientForm from "./forms/PatientForm";
//import DepartmentForm from "./forms/DepartmentForm";

const DoctorForm = dynamic(() => import("./forms/DoctorForm"), {
  loading: () => <h1>Loading...</h1>,
});
// const PatientForm = dynamic(() => import("./forms/PatientForm"), {
//   loading: () => <h1>Loading...</h1>,
// });
const PatientForm = dynamic(() => import("./forms/PatientForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SpecialtyForm = dynamic(() => import("./forms/SpecialtyForm"), {
  loading: () => <h1>Loading...</h1>,
});
const DepartmentForm = dynamic(() => import("./forms/DepartmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MedicalDescriptionForm = dynamic(
  () => import("./forms/DescriptionForm"),
  {
    loading: () => <h1>Loading...</h1>,
  }
);
// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  specialty: (setOpen, type, data, relatedData) => (
    <SpecialtyForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  department: (setOpen, type, data, relatedData) => (
    <DepartmentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  doctor: (setOpen, type, data, relatedData) => (
    <DoctorForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  patient: (setOpen, type, data, relatedData) => (
    <PatientForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  medicaldescription: (setOpen, type, data, relatedData) => (
    <MedicalDescriptionForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
    // TODO OTHER LIST ITEMS
  ),
};

const getFormComponent = (key: string) => {
  if (forms[key]) {
    return forms[key];
  }
  // eslint-disable-next-line react/display-name
  return () => <>Form not found!</>; // Default component for invalid keys
};
const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, router, table]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      getFormComponent(table)(setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;

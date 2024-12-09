"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  patientSchema,
  PatientSchema,
  doctorSchema,
  DoctorSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createPatient,
  createDoctor,
  updatePatient,
  updateDoctor,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { Area } from "recharts";

const PatientForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientSchema>({
    defaultValues: { areasId: 1 },
    resolver: zodResolver(patientSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createPatient : updatePatient,
    {
      success: false,
      error: false,
    }
  );

  console.log(data, "dataProp");
  const onSubmit = handleSubmit((data) => {
    console.log("hello");
    console.log(data, "dataSubmit");
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  // useEffect(()=>{
  //   if(data?.areasId){
  //     setValue("areasId", data?.areasId);
  //   }
  // }, [data?.areasId, setValue])

  useEffect(() => {
    if (state.success) {
      toast(`Patient has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  let { areas, departments, specialty } = relatedData || {};
  // console.log("relatedData", relatedData);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new patient" : "Update the patient"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <CldUploadWidget
        uploadPreset="healthcare"
        onSuccess={(medicalprescription, { widget }) => {
          setImg(medicalprescription.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src="/upload.png" alt="" width={28} height={28} />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />
        <InputField
          label="Parent Id"
          name="parentId"
          defaultValue={data?.parentId}
          register={register}
          error={errors.parentId}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Areas</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("areasId")}
            defaultValue={data?.areasId}
          >{relatedData.areas ?? [] > 0 ? (
            relatedData.areas.map((areas: { id: number; name: string }) => (
              <option value={areas.name.toString()} key={areas.id}>
                {areas.name}
              </option>
            ))
          ) : (
            <option value="">No areas available</option>
          )}
          </select>
          {errors.areasId?.message && (
            <p className="text-xs text-red-400">
              {errors.areasId.message.toString()}
            </p>
          )}
        </div> */}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Departments</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("departmentId", { valueAsNumber: true })}
            defaultValue={data?.departmentId}
          >
            {(relatedData?.departments).length > 0 ? (
              relatedData?.departments.map(
                (department: { id: number; name: String }) => (
                  <option value={department.id.toString()} key={department.id}>
                    {department.name}
                  </option>
                )
              )
            ) : (
              <option disabled>Loading departments...</option>
            )}
          </select>
          {errors.departmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.departmentId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button
        onClick={(e) => {
          console.log("here", errors);
          e.preventDefault();
          onSubmit();
        }}
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PatientForm;

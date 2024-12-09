import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "doctorId" | "departmentId";
  id: string | number;
}) => {
  const dataRes = await prisma.medical.findMany({
    where: {
      ...(type === "doctorId"
        ? { doctorId: id as string }
        : { departmentId: id as number }),
    },
  });

  const data = dataRes.map((medical) => ({
    title: medical.name,
    start: medical.startTime,
    end: medical.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;

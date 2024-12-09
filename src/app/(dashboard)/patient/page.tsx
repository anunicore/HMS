import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const PatientPage = async () => {
  const { userId } = auth();

  const departmentItem = await prisma.department.findMany({
    where: {
      patients: { some: { id: userId! } },
    },
  });

  console.log(departmentItem);
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          {departmentItem.length > 0 ? (
            <BigCalendarContainer
              type="departmentId"
              id={departmentItem[0].id}
            />
          ) : (
            <p>No department schedule available.</p>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default PatientPage;

import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Doctors",
        href: "/list/doctors",
        visible: ["admin", "doctor"],
      },
      {
        icon: "/student.png",
        label: "Patients",
        href: "/list/patients",
        visible: ["admin", "doctor"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "doctor"],
      },
      {
        icon: "/subject.png",
        label: "Specialties",
        href: "/list/specialties",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Departments",
        href: "/list/departments",
        visible: ["admin", "doctor"],
      },
      {
        icon: "/lesson.png",
        label: "Medicals",
        href: "/list/medicals",
        visible: ["admin", "doctor"],
      },
      {
        icon: "/exam.png",
        label: "Medical Descriptions",
        href: "/list/descriptions",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Medical Results",
        href: "/list/medicalresults",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/result.png",
        label: "Medical Prescriptions",
        href: "/list/prescriptions",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "doctor", "patient", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "doctor", "patient", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "doctor", "patient", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;

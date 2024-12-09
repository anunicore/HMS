// import { Day, PrismaClient, UserSex, Description } from "@prisma/client";
// const prisma = new PrismaClient();

// // async function main() {
// //   // ADMIN
// //   await prisma.admin.create({
// //     data: {
// //       username: "Admin Name",
// //     },
// //   });
// //   await prisma.admin.create({
// //     data: {
// //       username: "thaikimxuanquynh",
// //     },
// //   });
// async function main() {
//   // Clear existing data
//   await clearDatabase();

//   // ADMIN
//   await prisma.admin.create({
//     data: {
//       username: "Admin Name",
//     },
//   });
//   await prisma.admin.create({
//     data: {
//       username: "thaikimxuanquynh",
//     },
//   });

//   async function clearDatabase() {
//     try {
//       // Delete in reverse order of dependencies
//       await prisma.attendance.deleteMany({});
//       await prisma.prescription.deleteMany({});
//       await prisma.medicalResult.deleteMany({});
//       await prisma.description.deleteMany({});
//       await prisma.patient.deleteMany({});
//       await prisma.parent.deleteMany({});
//       await prisma.doctor.deleteMany({});
//       await prisma.specialty.deleteMany({});
//       await prisma.department.deleteMany({});
//       await prisma.areas.deleteMany({});
//       await prisma.admin.deleteMany({});
//       console.log("Database cleared successfully!");
//     } catch (error) {
//       console.error("Error clearing database:", error);
//     } finally {
//       await prisma.$disconnect();
//     }
//   }

//   clearDatabase();

//   // Areas
//   // for (let i = 1; i <= 6; i++) {
//   //   await prisma.areas.create({
//   //     data: {
//   //       tower: `Block${i}`,
//   //     },
//   //   });
//   // }

//   // department
  
  
//   // for (let i = 1; i <= 10; i++) {
//   //   for (const suffix of ["A", "B"]) {
//   //     await prisma.department.create({
//   //       data: {
//   //         name: `${i}${suffix}`, // Tạo tên như 1A, 1B, 2A, 2B...
//   //         areasId: i,
//   //         capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15, // Giá trị ngẫu nhiên từ 15 đến 20
//   //       },
//   //     });
//   //   }
//   // }
//   for (let i = 1; i <= 10; i++) {
//     const areaId = (i % 5) + 1; // Example: cycling through areaId values (1-5)
  
//     // Check if the area exists in the database
//     const areaExists = await prisma.areas.findUnique({
//       where: { id: areaId },
//     });
  
//     if (!areaExists) {
//       console.log(`Area with ID ${areaId} does not exist.`);
//       continue; // Skip this iteration if the area does not exist
//     }
  
//     // Create the department only if the area exists
//     await prisma.department.create({
//       data: {
//         name: `Department ${i}`,
        
//         capacity: 50,  // Adjust as needed
//         areasId: i,  // Foreign key
//       },
//     });
//   }
  
//   // specialty
//   const specialtyData = [
//     { name: "Heart Failure Management" },
//     { name: "Electrophysiology" },
//     { name: "Stroke Management" },
//     { name: "Epilepsy" },
//     { name: "Movement Disorders" },
//     { name: "Medical Oncology" },
//     { name: "Surgical Oncology" },
//     { name: "Radiation Oncology " },
//     { name: "Radiation Oncology" },
//     { name: "Neonatology" },
//   ];
//   for (const specialty of specialtyData) {
//     await prisma.specialty.create({ data: specialty });
//   }


//   // Areas
//   const areasData = [
//     { id: 1, tower: "Tower A" },
//     { id: 2, tower: "Tower B" },
//     { id: 3, tower: "Tower C" },
//     { id: 4, tower: "Tower D" },
//     { id: 5, tower: "Tower E" },
//   ];
//   for (const area of areasData) {
//     try {
//       await prisma.areas.create({ data: area });
//       console.log(`Successfully created area with id: ${area.id}`);
//     } catch (error) {
//       console.error(`Error creating area with id: ${area.id}`, error);
//     }
//   }
//   const allAreas = await prisma.areas.findMany();
//   console.log("All created areas:", allAreas);
  
//   const departmentsData = [
//     { name: "Cardiology", capacity:50, areasId:1 },
//     { name: "Neurology", capacity:40, areasId:1},
//     { name: "Oncology", capacity:40, areasId:2 },
//     { name: "Pediatrics",capacity:20, areasId:2 },
//     { name: "Gastroenterology",capacity:32, areasId:3 },
//     { name: "Vascular Surgeon",capacity:20, areasId:3 },
//     { name: "Emergency Medicine",capacity:40, areasId:3 },
//     { name: "Radiology", capacity:40, areasId:4 },
//     { name: "Pharmacist",capacity:40, areasId:4 },
//     { name: "Armetric",capacity:40, areasId:2 },
//   ];
 
//   for (const department of departmentsData) {
//     try {
//       await prisma.department.create({
//         data: department,
//       });
//       console.log(`Successfully created department: ${department.name}`);
//     } catch (error) {
//       console.error(
//         `Error creating department: ${department.name} with areasId: ${department.areasId}`,
//         error
//       );
//     }
//     // Fetch departments to ensure they exist
//   const allDepartments = await prisma.department.findMany();
//   console.log("All departments:", allDepartments);
 
//   // doctor --30/11 7:02PM 
//   // for (let i = 1; i <= 15; i++) {
//   //   await prisma.doctor.create({
//   //     data: {
//   //       id: `doctor${i}`, // Unique ID for the doctor
//   //       username: `doctor${i}`,
//   //       name: `TName${i}`,
//   //       surname: `TSurname${i}`,
//   //       email: `doctor${i}@example.com`,
//   //       phone: `(+84)123-456-789${i}`,
//   //       address: `Address${i}`,
//   //       qualifications: "MD",
//   //       sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//   //       specialties: { connect: [{ id: (i % 10) + 1 }] },
//   //       departments: { connect: [{ id: (i % 6) + 1 }] },
//   //       birthday: new Date(
//   //         new Date().setFullYear(new Date().getFullYear() - 30)
//   //       ),
//   //     },
//   //   });
//   // }
//   for (let i = 1; i <= 15; i++) {
//     try {
//       // Use existing department IDs to create doctors
//       const departmentId = (i % allDepartments.length) + 1; // Cycle through department IDs

//       const departmentExists = allDepartments.find((dept) => dept.id === departmentId);
//       if (!departmentExists) {
//         console.error(`Department with ID ${departmentId} does not exist. Skipping doctor creation.`);
//         continue;
//       }

//       await prisma.doctor.create({
//         data: {
//           id: `doctor${i}`,
//           username: `doctor${i}`,
//           name: `TName${i}`,
//           surname: `TSurname${i}`,
//           email: `doctor${i}@example.com`,
//           phone: `(+84)123-456-789${i}`,
//           address: `Address${i}`,
//           qualifications: "MD",
//           sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//           departments: { connect: [{ id: departmentId }] },
//           birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
//         },
//       });
//       console.log(`Successfully created doctor: doctor${i}`);
//     } catch (error) {
//       console.error(`Error creating doctor: doctor${i}`, error);
//     }
//   }
//   // Medical
//   for (let i = 1; i <= 30; i++) {
//     await prisma.medical.create({
//       data: {
//         name: `Medical${i}`,
//         day: Day[
//           Object.keys(Day)[
//             Math.floor(Math.random() * Object.keys(Day).length)
//           ] as keyof typeof Day
//         ],
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
//         specialtyId: (i % 10) + 1,
//         departmentId: (i % 6) + 1,
//         doctorId: `doctor${(i % 15) + 1}`,
//       },
//     });
//   }

//   // PARENT
//   for (let i = 1; i <= 25; i++) {
//     await prisma.parent.create({
//       data: {
//         id: `parentId${i}`,
//         username: `parentId${i}`,
//         name: `PName ${i}`,
//         surname: `PSurname ${i}`,
//         email: `parent${i}@example.com`,
//         phone: `(+84)123-456-789${i}`,
//         address: `Address${i}`,
//       },
//     });
//   }

//   // patient
//   for (let i = 1; i <= 50; i++) {
//     await prisma.patient.create({
//       data: {
//         id: `patient${i}`,
//         username: `patient${i}`,
//         name: `SName${i}`,
//         surname: `SSurname ${i}`,
//         email: `patient${i}@example.com`,
//         phone: `(+84)987-654-321${i}`,
//         address: `Address${i}`,
//         bloodType: "O-",
//         sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//         parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
//         areasId: (i % 6) + 1,
//         departmentId: (i % 6) + 1,
//         birthday: new Date(
//           new Date().setFullYear(new Date().getFullYear() - 10)
//         ),
//       },
//     });
//   }
//   }
//   for (let i = 1; i <= 10; i++) {
//     await prisma.description.create({
//       data: {
//         title: `Description ${i}`,
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
//         medicalId: (i % 30) + 1,
//       },
//     });
//   }

//   // medicalResult
//   for (let i = 1; i <= 10; i++) {
//     await prisma.medicalResult.create({
//       data: {
//         title: `Medical Results ${i}`,
//         startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
//         dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//         medicalId: (i % 30) + 1,
//       },
//     });
//   }

//   // Medical Prescription
//   // for (let i = 1; i <= 10; i++) {
//   //   await prisma.prescription.create({
//   //     data: {
//   //       score: 90,
//   //       patientId: `patient${i}`,
//   //       ...(i <= 5 ? { descriptionId: i } : { medicalResultId: i - 5 }),
//   //     },
//   //   });
//   // }
//   // for (let i = 1; i <= 10; i++) {
//   //   await prisma.prescription.create({
//   //     data: {
//   //       score: 90,
//   //       patientId: `patient${i}`,
//   //       ...(i <= 5 ? {descriptionId: i } : { medicalResultId: i - 5 }),
//   //       // Add any other required fields:
//   //       title: `Prescription ${i}`, // Example field

//   //     },
//   //   });
//   // }

//   // ATTENDANCE
//   for (let i = 1; i <= 10; i++) {
//     await prisma.attendance.create({
//       data: {
//         date: new Date(),
//         present: true,
//         patientId: `patient${i}`,
//         medicalId: (i % 30) + 1,
//       },
//     });
//   }

//   // EVENT
//   for (let i = 1; i <= 10; i++) {  // Loop to create 10 events
//     await prisma.event.create({
//       data: {
//         title: `Event ${i}`,
//         description: `Description for Event ${i}`,
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
//         departmentId: (i % 5) + 1,  // Assuming you have 5 departments
//       },
//     });
//   }
  

//   // ANNOUNCEMENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.announcement.create({
//       data: {
//         title: `Announcement ${i}`,
//         description: `Description for Announcement ${i}`,
//         date: new Date(),
//         departmentId: (i % 5) + 1,
//       },
//     });
//   }

//   console.log("Seeding completed successfully.");
// }

// // Properly call the main function and handle disconnection
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
import { Day, PrismaClient, UserSex } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete in reverse order of dependencies
    await prisma.attendance.deleteMany({});
    await prisma.prescription.deleteMany({});
    await prisma.medicalResult.deleteMany({});
    await prisma.description.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.parent.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.specialty.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.areas.deleteMany({});
    await prisma.admin.deleteMany({});
    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}

async function main() {
  // Clear existing data
  await clearDatabase();

  // Create Admins
  await prisma.admin.create({ data: { username: "Admin Name" } });
  await prisma.admin.create({ data: { username: "thaikimxuanquynh" } });

  // Create Areas
  const areasData = [
    { id: 1, tower: "Floor 1" },
    { id: 2, tower: "Floor 2" },
    { id: 3, tower: "Floor 3" },
    { id: 4, tower: "Floor 4" },
    { id: 5, tower: "Floor 5" },
    { id: 6, tower: "Floor 6" },
    { id: 7, tower: "Floor 7" },
  ];

  for (const area of areasData) {
    try {
      await prisma.areas.create({ data: area });
      console.log(`Successfully created area with id: ${area.id}`);
    } catch (error) {
      console.error(`Error creating area with id: ${area.id}`, error);
    }
  }

 const specialtyData = [
        { name: "Heart Failure Management" },
        { name: "Electrophysiology" },
        { name: "Stroke Management" },
        { name: "Epilepsy" },
        { name: "Movement Disorders" },
        { name: "Medical Oncology" },
        { name: "Surgical Oncology" },
        { name: "Radiation Oncology " },
        { name: "Radiation Oncology" },
        { name: "Neonatology" },
      ];
      for (const specialty of specialtyData) {
        await prisma.specialty.create({ data: specialty });
      }
  // Create Departments
  const departmentsData = [
    { id: 1, name: "Cardiology", capacity: 50, areasId: 1 },
    { id: 2, name: "Neurology", capacity: 40, areasId: 1 },
    { id: 3, name: "Oncology", capacity: 40, areasId: 2 },
    { id: 4, name: "Pediatrics", capacity: 20, areasId: 2 },
    { id: 5, name: "Gastroenterology", capacity: 32, areasId: 3 },
    { id: 6, name: "Vascular Surgeon", capacity: 20, areasId: 3 },
    { id: 7, name: "Emergency Medicine", capacity: 40, areasId: 3 },
    { id: 8, name: "Radiology", capacity: 40, areasId: 4 },
    { id: 9, name: "Pharmacist", capacity: 40, areasId: 4 },
    { id: 10, name: "Armetric", capacity: 40, areasId: 5 },
  ];

  for (const department of departmentsData) {
    try {
      await prisma.department.create({ data: department });
      console.log(`Successfully created department: ${department.name}`);
    } catch (error) {
      console.error(`Error creating department: ${department.name}`, error);
    }
  }

  // Fetch and log created departments
  const allDepartments = await prisma.department.findMany();
  console.log("All departments:", allDepartments);
// Create PARENT
for (let i = 1; i <= 25; i++) {
  await prisma.parent.create({
    data: {
      id: `parentId${i}`,
      username: `parentId${i}`,
      name: `PName ${i}`,
      surname: `PSurname ${i}`,
      email: `parent${i}@example.com`,
      phone: `123-456-789${i}`,
      address: `Address${i}`,
    },
  });
}

// Patient
for (let i = 1; i <= 50; i++) {
  await prisma.patient.create({
    data: {
      id: `patient${i}`, 
      username: `patient${i}`, 
      name: `SName${i}`,
      surname: `SSurname ${i}`,
      email: `patient${i}@example.com`,
      phone: `987-654-321${i}`,
      address: `Address${i}`,
      bloodType: "O-",
      sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
       parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, 
     
      areasId: (i % 6) + 1, 
      departmentId: (i % 6) + 1, 
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
    },
  });
}

  // Create Doctors
  for (let i = 1; i <= 15; i++) {
    try {
      // Use existing department IDs to create doctors
      const departmentId = (i % allDepartments.length) + 1; // Cycle through department IDs

      const departmentExists = allDepartments.find((dept) => dept.id === departmentId);
      if (!departmentExists) {
        console.error(`Department with ID ${departmentId} does not exist. Skipping doctor creation.`);
        continue;
      }

      await prisma.doctor.create({
        data: {
          id: `doctor${i}`,
          username: `doctor${i}`,
          name: `TName${i}`,
          surname: `TSurname${i}`,
          email: `doctor${i}@example.com`,
          phone: `(+84)123-456-789${i}`,
          address: `Address${i}`,
          qualifications: "MD",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          departments: { connect: [{ id: departmentId }] },
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
        },
      });
      console.log(`Successfully created doctor: doctor${i}`);
    } catch (error) {
      console.error(`Error creating doctor: doctor${i}`, error);
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_parentId_fkey";

-- CreateTable
CREATE TABLE "_ParentToPatient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ParentToPatient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ParentToPatient_B_index" ON "_ParentToPatient"("B");

-- AddForeignKey
ALTER TABLE "_ParentToPatient" ADD CONSTRAINT "_ParentToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentToPatient" ADD CONSTRAINT "_ParentToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

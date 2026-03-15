-- AlterTable
ALTER TABLE "PlannerRun"
ADD COLUMN "saved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "name" TEXT;

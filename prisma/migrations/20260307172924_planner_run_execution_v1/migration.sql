/*
  Warnings:

  - Added the required column `sequence` to the `PlannerRunToolResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ToolExecutionStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'PARTIAL');

-- DropIndex
DROP INDEX "PlannerRun_startedAt_idx";

-- DropIndex
DROP INDEX "PlannerRun_status_createdAt_idx";

-- DropIndex
DROP INDEX "PlannerRunError_plannerRunId_createdAt_idx";

-- DropIndex
DROP INDEX "PlannerRunToolResult_plannerRunId_createdAt_idx";

-- DropIndex
DROP INDEX "PlannerRunToolResult_plannerRunId_toolName_idx";

-- AlterTable
ALTER TABLE "PlannerRun" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "destination" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "groupType" TEXT,
ADD COLUMN     "modelName" TEXT,
ADD COLUMN     "orchestratorVersion" TEXT,
ADD COLUMN     "promptVersion" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "travelStyle" TEXT,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PlannerRunError" ADD COLUMN     "errorType" TEXT,
ADD COLUMN     "stepName" TEXT;

-- AlterTable
ALTER TABLE "PlannerRunOutput" ADD COLUMN     "outputFormat" TEXT;

-- AlterTable
ALTER TABLE "PlannerRunToolResult" ADD COLUMN     "latencyMs" INTEGER,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "sequence" INTEGER NOT NULL,
ADD COLUMN     "status" "ToolExecutionStatus" NOT NULL DEFAULT 'SUCCEEDED',
ADD COLUMN     "toolCategory" TEXT;

-- CreateIndex
CREATE INDEX "PlannerRun_status_idx" ON "PlannerRun"("status");

-- CreateIndex
CREATE INDEX "PlannerRun_destination_idx" ON "PlannerRun"("destination");

-- CreateIndex
CREATE INDEX "PlannerRun_createdAt_idx" ON "PlannerRun"("createdAt");

-- CreateIndex
CREATE INDEX "PlannerRun_promptVersion_idx" ON "PlannerRun"("promptVersion");

-- CreateIndex
CREATE INDEX "PlannerRunError_plannerRunId_idx" ON "PlannerRunError"("plannerRunId");

-- CreateIndex
CREATE INDEX "PlannerRunError_errorType_idx" ON "PlannerRunError"("errorType");

-- CreateIndex
CREATE INDEX "PlannerRunError_stepName_idx" ON "PlannerRunError"("stepName");

-- CreateIndex
CREATE INDEX "PlannerRunToolResult_plannerRunId_idx" ON "PlannerRunToolResult"("plannerRunId");

-- CreateIndex
CREATE INDEX "PlannerRunToolResult_toolName_idx" ON "PlannerRunToolResult"("toolName");

-- CreateIndex
CREATE INDEX "PlannerRunToolResult_toolCategory_idx" ON "PlannerRunToolResult"("toolCategory");

-- CreateIndex
CREATE INDEX "PlannerRunToolResult_sequence_idx" ON "PlannerRunToolResult"("sequence");

-- CreateEnum
CREATE TYPE "PlannerRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "PlannerRun" (
    "id" UUID NOT NULL,
    "status" "PlannerRunStatus" NOT NULL DEFAULT 'PENDING',
    "requestId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannerRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerRunInput" (
    "id" UUID NOT NULL,
    "plannerRunId" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlannerRunInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerRunToolResult" (
    "id" UUID NOT NULL,
    "plannerRunId" UUID NOT NULL,
    "toolName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlannerRunToolResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerRunOutput" (
    "id" UUID NOT NULL,
    "plannerRunId" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlannerRunOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerRunError" (
    "id" UUID NOT NULL,
    "plannerRunId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlannerRunError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlannerRun_requestId_key" ON "PlannerRun"("requestId");

-- CreateIndex
CREATE INDEX "PlannerRun_status_createdAt_idx" ON "PlannerRun"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PlannerRun_startedAt_idx" ON "PlannerRun"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlannerRunInput_plannerRunId_key" ON "PlannerRunInput"("plannerRunId");

-- CreateIndex
CREATE INDEX "PlannerRunToolResult_plannerRunId_createdAt_idx" ON "PlannerRunToolResult"("plannerRunId", "createdAt");

-- CreateIndex
CREATE INDEX "PlannerRunToolResult_plannerRunId_toolName_idx" ON "PlannerRunToolResult"("plannerRunId", "toolName");

-- CreateIndex
CREATE UNIQUE INDEX "PlannerRunOutput_plannerRunId_key" ON "PlannerRunOutput"("plannerRunId");

-- CreateIndex
CREATE INDEX "PlannerRunError_plannerRunId_createdAt_idx" ON "PlannerRunError"("plannerRunId", "createdAt");

-- AddForeignKey
ALTER TABLE "PlannerRunInput" ADD CONSTRAINT "PlannerRunInput_plannerRunId_fkey" FOREIGN KEY ("plannerRunId") REFERENCES "PlannerRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerRunToolResult" ADD CONSTRAINT "PlannerRunToolResult_plannerRunId_fkey" FOREIGN KEY ("plannerRunId") REFERENCES "PlannerRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerRunOutput" ADD CONSTRAINT "PlannerRunOutput_plannerRunId_fkey" FOREIGN KEY ("plannerRunId") REFERENCES "PlannerRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerRunError" ADD CONSTRAINT "PlannerRunError_plannerRunId_fkey" FOREIGN KEY ("plannerRunId") REFERENCES "PlannerRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

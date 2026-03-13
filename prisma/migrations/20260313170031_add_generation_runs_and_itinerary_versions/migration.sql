-- CreateEnum
CREATE TYPE "GenerationRunStatus" AS ENUM ('pending', 'running', 'done', 'error');

-- CreateTable
CREATE TABLE "itinerary_versions" (
    "id" UUID NOT NULL,
    "travelPlanId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generationRunId" UUID NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "itinerary_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation_runs" (
    "id" UUID NOT NULL,
    "travelPlanId" UUID NOT NULL,
    "status" "GenerationRunStatus" NOT NULL DEFAULT 'pending',
    "inputSnapshot" JSONB NOT NULL,
    "providerData" JSONB,
    "modelProvider" TEXT,
    "modelName" TEXT,
    "modelVersion" TEXT,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "errorPayload" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_versions_generationRunId_key" ON "itinerary_versions"("generationRunId");

-- CreateIndex
CREATE INDEX "itinerary_versions_travelPlanId_generatedAt_idx" ON "itinerary_versions"("travelPlanId", "generatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_versions_travelPlanId_versionNumber_key" ON "itinerary_versions"("travelPlanId", "versionNumber");

-- CreateIndex
CREATE INDEX "generation_runs_travelPlanId_createdAt_idx" ON "generation_runs"("travelPlanId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "generation_runs_status_createdAt_idx" ON "generation_runs"("status", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "itinerary_versions" ADD CONSTRAINT "itinerary_versions_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_versions" ADD CONSTRAINT "itinerary_versions_generationRunId_fkey" FOREIGN KEY ("generationRunId") REFERENCES "generation_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_runs" ADD CONSTRAINT "generation_runs_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

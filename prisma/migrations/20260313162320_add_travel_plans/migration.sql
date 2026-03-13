-- CreateEnum
CREATE TYPE "TravelPlanStatus" AS ENUM ('DRAFT', 'GENERATING', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "travel_plans" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TravelPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "input" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "travel_plans_updatedAt_idx" ON "travel_plans"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "travel_plans_userId_updatedAt_idx" ON "travel_plans"("userId", "updatedAt" DESC);

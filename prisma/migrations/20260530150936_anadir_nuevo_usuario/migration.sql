-- CreateTable
CREATE TABLE "users_schema"."Director" (
    "director_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "speciality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("director_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Director_user_id_key" ON "users_schema"."Director"("user_id");

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users_schema";

-- CreateTable
CREATE TABLE "users_schema"."Student" (
    "student_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "parent_id" UUID NOT NULL,
    "id_section" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "users_schema"."Parent" (
    "parent_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("parent_id")
);

-- CreateTable
CREATE TABLE "users_schema"."Teacher" (
    "teacher_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "speciality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "users_schema"."Admin" (
    "admin_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_id_key" ON "users_schema"."Student"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_user_id_key" ON "users_schema"."Parent"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_phone_key" ON "users_schema"."Parent"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_user_id_key" ON "users_schema"."Teacher"("user_id");

-- AddForeignKey
ALTER TABLE "users_schema"."Student" ADD CONSTRAINT "Student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users_schema"."Parent"("parent_id") ON DELETE RESTRICT ON UPDATE CASCADE;

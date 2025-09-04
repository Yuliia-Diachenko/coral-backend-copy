-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phone" TEXT;

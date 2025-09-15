-- CreateEnum
CREATE TYPE "public"."InviteOption" AS ENUM ('INVITE', 'NO_EMAIL');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "inviteOption" "public"."InviteOption" NOT NULL DEFAULT 'INVITE';

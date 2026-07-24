-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "heroImagePosition" TEXT NOT NULL DEFAULT 'right',
ADD COLUMN     "heroImageRing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heroImageShape" TEXT NOT NULL DEFAULT 'square';

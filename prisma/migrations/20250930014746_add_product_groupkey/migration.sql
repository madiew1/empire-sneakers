-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "groupKey" VARCHAR(191);

-- CreateIndex
CREATE INDEX "Product_groupKey_idx" ON "Product"("groupKey");

import prisma from "../../src/config/db.js";

export async function cleanDatabase() {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.rfq.deleteMany();
  await prisma.user.deleteMany();
  // console.log("🧹 cleaning test database");
}

import prisma from "../../src/config/db.js";

export async function cleanDatabase() {
  await prisma.rfq.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 cleaning test database");
}

import prisma from "../src/config/db.js";

async function checkTable(name: string, check: () => Promise<number>) {
  try {
    const count = await check();
    console.log(`✓ ${name}: ${count}`);
  } catch (error) {
    console.error(
      `❌ ${name} check failed:`,
      error instanceof Error ? error.message : error,
    );
  }
}

async function checkDatabase() {
  try {
    console.log("Checking B2B database...\n");

    await checkTable("Users", () => prisma.user.count());

    await checkTable("Companies", () => prisma.companyProfile.count());

    await checkTable("Products", () => prisma.product.count());

    await checkTable("RFQs", () => prisma.rfq.count());

    await checkTable("Quotations", () => prisma.quotation.count());

    await checkTable("Conversations", () => prisma.conversation.count());

    await checkTable("Messages", () => prisma.message.count());

    console.log("\n✅ Database check completed");
  } catch (error) {
    console.error(
      "❌ Database connection failed:",
      error instanceof Error ? error.message : error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

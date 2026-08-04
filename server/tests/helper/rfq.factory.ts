import prisma from "../../src/config/db";

export async function createRfq(userId: string, overrides = {}) {
  const rfq = await prisma.rfq.create({
    data: {
      title: "Need laptops",
      category: "Electronics",
      quantity: 100,
      budget: 50000,
      deadline: new Date("2026-12-31"),
      description: "Looking for laptop supplier",
      status: "published",

      userId,

      ...overrides,
    },
  });

  return rfq;
}

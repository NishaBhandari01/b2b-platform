import prisma from "./src/config/db.js";

const user = await prisma.user.upsert({
  where: { email: "rfqtester@example.com" },
  update: {},
  create: {
    id: "cm-test-user",
    name: "RFQ Tester",
    email: "rfqtester@example.com",
    password: "hashed",
    role: "buyer",
  },
});

const rfq = await prisma.rfq.create({
  data: {
    title: "Test RFQ",
    category: "Testing",
    quantity: 5,
    budget: 1000,
    deadline: new Date("2030-01-01T00:00:00.000Z"),
    description: "Validation test for RFQ creation",
    userId: user.id,
  },
});

console.log(JSON.stringify({ userId: user.id, rfqId: rfq.id }));
await prisma.$disconnect();

import pkg from "@prisma/client";

// Some build setups/types may not expose PrismaClient as a named export;
// access it from the package default to avoid "no exported member" errors.
const { PrismaClient } = pkg as any;

const prisma = new PrismaClient();

export default prisma;

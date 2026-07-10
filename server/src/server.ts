import dotenv from "dotenv";
import { execSync } from "child_process";
import prisma from "./config/db.js";

dotenv.config();

try {
  if (process.env.NODE_ENV !== "production") {
    console.log("⏳ Applying Prisma schema to the database...");
    execSync("npx prisma db push --schema prisma/schema.prisma", {
      stdio: "inherit",
    });
  }
} catch (err) {
  console.error("⚠️ Prisma db push failed:", err);
}

import app from "./app.js";

async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

testDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

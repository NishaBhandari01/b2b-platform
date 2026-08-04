import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

console.log("Using database:", process.env.DATABASE_URL);

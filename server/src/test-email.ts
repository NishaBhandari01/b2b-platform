// import { transporter } from "./utils/mail.js";

// async function main() {
//   try {
//     await transporter.verify();
//     console.log("✅ SMTP Connected Successfully");
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();

import "dotenv/config";
import { transporter } from "./utils/mail.js";

console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
});

async function main() {
  try {
    await transporter.verify();
    console.log("SMTP Connected");
  } catch (err) {
    console.error(err);
  }
}

main();

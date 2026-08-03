import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true only if using port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   await transporter.sendMail({
//     from: `"B2B Platform" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log("======================================");
  console.log("📨 Sending Email...");
  console.log("From:", process.env.SMTP_USER);
  console.log("To:", to);
  console.log("Subject:", subject);

  try {
    const info = await transporter.sendMail({
      from: `"B2B Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("======================================");

    return info;
  } catch (error) {
    console.error("======================================");
    console.error("❌ Nodemailer Error:");
    console.error(error);
    console.error("======================================");
    throw error;
  }
};

import { sendEmail } from "./email.service.js";

export function registerUser(email: string) {
  const result = sendEmail(email);
  return result;
}

import cryptp from "crypto";

export const generateResetToken = () => {
  const token = cryptp.randomBytes(32).toString("hex");

  const hashedToken = cryptp.createHash("sha256").update(token).digest("hex");

  return {
    token,
    hashedToken,
  };
};
